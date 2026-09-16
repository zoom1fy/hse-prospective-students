import random

from sqlalchemy import delete, func, select
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

    Здесь позже будет AI-логика. Пока случайно выбираем активные
    программы из базы, чтобы API уже был рабочим.
    """
    await session.execute(
        delete(RecommendationProgramUser).where(
            RecommendationProgramUser.id_user == user_id
        )
    )

    result = await session.execute(
        select(Program)
        .where(Program.is_active.is_(True))
        .order_by(func.random())
        .limit(top_n)
    )
    programs = list(result.scalars().all())

    recommendations: list[RecommendationProgramUser] = []

    for program in programs:
        score = random.randint(55, 95)
        recommendation = RecommendationProgramUser(
            id_user=user_id,
            id_program=program.id,
            rank=score,
            explanation=f"Случайный подбор. Соответствие профилю — {score}%. AI-логика будет добавлена позже.",
        )
        session.add(recommendation)
        recommendations.append(recommendation)

    await session.commit()

    for item in recommendations:
        await session.refresh(item)

    return recommendations
