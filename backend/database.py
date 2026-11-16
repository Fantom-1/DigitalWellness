import os
import re
import urllib.parse
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

raw_url = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://postgres:postgres@localhost:5432/groundzero"
)

# Convert postgres:// or postgresql:// to postgresql+asyncpg:// if needed
if raw_url.startswith("postgres://"):
    raw_url = raw_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif raw_url.startswith("postgresql://") and not raw_url.startswith("postgresql+asyncpg://"):
    raw_url = raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Handle SSL and statement cache parameters for asyncpg
connect_args = {}
if any(k in raw_url for k in ["supabase.com", "supabase.co", "neon.tech", "ssl=require"]):
    try:
        parsed = urllib.parse.urlsplit(raw_url)
        DATABASE_URL = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, "", ""))
    except Exception:
        DATABASE_URL = raw_url.split("?")[0]
    connect_args["ssl"] = "require"
    # Disable prepared statement caching for Supabase connection poolers (Supavisor / PgBouncer)
    if "pooler.supabase.com" in raw_url or ":6543" in raw_url:
        connect_args["statement_cache_size"] = 0
else:
    DATABASE_URL = raw_url

engine = create_async_engine(
    DATABASE_URL, 
    echo=False, 
    connect_args=connect_args,
    pool_pre_ping=True
)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
