from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import diplomas
from app.db.database import get_db
from app.schemas.diploma import DiplomaTypeResponse

router = APIRouter()


@router.get("/diploma-types", response_model=list[DiplomaTypeResponse])
async def get_diploma_types(db: AsyncSession = Depends(get_db)):
    return await diplomas.get_diploma_types(db)
