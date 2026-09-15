from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import programs
from app.db.database import get_db
from app.schemas.program import ProgramCreate, ProgramResponse

router = APIRouter()


@router.get("/", response_model=list[ProgramResponse])
async def get_programs(
    region_id: int | None = None,
    university_id: int | None = None,
    faculty_id: int | None = None,
    education_level_id: int | None = None,
    type_study_id: int | None = None,
    is_active: bool | None = Query(default=True),
    db: AsyncSession = Depends(get_db),
):
    return await programs.get_programs(
        db,
        region_id=region_id,
        university_id=university_id,
        faculty_id=faculty_id,
        education_level_id=education_level_id,
        type_study_id=type_study_id,
        is_active=is_active,
    )


@router.get("/{program_id}", response_model=ProgramResponse)
async def get_program(program_id: int, db: AsyncSession = Depends(get_db)):
    program = await programs.get_program(db, program_id)
    if not program:
        raise HTTPException(404, "Program not found")
    return program


@router.post("/", response_model=ProgramResponse, status_code=201)
async def create_program(data: ProgramCreate, db: AsyncSession = Depends(get_db)):
    return await programs.create_program(db, data)
