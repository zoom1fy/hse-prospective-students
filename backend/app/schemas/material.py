from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MaterialSection(BaseModel):
    heading: str
    paragraphs: list[str] = []


class MaterialBase(BaseModel):
    slug: str = Field(min_length=1, max_length=150)
    title: str = Field(min_length=1, max_length=255)
    description: str
    icon: str = "FileText"
    read_time: str = "5 мин"
    is_published: bool = True
    sections: list[MaterialSection] = []


class MaterialCreate(MaterialBase):
    pass


class MaterialUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=150)
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    icon: str | None = None
    read_time: str | None = None
    is_published: bool | None = None
    sections: list[MaterialSection] | None = None


class MaterialResponse(MaterialBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
