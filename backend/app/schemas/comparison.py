from datetime import datetime

from pydantic import BaseModel


class ComparisonCreate(BaseModel):
    program_1_id: int
    program_2_id: int


class ComparisonResponse(BaseModel):
    id: int
    id_user: int
    id_program_1: int
    id_program_2: int
    selected_program_id: int | None
    explanation: str | None
    created_at: datetime

    class Config:
        from_attributes = True
