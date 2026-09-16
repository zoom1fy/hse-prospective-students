from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.comparison import Comparison
from app.schemas.comparison import ComparisonCreate


async def get_comparisons(session: AsyncSession, user_id: int) -> list[Comparison]:
    result = await session.execute(
        select(Comparison).where(Comparison.id_user == user_id).order_by(Comparison.created_at.desc())
    )
    return list(result.scalars().all())


async def get_comparison(session: AsyncSession, user_id: int, comparison_id: int) -> Comparison | None:
    result = await session.execute(
        select(Comparison).where(Comparison.id == comparison_id, Comparison.id_user == user_id)
    )
    return result.scalar_one_or_none()


async def create_comparison(
    session: AsyncSession,
    user_id: int,
    data: ComparisonCreate,
    selected_program_id: int | None,
    explanation: str | None,
) -> Comparison:
    obj = Comparison(
        id_user=user_id,
        id_program_1=data.program_1_id,
        id_program_2=data.program_2_id,
        selected_program_id=selected_program_id,
        explanation=explanation,
    )
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj
