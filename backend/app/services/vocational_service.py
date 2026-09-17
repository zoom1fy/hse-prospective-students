from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.specialty import Specialty
from app.models.university import University
from app.schemas.vocational import MatchResponse, MatchedSpecialty, TestSubmitRequest


async def match_specialties(
    session: AsyncSession,
    data: TestSubmitRequest,
    top_n: int = 3,
) -> MatchResponse:
    """
    Подбор специальностей по баллам ЕГЭ, городу и интересам.

    1. Берём специальности с вузами (и регионом как «городом»).
    2. Отсекаем те, где min_ege_score выше баллов пользователя.
    3. При указанном preferred_city фильтруем по Region.name.
    4. Считаем пересечение interests ∩ tags.
    5. Сортируем по score desc и возвращаем Top N.
    """
    stmt = (
        select(Specialty)
        .join(University, Specialty.id_university == University.id)
        .options(
            selectinload(Specialty.university).selectinload(University.region),
        )
        .where(Specialty.min_ege_score <= data.ege_score)
    )

    result = await session.execute(stmt)
    specialties = list(result.scalars().unique().all())

    # Фильтр города в Python: SQL lower() в C-locale не обрабатывает кириллицу.
    if data.preferred_city and data.preferred_city.strip():
        city = data.preferred_city.strip().lower()
        specialties = [
            item
            for item in specialties
            if item.university.region.name.lower() == city
        ]

    interests = {item.strip().lower() for item in data.interests if item.strip()}

    scored: list[tuple[int, Specialty]] = []
    for specialty in specialties:
        tags = {str(tag).strip().lower() for tag in (specialty.tags or []) if tag}
        score = len(interests & tags)
        scored.append((score, specialty))

    scored.sort(key=lambda item: (-item[0], item[1].name))
    top = scored[:top_n]

    matches = [
        MatchedSpecialty(
            id=specialty.id,
            name=specialty.name,
            min_ege_score=specialty.min_ege_score,
            tags=list(specialty.tags or []),
            match_score=score,
            university_id=specialty.university.id,
            university_name=specialty.university.name,
            city=specialty.university.region.name,
        )
        for score, specialty in top
    ]

    return MatchResponse(matches=matches)
