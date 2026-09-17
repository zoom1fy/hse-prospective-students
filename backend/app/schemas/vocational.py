from pydantic import BaseModel, ConfigDict, Field


class TestSubmitRequest(BaseModel):
    ege_score: int = Field(ge=0, le=400)
    preferred_city: str | None = None
    interests: list[str] = Field(default_factory=list)


class MatchedSpecialty(BaseModel):
    id: int
    name: str
    min_ege_score: int
    tags: list[str]
    match_score: int
    university_id: int
    university_name: str
    city: str
    model_config = ConfigDict(from_attributes=True)


class MatchResponse(BaseModel):
    matches: list[MatchedSpecialty]
