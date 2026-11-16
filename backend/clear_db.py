import asyncio
from database import engine, Base
from models import Model, EditProposal

async def clear_db():
    print("Clearing the Neon database...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("Database cleared and schema recreated perfectly!")

if __name__ == "__main__":
    asyncio.run(clear_db())
