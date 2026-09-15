from pydantic import BaseModel, ConfigDict, EmailStr


class UniversityBase(BaseModel):
    name: str
    email: EmailStr | None = None
    short_name: str | None = None
    description: str | None = None
    official_url: str | None = None
    logo: str | None = None
    id_region: int


class UniversityCreate(UniversityBase):
    pass


class UniversityResponse(UniversityBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
