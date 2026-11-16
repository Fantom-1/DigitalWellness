import asyncio
import requests
from bs4 import BeautifulSoup
import re
import os
import logging
from database import AsyncSessionLocal, engine, Base
from models import Model as DBModel
from sqlalchemy import select
from intent_parser import intent_parser

# Setup Logging
log_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(log_dir, exist_ok=True)

logger = logging.getLogger('ollama_connector')
logger.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# File Handler
fh = logging.FileHandler(os.path.join(log_dir, 'ingestion.log'))
fh.setFormatter(formatter)
logger.addHandler(fh)

# Console Handler
ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

async def scrape_ollama_library():
    logger.info("Starting Ollama library scrape...")
    url = "https://ollama.com/library"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except Exception as e:
        logger.error(f"Failed to fetch Ollama library: {e}")
        return
        
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Ollama library lists models in a grid with anchor tags pointing to /library/modelname
    model_links = soup.find_all('a', href=re.compile(r'^/library/'))
    
    # We use a set to avoid duplicates since there might be multiple links per model
    extracted_models = {}
    
    for link in model_links:
        href = link.get('href')
        parts = href.split('/')
        if len(parts) == 3: # /library/llama3
            model_name = parts[2]
            
            # Find the heading inside the link
            h2 = link.find('h2')
            if not h2: continue
            
            # Find the paragraph (description)
            p = link.find('p')
            desc = p.text.strip() if p else f"{model_name} from Ollama"
            
            # Find tags (params)
            spans = link.find_all('span')
            params = "Unknown"
            for span in spans:
                if 'B' in span.text or 'b' in span.text:
                    if len(span.text) < 6: # e.g. "8B"
                        params = span.text.strip().upper()
                        break
                        
            extracted_models[model_name] = {
                'name': h2.text.strip(),
                'slug': f"ollama-{model_name}",
                'description': desc,
                'params': params
            }

    logger.info(f"Found {len(extracted_models)} models from Ollama registry.")
    
    async with AsyncSessionLocal() as session:
        for raw_name, data in extracted_models.items():
            slug = data['slug']
            
            # Check if exists
            existing = await session.execute(select(DBModel).where(DBModel.slug == slug))
            if existing.scalar_one_or_none():
                logger.info(f"Model {slug} already exists. Skipping.")
                continue
                
            logger.info(f"Generating embeddings for {slug}...")
            embedding_vector = intent_parser.generate_embedding(data['description'])
            
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
                embedding=embedding_vector,
                license="Ollama",
                parameter_count_display=data['params'],
                vram_required_gb=vram_gb,
                offline_capable=True
            )
            session.add(new_model)
            try:
                await session.commit()
                logger.info(f"Successfully injected: {slug}")
            except Exception as e:
                await session.rollback()
                logger.error(f"Failed to inject {slug}: {e}")

if __name__ == "__main__":
    asyncio.run(scrape_ollama_library())
