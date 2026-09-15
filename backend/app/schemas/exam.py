from pydantic import BaseModel, ConfigDict, Field


class ExamCreate(BaseModel):
    name: str


class ExamResponse(ExamCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ProgramExamCreate(BaseModel):
    id_program: int
    id_exam: int
    passing_score: int | None = Field(default=None, ge=0)


class UserExamCreate(BaseModel):
    id_exam: int
    score_achieved: int = Field(ge=0)


class UserExamResponse(UserExamCreate):
    id: int
    id_user: int
    model_config = ConfigDict(from_attributes=True)
