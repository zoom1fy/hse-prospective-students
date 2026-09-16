from pydantic import BaseModel, ConfigDict


class FacultyBase(BaseModel):
    name: str
    short_name: str | None = None
    official_url: str | None = None
    id_university: int


class FacultyCreate(FacultyBase):
    pass


class FacultyUpdate(BaseModel):
    name: str | None = None
    short_name: str | None = None
    official_url: str | None = None
    id_university: int | None = None


class FacultyResponse(FacultyBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
