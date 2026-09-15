from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.statement import Statement
from app.schemas.statement import StatementCreate, StatementUpdate


async def get_statements(session: AsyncSession, user_id: int) -> list[Statement]:
    result = await session.execute(
        select(Statement).where(Statement.id_user == user_id).order_by(Statement.created_at.desc())
    )
    return list(result.scalars().all())


async def get_statement(session: AsyncSession, user_id: int, statement_id: int) -> Statement | None:
    result = await session.execute(
        select(Statement).where(Statement.id == statement_id, Statement.id_user == user_id)
    )
    return result.scalar_one_or_none()


async def create_statement(session: AsyncSession, user_id: int, data: StatementCreate) -> Statement:
    obj = Statement(id_user=user_id, **data.model_dump())
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj


async def update_statement(session: AsyncSession, statement: Statement, data: StatementUpdate) -> Statement:
    statement.id_status = data.id_status
    await session.commit()
    await session.refresh(statement)
    return statement
