from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import faculties
from app.db.database import get_db
from app.schemas.faculty import FacultyCreate, FacultyResponse

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
async def create_faculty(data: FacultyCreate, db: AsyncSession = Depends(get_db)):
    return await faculties.create_faculty(db, data)
