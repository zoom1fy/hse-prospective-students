from collections import OrderedDict

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.statement import Statement
from app.models.program import Program
from app.models.faculty import Faculty


async def get_statement_tree(session: AsyncSession, user_id: int) -> dict:
    result = await session.execute(
        select(Statement)
        .where(Statement.id_user == user_id)
        .options(
            selectinload(Statement.program)
            .selectinload(Program.faculty)
            .selectinload(Faculty.university),
            selectinload(Statement.status),
        )
        .order_by(Statement.created_at)
    )
    statements = list(result.scalars().all())

    universities = OrderedDict()

    for statement in statements:
        program = statement.program
        faculty = program.faculty
        university = faculty.university

        university_data = universities.setdefault(
            university.id,
            {
                "id": university.id,
                "name": university.name,
                "official_url": university.official_url,
                "faculties": OrderedDict(),
            },
        )

        faculty_data = university_data["faculties"].setdefault(
            faculty.id,
            {
                "id": faculty.id,
                "name": faculty.name,
                "official_url": faculty.official_url,
                "programs": [],
            },
        )

        faculty_data["programs"].append(
            {
                "id": program.id,
                "name": program.name,
                "official_url": program.official_url,
                "status": statement.status.name,
            }
        )

    result_tree = []
    for university in universities.values():
        university["faculties"] = list(university["faculties"].values())
        result_tree.append(university)

    return {"universities": result_tree}
