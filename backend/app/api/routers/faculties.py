from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.crud import faculties
from app.db.database import get_db
from app.models.user import User
from app.schemas.faculty import FacultyCreate, FacultyResponse, FacultyUpdate

router = APIRouter()


@router.get("/", response_model=list[FacultyResponse])
async def get_faculties(
    university_id: int | None = None,
    db: AsyncSession = Depends(get_db),
):
    return await faculties.get_faculties(db, university_id)


@router.get("/{faculty_id}", response_model=FacultyResponse)
async def get_faculty(faculty_id: int, db: AsyncSession = Depends(get_db)):
    faculty = await faculties.get_faculty(db, faculty_id)
    if not faculty:
        raise HTTPException(404, "Faculty not found")
    return faculty


@router.post("/", response_model=FacultyResponse, status_code=201)
async def create_faculty(
    data: FacultyCreate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await faculties.create_faculty(db, data)


@router.patch("/{faculty_id}", response_model=FacultyResponse)
async def update_faculty(
    faculty_id: int,
    data: FacultyUpdate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    faculty = await faculties.get_faculty(db, faculty_id)
    if not faculty:
        raise HTTPException(404, "Faculty not found")
    return await faculties.update_faculty(db, faculty, data)


@router.delete("/{faculty_id}", status_code=204)
async def delete_faculty(
    faculty_id: int,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    faculty = await faculties.get_faculty(db, faculty_id)
    if not faculty:
        raise HTTPException(404, "Faculty not found")
    try:
        await faculties.delete_faculty(db, faculty)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(409, "Нельзя удалить факультет: есть связанные заявления") from None
