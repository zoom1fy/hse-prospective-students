from pydantic import BaseModel, ConfigDict


class ReferenceCreate(BaseModel):
    name: str


class ReferenceResponse(ReferenceCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)
