from datetime import datetime

from pydantic import BaseModel, ConfigDict


class StatementCreate(BaseModel):
    id_program: int
    id_status: int


class StatementUpdate(BaseModel):
    id_status: int


class StatementResponse(BaseModel):
    id: int
    id_user: int
    id_program: int
    id_status: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class StatementTreeProgram(BaseModel):
    id: int
    name: str
    official_url: str | None = None
    status: str


class StatementTreeFaculty(BaseModel):
    id: int
    name: str
    official_url: str | None = None
    programs: list[StatementTreeProgram]


class StatementTreeUniversity(BaseModel):
    id: int
    name: str
    official_url: str | None = None
    faculties: list[StatementTreeFaculty]


class StatementTreeResponse(BaseModel):
    universities: list[StatementTreeUniversity]


class AdminStatementResponse(BaseModel):
    id: int
    id_user: int
    user_name: str
    id_program: int
    program_name: str
    id_status: int
    status_name: str
    created_at: datetime
    updated_at: datetime
