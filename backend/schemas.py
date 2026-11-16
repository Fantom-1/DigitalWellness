from typing import List, Optional, Any
from pydantic import BaseModel, HttpUrl
from datetime import datetime
from uuid import UUID

class WellnessResourceBase(BaseModel):
    name: str
    slug: str
    tagline: Optional[str] = None
    description: str
    category: str
    developer_or_team: Optional[str] = None
    official_url: Optional[str] = None
    repository_url: Optional[str] = None
    platforms: List[str]
    pricing_type: str
    price_details: str
    purpose: str
    privacy_rating: str
    privacy_details: str
    accessibility_features: str
    limitations: str
    verified_date: str
    student_rating: Optional[float] = 4.8
    image_url: Optional[str] = None
    video_tutorial_url: Optional[str] = None

class WellnessResourceResponse(WellnessResourceBase):
    id: UUID

    class Config:
        from_attributes = True

class ResourceListResponse(BaseModel):
    count: int
    results: List[WellnessResourceResponse]

class SetupGuideResponse(BaseModel):
    id: UUID
    slug: str
    title: str
    summary: str
    category: str
    target_platforms: List[str]
    estimated_minutes: int
    difficulty: str
    video_url: Optional[str] = None
    steps: List[dict]
    key_takeaways: List[str]

    class Config:
        from_attributes = True

class StudentSubmissionCreate(BaseModel):
    student_name: Optional[str] = "Anonymous Student"
    email: Optional[str] = None
    submission_type: str  # feedback, tool_suggestion, video_link, app_screen
    content: str
    media_url: Optional[str] = None

class StudentSubmissionResponse(StudentSubmissionCreate):
    id: UUID
    created_at: datetime
    status: str

    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    role: str  # user, assistant, system
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    preferred_platform: Optional[str] = None

class ChatToolRecommendation(BaseModel):
    slug: str
    name: str
    pricing_type: str
    category: str
    reason: str

class ChatResponse(BaseModel):
    reply: str
    recommended_tools: List[ChatToolRecommendation] = []
    relevant_guide_slug: Optional[str] = None
