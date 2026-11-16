import asyncio
from database import AsyncSessionLocal, engine
from sqlalchemy import text

async def test():
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(text('SELECT count(*) FROM models;'))
            print('Model count in database:', result.scalar())
    except Exception as e:
        print("Error:", e)
    finally:
        await engine.dispose()

asyncio.run(test())
