from typing import List, Optional
from pydantic import BaseModel, Field


class ReviewItem(BaseModel):
    id: Optional[str] = None
    content: str = Field(..., description="Raw feedback text content")
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    author: Optional[str] = "Anonymous"
    source: Optional[str] = "Direct"


class AnalysisRequest(BaseModel):
    business_name: Optional[str] = "Demo Business"
    reviews: List[ReviewItem] = Field(..., min_length=1)


class ReviewAnalysisResult(BaseModel):
    id: Optional[str] = None
    content: str
    sentiment: str = Field(..., description="POSITIVE, NEGATIVE, or NEUTRAL")
    sentiment_score: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    priority: str = Field(..., description="CRITICAL, HIGH, MEDIUM, or LOW")
    topics: List[str] = Field(default_factory=list)
    key_phrases: List[str] = Field(default_factory=list)


class AnalysisResponse(BaseModel):
    total_analyzed: int
    overall_sentiment: str
    positive_percentage: float
    negative_percentage: float
    neutral_percentage: float
    average_confidence: float
    results: List[ReviewAnalysisResult]
