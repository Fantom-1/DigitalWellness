import asyncio
import os
import json
import logging
import urllib.request
import re
import requests
from bs4 import BeautifulSoup
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from database import AsyncSessionLocal, engine, Base
from models import Model as DBModel
from sqlalchemy import select
from sqlalchemy import text
from intent_parser import intent_parser

# Setup Logging
log_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(log_dir, exist_ok=True)

logger = logging.getLogger('groundzero_engine')
logger.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

fh = logging.FileHandler(os.path.join(log_dir, 'engine.log'))
fh.setFormatter(formatter)
logger.addHandler(fh)

ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

async def init_db():
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        await conn.run_sync(Base.metadata.create_all)

async def hf_sync_task():
    logger.info("[HF Sync] Starting Hugging Face model synchronization...")
    url = "https://huggingface.co/api/models?sort=downloads&direction=-1&limit=1000"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'GroundZero-Engine/1.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            
        async with AsyncSessionLocal() as session:
            new_count = 0
            for item in data:
                slug = item.get("id").replace("/", "-").lower()
                
                existing = await session.execute(select(DBModel).where(DBModel.slug == slug))
                if existing.scalar_one_or_none():
                    continue
                
                # Insert without description/embedding (Enrichment task will handle it)
                vram_gb = 16
                param_str = None
                id_lower = item.get("id", "").lower()
                match = re.search(r'(\d+(?:\.\d+)?)b\b', id_lower)
                if match:
                    param_str = match.group(1).upper() + "B"
                    try:
                        vram_gb = int(float(match.group(1)) * 1.2)
                    except:
                        pass
                
                if vram_gb < 1: vram_gb = 1
                offline = vram_gb <= 16
                
                new_model = DBModel(
                    name=item.get("id"),
                    slug=slug,
                    developer=item.get("author") or item.get("id").split("/")[0],
                    category=item.get("pipeline_tag", "LLM"),
                    repository_url=f"https://huggingface.co/{item.get('id')}",
                    open_weight=True,
                    status="active",
                    embedding=None,
                    description=None, # Marked for enrichment
                    parameter_count_display=param_str,
                    vram_required_gb=vram_gb,
                    offline_capable=offline
                )
                session.add(new_model)
                new_count += 1
                
            if new_count > 0:
                await session.commit()
                logger.info(f"[HF Sync] Added {new_count} new models to the database.")
            else:
                logger.info("[HF Sync] No new models found.")
                
    except Exception as e:
        logger.error(f"[HF Sync] Failed: {e}")

async def ollama_sync_task():
    logger.info("[Ollama Sync] Starting Ollama model synchronization...")
    url = "https://ollama.com/library"
    headers = {'User-Agent': 'GroundZero-Engine/1.0'}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        model_links = soup.find_all('a', href=re.compile(r'^/library/'))
        extracted_models = {}
        
        for link in model_links:
            href = link.get('href')
            parts = href.split('/')
            if len(parts) == 3:
                model_name = parts[2]
                h2 = link.find('h2')
                if not h2: continue
                p = link.find('p')
                desc = p.text.strip() if p else f"{model_name} from Ollama"
                
                spans = link.find_all('span')
                params = "Unknown"
                for span in spans:
                    if 'B' in span.text or 'b' in span.text:
                        if len(span.text) < 6:
                            params = span.text.strip().upper()
                            break
                            
                extracted_models[model_name] = {
                    'name': h2.text.strip(),
                    'slug': f"ollama-{model_name}",
                    'description': desc,
                    'params': params
                }

        async with AsyncSessionLocal() as session:
            new_count = 0
            for raw_name, data in extracted_models.items():
                slug = data['slug']
                
                existing = await session.execute(select(DBModel).where(DBModel.slug == slug))
                if existing.scalar_one_or_none():
                    continue
                    
                vram_gb = 16
                if data['params'] != "Unknown":
                    try:
                        vram_gb = int(float(re.sub(r'[^0-9.]', '', data['params'])) * 1.2)
                    except:
                        pass
                if vram_gb < 1: vram_gb = 1
                
                new_model = DBModel(
                    name=data['name'],
                    slug=slug,
                    developer="Ollama Library",
                    category="LLM",
                    description=data['description'],
                    repository_url=f"https://ollama.com/library/{raw_name}",
                    open_weight=True,
                    status="active",
                    embedding=None, # Marked for enrichment
                    license="Ollama",
                    parameter_count_display=data['params'],
                    vram_required_gb=vram_gb,
                    offline_capable=True
                )
                session.add(new_model)
                new_count += 1
                
            if new_count > 0:
                await session.commit()
                logger.info(f"[Ollama Sync] Added {new_count} new models to the database.")
            else:
                logger.info("[Ollama Sync] No new models found.")
                
    except Exception as e:
        logger.error(f"[Ollama Sync] Failed: {e}")

