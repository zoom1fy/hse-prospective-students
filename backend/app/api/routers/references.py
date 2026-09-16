from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import diplomas, references
from app.db.database import get_db
from app.schemas.diploma import DiplomaTypeResponse
from app.schemas.reference import ReferenceResponse

router = APIRouter()


@router.get("/diploma-types", response_model=list[DiplomaTypeResponse])
async def get_diploma_types(db: AsyncSession = Depends(get_db)):
    return await diplomas.get_diploma_types(db)


@router.get("/regions", response_model=list[ReferenceResponse])
async def get_regions(db: AsyncSession = Depends(get_db)):
    return await references.get_regions(db)


@router.get("/education-levels", response_model=list[ReferenceResponse])
async def get_education_levels(db: AsyncSession = Depends(get_db)):
    return await references.get_education_levels(db)


@router.get("/study-types", response_model=list[ReferenceResponse])
async def get_study_types(db: AsyncSession = Depends(get_db)):
    return await references.get_study_types(db)


@router.get("/statement-statuses", response_model=list[ReferenceResponse])
async def get_statement_statuses(db: AsyncSession = Depends(get_db)):
    return await references.get_statement_statuses(db)
