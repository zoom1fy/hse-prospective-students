from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.program import Program
from app.models.faculty import Faculty
from app.models.university import University
from app.schemas.program import ProgramCreate


async def get_program(session: AsyncSession, program_id: int) -> Program | None:
    result = await session.execute(select(Program).where(Program.id == program_id))
    return result.scalar_one_or_none()


async def get_programs(
    session: AsyncSession,
    region_id: int | None = None,
    university_id: int | None = None,
    faculty_id: int | None = None,
    education_level_id: int | None = None,
    type_study_id: int | None = None,
    is_active: bool | None = True,
) -> list[Program]:
    query = select(Program).join(Faculty, Program.id_faculty == Faculty.id).join(University, Faculty.id_university == University.id)

    if region_id is not None:
        query = query.where(University.id_region == region_id)
    if university_id is not None:
        query = query.where(Faculty.id_university == university_id)
    if faculty_id is not None:
        query = query.where(Program.id_faculty == faculty_id)
    if education_level_id is not None:
        query = query.where(Program.id_education_level == education_level_id)
    if type_study_id is not None:
        query = query.where(Program.id_type_study == type_study_id)
    if is_active is not None:
        query = query.where(Program.is_active == is_active)

    result = await session.execute(query.order_by(Program.name))
    return list(result.scalars().unique().all())


async def create_program(session: AsyncSession, data: ProgramCreate) -> Program:
    obj = Program(**data.model_dump())
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj
