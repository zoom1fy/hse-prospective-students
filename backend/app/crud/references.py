from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.references import EducationLevel, Region, TypeStudy
from app.models.statement import StatementStatus


async def get_regions(session: AsyncSession) -> list[Region]:
    result = await session.execute(select(Region).order_by(Region.name))
    return list(result.scalars().all())


async def get_education_levels(session: AsyncSession) -> list[EducationLevel]:
    result = await session.execute(select(EducationLevel).order_by(EducationLevel.id))
    return list(result.scalars().all())


async def get_study_types(session: AsyncSession) -> list[TypeStudy]:
    result = await session.execute(select(TypeStudy).order_by(TypeStudy.id))
    return list(result.scalars().all())


async def get_statement_statuses(session: AsyncSession) -> list[StatementStatus]:
    result = await session.execute(select(StatementStatus).order_by(StatementStatus.id))
    return list(result.scalars().all())
