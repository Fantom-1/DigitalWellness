import asyncio
import json
import urllib.request
import os
import logging
from database import AsyncSessionLocal, engine, Base
from models import Model as DBModel
from sqlalchemy import select
from intent_parser import intent_parser

# Setup Logging
log_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(log_dir, exist_ok=True)

logger = logging.getLogger('hf_connector')
logger.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

fh = logging.FileHandler(os.path.join(log_dir, 'ingestion.log'))
fh.setFormatter(formatter)
logger.addHandler(fh)

ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

async def fetch_hf_models():
    logger.info("Fetching top models across ALL categories from Hugging Face...")
    url = "https://huggingface.co/api/models?sort=downloads&direction=-1&limit=1000"
    
    req = urllib.request.Request(url, headers={'User-Agent': 'GroundZero-Crawler/1.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
    logger.info(f"Found {len(data)} models. Ingesting into Ground-Zero database...")
    
    # Ensure tables exist
    from sqlalchemy import text
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        for item in data:
            slug = item.get("id").replace("/", "-").lower()
            
            # Generate embedding
            description = item.get("id", "") + " " + (item.get("pipeline_tag", "LLM"))
            embedding_vector = intent_parser.generate_embedding(description)
            
            # Check if exists
            existing_result = await session.execute(select(DBModel).where(DBModel.slug == slug))
            existing_model = existing_result.scalar_one_or_none()
            if existing_model:
                if existing_model.embedding is None and embedding_vector is not None:
                    existing_model.embedding = embedding_vector
                    await session.commit()
                    logger.info(f"[*] Updated embedding for: {slug}")
                else:
                    logger.info(f"[-] Model {slug} already indexed, skipping.")
                continue
                
            # Generate embedding
            description = item.get("id", "") + " " + (item.get("pipeline_tag", "LLM"))
            embedding_vector = intent_parser.generate_embedding(description)
            
            tags = item.get("tags", [])
            license_str = "Unknown"
            for t in tags:
                if t.startswith("license:"):
                    license_str = t.split("license:")[1]
            
            # Simple parameter inference for demo
            param_str = None
            vram_gb = 16 # Default
            id_lower = item.get("id", "").lower()
            
            import re
            # Extract number before 'b'
            match = re.search(r'(\d+(?:\.\d+)?)b\b', id_lower)
            if match:
                param_str = match.group(1).upper() + "B"
                try:
                    # Rough estimate: 1B params ~= 1.2GB VRAM quantized
                    vram_gb = int(float(match.group(1)) * 1.2)
                except:
                    pass
                    
            if vram_gb < 1: vram_gb = 1
            offline = vram_gb <= 16
            
            # Create generic mapping
            new_model = DBModel(
                name=item.get("id"),
                slug=slug,
                developer=item.get("author") or item.get("id").split("/")[0],
                category=item.get("pipeline_tag", "LLM"),
                repository_url=f"https://huggingface.co/{item.get('id')}",
                open_weight=True,
                status="active",
                embedding=embedding_vector,
                license=license_str,
                parameter_count_display=param_str,
                vram_required_gb=vram_gb,
                offline_capable=offline
            )
            session.add(new_model)
            try:
                await session.commit()
                logger.info(f"[+] Injected: {slug}")
            except Exception as e:
                await session.rollback()
                logger.error(f"[!] Failed to inject {slug}: {e}")

if __name__ == "__main__":
    asyncio.run(fetch_hf_models())
