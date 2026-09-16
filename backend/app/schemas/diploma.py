from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DiplomaTypeResponse(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)


class DiplomaCreate(BaseModel):
    id_diploma_type: int
    name: str = Field(min_length=1, max_length=255)
    institution: str = Field(min_length=1, max_length=255)
    year: int = Field(ge=1900, le=2100)
    average_score: float | None = Field(default=None, ge=0, le=5)


class DiplomaResponse(BaseModel):
    id: int
    id_user: int
    id_diploma_type: int
    type_name: str
    name: str
    institution: str
    year: int
    average_score: float | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
