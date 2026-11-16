import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Boolean, Integer, Numeric, Date, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from database import Base

try:
    from pgvector.sqlalchemy import Vector
    HAS_PGVECTOR = True
except ImportError:
    HAS_PGVECTOR = False

class WellnessResource(Base):
    __tablename__ = "wellness_resources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    tagline = Column(String)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False, index=True)  # focus_blocker, screen_time, bedtime_routine, privacy_safety, browser_extension
    developer_or_team = Column(String)
    official_url = Column(String)
    repository_url = Column(String, nullable=True)
    platforms = Column(JSONB, nullable=False, default=list)  # ["macOS", "Windows", "iOS", "Android", "Chrome", "Firefox"]
    
    # Strictly verified pricing criteria
    pricing_type = Column(String, nullable=False, index=True)  # 100% Free, Open Source, Freemium, Paid
    price_details = Column(Text, nullable=False)
    
    # Rubric comparison criteria
    purpose = Column(Text, nullable=False)
    privacy_rating = Column(String, nullable=False)  # A+, A, B+, B, C
    privacy_details = Column(Text, nullable=False)
    accessibility_features = Column(Text, nullable=False)
    limitations = Column(Text, nullable=False)
    verified_date = Column(String, nullable=False, default="2026-11-16")
    student_rating = Column(Numeric(2, 1), default=4.8)
    
    # Vector embedding for semantic search & RAG (768-dim for Gemini embeddings)
    if HAS_PGVECTOR:
        embedding = Column(Vector(768), nullable=True)
    else:
        embedding = Column(JSONB, nullable=True)

class SetupGuide(Base):
    __tablename__ = "setup_guides"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    target_platforms = Column(JSONB, nullable=False, default=list)
    estimated_minutes = Column(Integer, default=10)
    difficulty = Column(String, default="Beginner")  # Beginner, Intermediate, Advanced
    steps = Column(JSONB, nullable=False, default=list)  # list of {"step_number": 1, "title": "...", "description": "...", "tip": "..."}
    key_takeaways = Column(JSONB, nullable=False, default=list)

class StudentSubmission(Base):
    __tablename__ = "student_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    submission_type = Column(String, nullable=False)  # feedback, tool_suggestion, video_link, app_screen
    content = Column(Text, nullable=False)
    media_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending")  # pending, reviewed, published
