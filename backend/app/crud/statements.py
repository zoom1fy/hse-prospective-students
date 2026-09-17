from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.statement import Statement, StatementStatus
from app.schemas.statement import StatementCreate, StatementUpdate

DEFAULT_STATUS_NAME = "Отправлено"


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


async def get_statement_by_program(
    session: AsyncSession, user_id: int, program_id: int
) -> Statement | None:
    result = await session.execute(
        select(Statement).where(
            Statement.id_user == user_id, Statement.id_program == program_id
        )
    )
    return result.scalar_one_or_none()


async def get_statement_status_by_name(
    session: AsyncSession, name: str
) -> StatementStatus | None:
    result = await session.execute(
        select(StatementStatus).where(StatementStatus.name == name)
    )
    return result.scalar_one_or_none()


async def get_all_statements(session: AsyncSession) -> list[Statement]:
    result = await session.execute(
        select(Statement)
        .options(
            selectinload(Statement.user),
            selectinload(Statement.program),
            selectinload(Statement.status),
        )
        .order_by(Statement.created_at.desc())
    )
    return list(result.scalars().all())


async def get_statement_admin(session: AsyncSession, statement_id: int) -> Statement | None:
    result = await session.execute(
        select(Statement)
        .where(Statement.id == statement_id)
        .options(
            selectinload(Statement.user),
            selectinload(Statement.program),
            selectinload(Statement.status),
        )
    )
    return result.scalar_one_or_none()


async def create_statement(session: AsyncSession, user_id: int, data: StatementCreate) -> Statement:
    payload = data.model_dump()
    if payload.get("id_status") is None:
        status = await get_statement_status_by_name(session, DEFAULT_STATUS_NAME)
        if status is None:
            raise ValueError(f"Statement status '{DEFAULT_STATUS_NAME}' is not configured")
        payload["id_status"] = status.id
    obj = Statement(id_user=user_id, **payload)
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj


async def delete_statement(session: AsyncSession, statement: Statement) -> None:
    await session.delete(statement)
    await session.commit()


async def update_statement(session: AsyncSession, statement: Statement, data: StatementUpdate) -> Statement:
    statement.id_status = data.id_status
    await session.commit()
    await session.refresh(statement)
    return statement


async def admin_update_statement(
    session: AsyncSession, statement: Statement, data: StatementUpdate
) -> Statement:
    statement.id_status = data.id_status
    await session.commit()
    refreshed = await get_statement_admin(session, statement.id)
    return refreshed if refreshed is not None else statement
