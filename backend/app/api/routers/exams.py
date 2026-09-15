from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import exams
from app.db.database import get_db
from app.schemas.exam import ExamCreate, ExamResponse

router = APIRouter()


@router.get("/", response_model=list[ExamResponse])
async def get_exams(db: AsyncSession = Depends(get_db)):
    return await exams.get_exams(db)


@router.get("/{exam_id}", response_model=ExamResponse)
async def get_exam(exam_id: int, db: AsyncSession = Depends(get_db)):
    exam = await exams.get_exam(db, exam_id)
    if not exam:
        raise HTTPException(404, "Exam not found")
    return exam


@router.post("/", response_model=ExamResponse, status_code=201)
async def create_exam(data: ExamCreate, db: AsyncSession = Depends(get_db)):
    return await exams.create_exam(db, data)
