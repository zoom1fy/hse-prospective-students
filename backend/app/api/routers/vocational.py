from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.vocational import MatchResponse, TestSubmitRequest
from app.services.vocational_service import match_specialties

router = APIRouter()


@router.post("/submit-test", response_model=MatchResponse)
async def submit_vocational_test(
    data: TestSubmitRequest,
    db: AsyncSession = Depends(get_db),
):
    return await match_specialties(db, data)
