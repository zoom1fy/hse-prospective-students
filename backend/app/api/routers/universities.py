from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.crud import universities
from app.db.database import get_db
from app.models.user import User
from app.schemas.university import UniversityCreate, UniversityResponse, UniversityUpdate

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
async def create_university(
    data: UniversityCreate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await universities.create_university(db, data)


@router.patch("/{university_id}", response_model=UniversityResponse)
async def update_university(
    university_id: int,
    data: UniversityUpdate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    university = await universities.get_university(db, university_id)
    if not university:
        raise HTTPException(404, "University not found")
    return await universities.update_university(db, university, data)


@router.delete("/{university_id}", status_code=204)
async def delete_university(
    university_id: int,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    university = await universities.get_university(db, university_id)
    if not university:
        raise HTTPException(404, "University not found")
    try:
        await universities.delete_university(db, university)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(409, "Нельзя удалить вуз: есть связанные заявления") from None
