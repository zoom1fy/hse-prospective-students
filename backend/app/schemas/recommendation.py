from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RecommendationResponse(BaseModel):
    id: int
    id_user: int
    id_program: int
    rank: int | None = Field(default=None, ge=1)
    explanation: str | None = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class RecommendationGenerateRequest(BaseModel):
    top_n: int = Field(default=3, ge=1, le=20)
