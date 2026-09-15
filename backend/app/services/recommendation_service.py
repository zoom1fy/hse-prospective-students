from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.program import Program
from app.models.recommendation import RecommendationProgramUser


async def generate_recommendations(
    session: AsyncSession,
    user_id: int,
    top_n: int = 3,
) -> list[RecommendationProgramUser]:
    """
    Временная реализация.

    Здесь позже будет AI-логика. Пока возвращаем активные программы
    в качестве каркаса, чтобы API уже был рабочим.
    """
    await session.execute(
        delete(RecommendationProgramUser).where(
            RecommendationProgramUser.id_user == user_id
        )
    )

    result = await session.execute(
        select(Program)
        .where(Program.is_active.is_(True))
        .order_by(Program.id)
        .limit(top_n)
    )
    programs = list(result.scalars().all())

    recommendations: list[RecommendationProgramUser] = []

    for rank, program in enumerate(programs, start=1):
        recommendation = RecommendationProgramUser(
            id_user=user_id,
            id_program=program.id,
            rank=rank,
            explanation="Временная рекомендация. AI-логика будет добавлена позже.",
        )
        session.add(recommendation)
        recommendations.append(recommendation)

    await session.commit()

    for item in recommendations:
        await session.refresh(item)

    return recommendations
