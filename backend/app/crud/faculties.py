from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.faculty import Faculty
from app.schemas.faculty import FacultyCreate


async def get_faculties(session: AsyncSession, university_id: int | None = None) -> list[Faculty]:
    query = select(Faculty).order_by(Faculty.name)
    if university_id is not None:
        query = query.where(Faculty.id_university == university_id)
    result = await session.execute(query)
    return list(result.scalars().all())


async def get_faculty(session: AsyncSession, faculty_id: int) -> Faculty | None:
    result = await session.execute(select(Faculty).where(Faculty.id == faculty_id))
    return result.scalar_one_or_none()


async def create_faculty(session: AsyncSession, data: FacultyCreate) -> Faculty:
    obj = Faculty(**data.model_dump())
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj
