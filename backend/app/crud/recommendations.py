from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.recommendation import RecommendationProgramUser


async def get_recommendations(session: AsyncSession, user_id: int) -> list[RecommendationProgramUser]:
    result = await session.execute(
        select(RecommendationProgramUser)
        .where(RecommendationProgramUser.id_user == user_id)
        .order_by(RecommendationProgramUser.rank.desc().nullslast(), RecommendationProgramUser.created_at.desc())
    )
    return list(result.scalars().all())
