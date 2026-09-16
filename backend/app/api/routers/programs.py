from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.crud import programs
from app.db.database import get_db
from app.models.user import User
from app.schemas.program import ProgramCreate, ProgramResponse, ProgramUpdate

router = APIRouter()


@router.get("/", response_model=list[ProgramResponse])
async def get_programs(
    region_id: int | None = None,
    university_id: int | None = None,
    faculty_id: int | None = None,
    education_level_id: int | None = None,
    type_study_id: int | None = None,
    is_active: bool | None = Query(default=True),
    include_inactive: bool = Query(default=False),
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
        include_inactive=include_inactive,
    )


@router.get("/{program_id}", response_model=ProgramResponse)
async def get_program(program_id: int, db: AsyncSession = Depends(get_db)):
    program = await programs.get_program(db, program_id)
    if not program:
        raise HTTPException(404, "Program not found")
    return program


@router.post("/", response_model=ProgramResponse, status_code=201)
async def create_program(
    data: ProgramCreate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await programs.create_program(db, data)


@router.patch("/{program_id}", response_model=ProgramResponse)
async def update_program(
    program_id: int,
    data: ProgramUpdate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    program = await programs.get_program(db, program_id)
    if not program:
        raise HTTPException(404, "Program not found")
    return await programs.update_program(db, program, data)


@router.delete("/{program_id}", status_code=204)
async def delete_program(
    program_id: int,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    program = await programs.get_program(db, program_id)
    if not program:
        raise HTTPException(404, "Program not found")
    try:
        await programs.delete_program(db, program)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(409, "Нельзя удалить программу: есть связанные заявления") from None
