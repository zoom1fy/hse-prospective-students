from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProgramBase(BaseModel):
    name: str
    code: str
    description: str | None = None
    official_url: str | None = None
    duration_years: int = Field(gt=0)
    budget_places: int = Field(default=0, ge=0)
    paid_places: int = Field(default=0, ge=0)
    tuition_price: Decimal | None = Field(default=None, ge=0)
    is_active: bool = True
    id_type_study: int
    id_education_level: int
    id_faculty: int


class ProgramCreate(ProgramBase):
    pass


class ProgramUpdate(BaseModel):
    name: str | None = None
    code: str | None = None
    description: str | None = None
    official_url: str | None = None
    duration_years: int | None = Field(default=None, gt=0)
    budget_places: int | None = Field(default=None, ge=0)
    paid_places: int | None = Field(default=None, ge=0)
    tuition_price: Decimal | None = Field(default=None, ge=0)
    is_active: bool | None = None
    id_type_study: int | None = None
    id_education_level: int | None = None
    id_faculty: int | None = None


class ProgramResponse(ProgramBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
