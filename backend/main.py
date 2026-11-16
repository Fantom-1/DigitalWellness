from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, cast, String
from sqlalchemy.dialects.postgresql import JSONB

from database import get_db, engine, Base
from models import WellnessResource, SetupGuide, StudentSubmission
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

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
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
