import asyncio
import os
import logging
from database import AsyncSessionLocal, engine, Base
from models import Model as DBModel
from sqlalchemy import select
from intent_parser import intent_parser

logger = logging.getLogger('inject_proprietary')
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
logger.addHandler(ch)

PROPRIETARY_MODELS = [
    {
        "name": "GPT-4o",
        "slug": "openai-gpt-4o",
        "developer": "OpenAI",
        "category": "LLM",
        "description": "OpenAI's flagship multi-modal online model with exceptional coding capabilities, speed, and massive context window. Ideal for complex reasoning tasks.",
        "open_weight": False,
        "offline_capable": False,
        "license": "Proprietary",
        "context_window": 128000,
        "website_url": "https://openai.com/chatgpt"
    },
    {
        "name": "Claude 3.5 Sonnet",
        "slug": "anthropic-claude-3-5-sonnet",
        "developer": "Anthropic",
        "category": "LLM",
        "description": "Anthropic's most intelligent online model to date, providing state-of-the-art coding capabilities, vision, and a massive 200K context window.",
        "open_weight": False,
        "offline_capable": False,
        "license": "Proprietary",
        "context_window": 200000,
        "website_url": "https://anthropic.com/claude"
    },
    {
        "name": "Gemini 1.5 Pro",
        "slug": "google-gemini-1-5-pro",
        "developer": "Google",
        "category": "LLM",
        "description": "Google's most capable online AI model, featuring an industry-leading 2 million token context window, deep coding proficiency, and native multimodal reasoning.",
        "open_weight": False,
        "offline_capable": False,
        "license": "Proprietary",
        "context_window": 2000000,
        "website_url": "https://deepmind.google/technologies/gemini/"
    },
    {
        "name": "Claude 3 Opus",
        "slug": "anthropic-claude-3-opus",
        "developer": "Anthropic",
        "category": "LLM",
        "description": "Highly capable online model for highly complex tasks, navigating open-ended prompts and sight-unseen scenarios with remarkable fluency.",
        "open_weight": False,
        "offline_capable": False,
        "license": "Proprietary",
        "context_window": 200000,
        "website_url": "https://anthropic.com/claude"
    },
    {
        "name": "GPT-4o mini",
        "slug": "openai-gpt-4o-mini",
        "developer": "OpenAI",
        "category": "LLM",
        "description": "OpenAI's most cost-efficient small model that is online, faster, and cheaper while maintaining strong coding and multi-modal capabilities.",
        "open_weight": False,
        "offline_capable": False,
        "license": "Proprietary",
        "context_window": 128000,
        "website_url": "https://openai.com"
    }
]

async def inject_proprietary():
    async with engine.begin() as conn:
        from sqlalchemy import text
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        for item in PROPRIETARY_MODELS:
            slug = item["slug"]
            
            # Generate embedding
            text_for_embedding = f"{item['name']} {item['developer']} {item['description']} online api coding large context window"
            embedding_vector = intent_parser.generate_embedding(text_for_embedding)
            
            existing_result = await session.execute(select(DBModel).where(DBModel.slug == slug))
            existing_model = existing_result.scalar_one_or_none()
            if existing_model:
                logger.info(f"[-] Model {slug} already exists.")
                if embedding_vector is not None:
                    existing_model.embedding = embedding_vector
                    await session.commit()
                continue
                
            new_model = DBModel(
                name=item["name"],
                slug=slug,
                developer=item["developer"],
                category=item["category"],
                description=item["description"],
                open_weight=item["open_weight"],
                offline_capable=item["offline_capable"],
                status="active",
                embedding=embedding_vector,
                license=item["license"],
                context_window=item["context_window"],
                repository_url=item["website_url"]
            )
            session.add(new_model)
            try:
                await session.commit()
                logger.info(f"[+] Injected: {slug}")
            except Exception as e:
                await session.rollback()
                logger.error(f"[!] Failed to inject {slug}: {e}")

if __name__ == "__main__":
    asyncio.run(inject_proprietary())
