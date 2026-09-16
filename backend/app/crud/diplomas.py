from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.diploma import Diploma, DiplomaType
from app.schemas.diploma import DiplomaCreate


async def get_diploma(session: AsyncSession, user_id: int, diploma_id: int) -> Diploma | None:
    result = await session.execute(
        select(Diploma)
        .where(Diploma.id == diploma_id, Diploma.id_user == user_id)
        .options(selectinload(Diploma.diploma_type))
    )
    return result.scalar_one_or_none()


async def get_user_diplomas(session: AsyncSession, user_id: int) -> list[Diploma]:
    result = await session.execute(
        select(Diploma)
        .where(Diploma.id_user == user_id)
        .options(selectinload(Diploma.diploma_type))
        .order_by(Diploma.year.desc(), Diploma.id)
    )
    return list(result.scalars().all())


async def create_diploma(
    session: AsyncSession, user_id: int, data: DiplomaCreate
) -> Diploma:
    diploma = Diploma(id_user=user_id, **data.model_dump())
    session.add(diploma)
    await session.commit()
    await session.refresh(diploma)
    return await get_diploma(session, user_id, diploma.id)


async def delete_diploma(session: AsyncSession, diploma: Diploma) -> None:
    await session.delete(diploma)
    await session.commit()


async def get_diploma_types(session: AsyncSession) -> list[DiplomaType]:
    result = await session.execute(select(DiplomaType).order_by(DiplomaType.id))
    return list(result.scalars().all())
