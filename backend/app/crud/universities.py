from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.university import University
from app.schemas.university import UniversityCreate


async def get_universities(session: AsyncSession) -> list[University]:
    result = await session.execute(select(University).order_by(University.name))
    return list(result.scalars().all())


async def get_university(session: AsyncSession, university_id: int) -> University | None:
    result = await session.execute(select(University).where(University.id == university_id))
    return result.scalar_one_or_none()


async def create_university(session: AsyncSession, data: UniversityCreate) -> University:
    obj = University(**data.model_dump())
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj
