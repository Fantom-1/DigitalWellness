from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, cast, String
from sqlalchemy.dialects.postgresql import JSONB

from database import get_db, engine, Base, AsyncSessionLocal
from models import WellnessResource, SetupGuide, StudentSubmission
from seed_data import RESOURCES, GUIDES
from schemas import (
    WellnessResourceResponse,
    ResourceListResponse,
    SetupGuideResponse,
    StudentSubmissionCreate,
    StudentSubmissionResponse,
    ChatRequest,
    ChatResponse
)
from wellness_advisor import wellness_advisor
from sqlalchemy import text

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        for col_sql in [
            "ALTER TABLE wellness_resources ADD COLUMN IF NOT EXISTS image_url TEXT;",
            "ALTER TABLE wellness_resources ADD COLUMN IF NOT EXISTS video_tutorial_url TEXT;",
            "ALTER TABLE wellness_resources ADD COLUMN IF NOT EXISTS documentation_url TEXT;",
            "ALTER TABLE wellness_resources ADD COLUMN IF NOT EXISTS extension_url TEXT;",
            "ALTER TABLE setup_guides ADD COLUMN IF NOT EXISTS video_url TEXT;",
        ]:
            try:
                await conn.execute(text(col_sql))
            except Exception:
                pass

    async with AsyncSessionLocal() as session:
        for r in RESOURCES:
            existing = await session.execute(select(WellnessResource).where(WellnessResource.slug == r["slug"]))
            if not existing.scalar_one_or_none():
                session.add(WellnessResource(
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
                    image_url=r.get("image_url"),
                    video_tutorial_url=r.get("video_tutorial_url"),
                    documentation_url=r.get("documentation_url"),
                    extension_url=r.get("extension_url")
                ))
        for g in GUIDES:
            existing_g = await session.execute(select(SetupGuide).where(SetupGuide.slug == g["slug"]))
            if not existing_g.scalar_one_or_none():
                session.add(SetupGuide(
                    slug=g["slug"],
                    title=g["title"],
                    summary=g["summary"],
                    category=g["category"],
                    target_platforms=g["target_platforms"],
                    estimated_minutes=g["estimated_minutes"],
                    difficulty=g["difficulty"],
                    video_url=g.get("video_url"),
                    steps=g["steps"],
                    key_takeaways=g["key_takeaways"]
                ))
        await session.commit()
    yield

app = FastAPI(
    title="Digital Wellness Hub API",
    description="Curated digital wellness resources, comparison engine, setup guides, and AI wellness advisor for students.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "app": "Digital Wellness Resource Hub"}

@app.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    res_count = await db.execute(select(func.count(WellnessResource.id)))
    guide_count = await db.execute(select(func.count(SetupGuide.id)))
    sub_count = await db.execute(select(func.count(StudentSubmission.id)))
    
    return {
        "total_resources": res_count.scalar_one(),
        "total_guides": guide_count.scalar_one(),
        "total_submissions": sub_count.scalar_one(),
        "verified_date": "November 2026"
    }

@app.get("/resources", response_model=ResourceListResponse)
async def list_resources(
    q: Optional[str] = None,
    category: Optional[str] = None,
    platform: Optional[str] = None,
    pricing_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(WellnessResource)

    if category and category.lower() != "all":
        query = query.where(WellnessResource.category == category)

    if pricing_type and pricing_type.lower() != "all":
        query = query.where(WellnessResource.pricing_type == pricing_type)

    if platform and platform.lower() != "all":
        # Search JSONB array as text representation
        query = query.where(cast(WellnessResource.platforms, String).ilike(f"%{platform}%"))

    if q and q.strip():
        search_term = f"%{q.strip()}%"
        query = query.where(
            or_(
                WellnessResource.name.ilike(search_term),
                WellnessResource.tagline.ilike(search_term),
                WellnessResource.description.ilike(search_term),
                WellnessResource.purpose.ilike(search_term),
                WellnessResource.limitations.ilike(search_term)
            )
        )

    # Order by rating descending
    query = query.order_by(WellnessResource.student_rating.desc())
    result = await db.execute(query)
    resources = result.scalars().all()

    return {
        "count": len(resources),
        "results": resources
    }

@app.get("/resources/{slug}", response_model=WellnessResourceResponse)
async def get_resource(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(WellnessResource).where(WellnessResource.slug == slug))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource

@app.get("/guides", response_model=List[SetupGuideResponse])
async def list_guides(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SetupGuide).order_by(SetupGuide.estimated_minutes))
    return result.scalars().all()

@app.get("/guides/{slug}", response_model=SetupGuideResponse)
async def get_guide(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SetupGuide).where(SetupGuide.slug == slug))
    guide = result.scalar_one_or_none()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    return guide

@app.post("/submissions", response_model=StudentSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(payload: StudentSubmissionCreate, db: AsyncSession = Depends(get_db)):
    new_sub = StudentSubmission(
        student_name=payload.student_name,
        email=payload.email,
        submission_type=payload.submission_type,
        content=payload.content,
        media_url=payload.media_url
    )
    db.add(new_sub)
    await db.commit()
    await db.refresh(new_sub)
    return new_sub

@app.get("/submissions", response_model=List[StudentSubmissionResponse])
async def list_submissions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudentSubmission).order_by(StudentSubmission.created_at.desc()))
    return result.scalars().all()

@app.post("/chat", response_model=ChatResponse)
async def chat_with_advisor(payload: ChatRequest):
    advice = await wellness_advisor.get_advice(
        user_message=payload.message,
        history=payload.history,
        preferred_platform=payload.preferred_platform
    )
    return advice
