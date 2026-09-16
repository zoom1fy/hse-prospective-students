from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import universities
from app.db.database import get_db
from app.schemas.university import UniversityCreate, UniversityResponse

router = APIRouter()


@router.get("/", response_model=list[UniversityResponse])
async def get_universities(db: AsyncSession = Depends(get_db)):
    return await universities.get_universities(db)


@router.get("/{university_id}", response_model=UniversityResponse)
async def get_university(university_id: int, db: AsyncSession = Depends(get_db)):
    university = await universities.get_university(db, university_id)
    if not university:
        raise HTTPException(404, "University not found")
    return university


@router.post("/", response_model=UniversityResponse, status_code=201)
async def create_university(data: UniversityCreate, db: AsyncSession = Depends(get_db)):
    return await universities.create_university(db, data)
