from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.crud import statements
from app.db.database import get_db
from app.schemas.statement import StatementCreate, StatementResponse, StatementTreeResponse, StatementUpdate
from app.services.statement_service import get_statement_tree

router = APIRouter()


@router.get("/", response_model=list[StatementResponse])
async def get_my_statements(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await statements.get_statements(db, user_id)


@router.get("/tree", response_model=StatementTreeResponse)
async def get_my_statement_tree(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await get_statement_tree(db, user_id)


@router.post("/", response_model=StatementResponse, status_code=201)
async def create_statement(
    data: StatementCreate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await statements.create_statement(db, user_id, data)


@router.patch("/{statement_id}", response_model=StatementResponse)
async def update_statement(
    statement_id: int,
    data: StatementUpdate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    statement = await statements.get_statement(db, user_id, statement_id)
    if not statement:
        raise HTTPException(404, "Statement not found")
    return await statements.update_statement(db, statement, data)
