from pydantic import BaseModel, ConfigDict


class AchievementCategoryCreate(BaseModel):
    name: str


class AchievementCategoryResponse(AchievementCategoryCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class AchievementCreate(BaseModel):
    name: str
    id_category: int


class AchievementResponse(AchievementCreate):
    id: int
    id_user: int
    model_config = ConfigDict(from_attributes=True)
