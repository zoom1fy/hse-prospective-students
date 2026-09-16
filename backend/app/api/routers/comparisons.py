from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.crud.comparisons import get_comparison, get_comparisons
from app.db.database import get_db
from app.models.user import User
from app.schemas.comparison import ComparisonCreate, ComparisonResponse
from app.services.comparison_service import compare_programs

router = APIRouter()


@router.get("/", response_model=list[ComparisonResponse])
async def get_my_comparisons(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_comparisons(db, user.id)


@router.get("/{comparison_id}", response_model=ComparisonResponse)
async def get_my_comparison(
    comparison_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    comparison = await get_comparison(db, user.id, comparison_id)
    if not comparison:
        raise HTTPException(404, "Comparison not found")
    return comparison


@router.post("/", response_model=ComparisonResponse, status_code=201)
async def create_comparison(
    data: ComparisonCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        comparison = await compare_programs(db, user.id, data)
        db.add(comparison)
        await db.commit()
        await db.refresh(comparison)
        return comparison
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
