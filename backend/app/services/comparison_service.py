from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.program import Program
from app.models.comparison import Comparison
from app.schemas.comparison import ComparisonCreate


async def compare_programs(
    session: AsyncSession,
    user_id: int,
    data: ComparisonCreate,
) -> Comparison:
    if data.program_1_id == data.program_2_id:
        raise ValueError("Для сравнения нужны две разные программы")

    result = await session.execute(
        select(Program).where(
            Program.id.in_([data.program_1_id, data.program_2_id])
        )
    )
    programs = list(result.scalars().all())

    if len(programs) != 2:
        raise ValueError("Одна или обе программы не найдены")

    # Пока AI не подключен: результат сравнения не выбирает победителя.
    return Comparison(
        id_user=user_id,
        id_program_1=data.program_1_id,
        id_program_2=data.program_2_id,
        selected_program_id=None,
        explanation="AI-сравнение пока не подключено.",
    )
