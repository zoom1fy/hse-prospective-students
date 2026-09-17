from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.exam import ProgramExam
from app.models.faculty import Faculty
from app.models.program import Program
from app.models.university import University
from app.schemas.program import ProgramCreate, ProgramUpdate


async def get_program(session: AsyncSession, program_id: int) -> Program | None:
    passing_score = (
        select(func.sum(ProgramExam.passing_score))
        .where(
            ProgramExam.id_program == Program.id,
            ProgramExam.passing_score.is_not(None),
        )
        .correlate(Program)
        .scalar_subquery()
        .label("passing_score")
    )
    result = await session.execute(
        select(Program, passing_score).where(Program.id == program_id)
    )
    row = result.one_or_none()
    if row is None:
        return None
    program, score = row
    program.passing_score = score
    return program


async def get_programs(
    session: AsyncSession,
    region_id: int | None = None,
    university_id: int | None = None,
    faculty_id: int | None = None,
    education_level_id: int | None = None,
    type_study_id: int | None = None,
    is_active: bool | None = True,
    include_inactive: bool = False,
) -> list[Program]:
    passing_total = (
        select(
            ProgramExam.id_program,
            func.sum(ProgramExam.passing_score).label("passing_score"),
        )
        .where(ProgramExam.passing_score.is_not(None))
        .group_by(ProgramExam.id_program)
        .subquery()
    )

    query = (
        select(Program, passing_total.c.passing_score)
        .join(Faculty, Program.id_faculty == Faculty.id)
        .join(University, Faculty.id_university == University.id)
        .outerjoin(passing_total, passing_total.c.id_program == Program.id)
    )

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
    if not include_inactive and is_active is not None:
        query = query.where(Program.is_active == is_active)

    result = await session.execute(query.order_by(Program.name))
    programs: list[Program] = []
    for program, score in result.all():
        program.passing_score = score
        programs.append(program)
    return programs


async def create_program(session: AsyncSession, data: ProgramCreate) -> Program:
    obj = Program(**data.model_dump())
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj


async def update_program(
    session: AsyncSession, program: Program, data: ProgramUpdate
) -> Program:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(program, field, value)
    await session.commit()
    await session.refresh(program)
    return program


async def delete_program(session: AsyncSession, program: Program) -> None:
    await session.delete(program)
    await session.commit()