async def enrichment_task():
    """
    Runs frequently to process a small batch of models missing descriptions or embeddings.
    Strictly rate-limited to avoid hitting free-tier caps (Max 5 per run).
    """
    logger.debug("[Enrichment] Checking for models needing LLM enrichment...")
    try:
        async with AsyncSessionLocal() as session:
            # Find up to 5 models missing descriptions OR missing embeddings
            query = select(DBModel).where(
                (DBModel.description == None) | (DBModel.embedding == None)
            ).order_by(DBModel.id).limit(5)
            
            result = await session.execute(query)
            models = result.scalars().all()
            
            if not models:
                return

            logger.info(f"[Enrichment] Found {len(models)} models needing enrichment. Processing...")
            
            for model in models:
                repo_id = model.repository_url.replace("https://huggingface.co/", "") if model.repository_url else model.name
                
                # Step 1: Fetch Description if missing (Only for HuggingFace)
                if model.description is None and 'huggingface.co' in (model.repository_url or ''):
                    readme_url = f"https://huggingface.co/{repo_id}/resolve/main/README.md"
                    try:
                        req = urllib.request.Request(readme_url, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(req, timeout=5) as response:
                            readme_content = response.read().decode('utf-8')
                            readme_snippet = readme_content[:2000]
                            
                            prompt = f"""
                            You are an expert AI model archivist. Read this snippet from a model's HuggingFace README and summarize its primary capabilities and use-cases in EXACTLY 2-3 concise sentences. Focus on what it actually does. Do not include introductory phrases like "This model is".
                            
                            README snippet:
                            {readme_snippet}
                            """
                            summary_res = intent_parser.client.models.generate_content(
                                model='gemini-2.5-flash',
                                contents=prompt
                            )
                            model.description = summary_res.text.strip().replace('\n', ' ')
                    except urllib.error.HTTPError as he:
                        if he.code == 404:
                            model.description = f"An AI model by {model.developer} hosted on Hugging Face."
                        else:
                            raise he
                            
                # Fallback if still missing
                if model.description is None:
                    model.description = f"An advanced AI model optimized for specific downstream tasks."

                # Step 2: Generate Embedding if missing
                if model.embedding is None:
                    text_to_embed = f"{model.name} {model.category} {model.description}"
                    embedding_vector = intent_parser.generate_embedding(text_to_embed)
                    if embedding_vector:
                        model.embedding = embedding_vector
                    else:
                        logger.warning(f"[Enrichment] LLM API returned None for embedding on {model.name}. Rate limit hit?")
                        # Skip committing this model if embedding fails so we retry next time
                        continue
                
                await session.commit()
                logger.info(f"[Enrichment] [+] Successfully enriched: {model.name}")
                
    except Exception as e:
        logger.error(f"[Enrichment] Failed during execution: {e}")

async def main():
    logger.info("Initializing Ground-Zero Engine...")
    await init_db()
    
    scheduler = AsyncIOScheduler()
    
    # Schedule syncs every 12 hours
    scheduler.add_job(hf_sync_task, IntervalTrigger(hours=12), id='hf_sync', replace_existing=True)
    scheduler.add_job(ollama_sync_task, IntervalTrigger(hours=12), id='ollama_sync', replace_existing=True)
    
    # Schedule LLM enrichment strictly at 1 batch per minute (safe for Free Tier)
    scheduler.add_job(enrichment_task, IntervalTrigger(minutes=1), id='enrichment', replace_existing=True)
    
    # Trigger initial syncs immediately on startup
    scheduler.add_job(hf_sync_task, id='hf_sync_init')
    scheduler.add_job(ollama_sync_task, id='ollama_sync_init')
    scheduler.add_job(enrichment_task, id='enrichment_init')

    scheduler.start()
    logger.info("Ground-Zero Engine started successfully. Press Ctrl+C to exit.")
    
    try:
        while True:
            await asyncio.sleep(3600)
    except (KeyboardInterrupt, SystemExit):
        logger.info("Shutting down Ground-Zero Engine...")

if __name__ == "__main__":
    asyncio.run(main())
