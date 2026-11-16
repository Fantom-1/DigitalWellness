import asyncio
import json
import os
from database import engine, Base, AsyncSessionLocal
from models import WellnessResource, SetupGuide
from seed_data import RESOURCES, GUIDES
from sqlalchemy import select, delete

async def seed():
    print("Connecting to database and creating tables if missing...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Clear existing wellness data to prevent duplicates
        print("Clearing prior wellness records...")
        await session.execute(delete(WellnessResource))
        await session.execute(delete(SetupGuide))
        await session.commit()

        print(f"Seeding {len(RESOURCES)} curated wellness resources...")
        for r in RESOURCES:
            resource = WellnessResource(
                name=r["name"],
                slug=r["slug"],
                tagline=r["tagline"],
                description=r["description"],
                category=r["category"],
                developer_or_team=r["developer_or_team"],
                official_url=r["official_url"],
                repository_url=r["repository_url"],
                platforms=r["platforms"],
                pricing_type=r["pricing_type"],
                price_details=r["price_details"],
                purpose=r["purpose"],
                privacy_rating=r["privacy_rating"],
                privacy_details=r["privacy_details"],
                accessibility_features=r["accessibility_features"],
                limitations=r["limitations"],
                verified_date=r["verified_date"],
                student_rating=r["student_rating"],
                embedding=None
            )
            session.add(resource)

        print(f"Seeding {len(GUIDES)} practical setup guides...")
        for g in GUIDES:
            guide = SetupGuide(
                slug=g["slug"],
                title=g["title"],
                summary=g["summary"],
                category=g["category"],
                target_platforms=g["target_platforms"],
                estimated_minutes=g["estimated_minutes"],
                difficulty=g["difficulty"],
                steps=g["steps"],
                key_takeaways=g["key_takeaways"]
            )
            session.add(guide)

        await session.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
