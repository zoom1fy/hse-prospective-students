from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_admin
from app.crud import programs, statements
from app.db.database import get_db
from app.models.user import User
from app.schemas.statement import (
    AdminStatementResponse,
    StatementCreate,
    StatementResponse,
    StatementTreeResponse,
    StatementUpdate,
)
from app.services.statement_service import get_statement_tree

router = APIRouter()


@router.get("/all", response_model=list[AdminStatementResponse])
async def get_all_statements(
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await statements.get_all_statements(db)


@router.patch("/admin/{statement_id}", response_model=AdminStatementResponse)
async def admin_update_statement(
    statement_id: int,
    data: StatementUpdate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    statement = await statements.get_statement_admin(db, statement_id)
    if not statement:
        raise HTTPException(404, "Statement not found")
    return await statements.admin_update_statement(db, statement, data)


@router.get("/", response_model=list[StatementResponse])
async def get_my_statements(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await statements.get_statements(db, user.id)


@router.get("/tree", response_model=StatementTreeResponse)
async def get_my_statement_tree(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_statement_tree(db, user.id)


@router.post("/", response_model=StatementResponse, status_code=201)
async def create_statement(
    data: StatementCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if await programs.get_program(db, data.id_program) is None:
        raise HTTPException(404, "Program not found")
    if await statements.get_statement_by_program(db, user.id, data.id_program) is not None:
        raise HTTPException(409, "Вы уже подали заявку на эту программу")
    try:
        return await statements.create_statement(db, user.id, data)
    except ValueError as error:
        raise HTTPException(500, str(error)) from error


@router.patch("/{statement_id}", response_model=StatementResponse)
async def update_statement(
    statement_id: int,
    data: StatementUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    statement = await statements.get_statement(db, user.id, statement_id)
    if not statement:
        raise HTTPException(404, "Statement not found")
    return await statements.update_statement(db, statement, data)


@router.delete("/{statement_id}", status_code=204)
async def delete_statement(
    statement_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    statement = await statements.get_statement(db, user.id, statement_id)
    if not statement:
        raise HTTPException(404, "Statement not found")
    await statements.delete_statement(db, statement)
