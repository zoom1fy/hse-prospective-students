from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.crud.recommendations import get_recommendations
from app.db.database import get_db
from app.models.user import User
from app.schemas.recommendation import RecommendationGenerateRequest, RecommendationResponse
from app.services.recommendation_service import generate_recommendations

router = APIRouter()


@router.get("/", response_model=list[RecommendationResponse])
async def get_my_recommendations(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_recommendations(db, user.id)


@router.post("/generate", response_model=list[RecommendationResponse])
async def generate_my_recommendations(
    data: RecommendationGenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await generate_recommendations(db, user.id, data.top_n)
