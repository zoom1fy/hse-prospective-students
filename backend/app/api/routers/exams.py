from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.crud import exams
from app.db.database import get_db
from app.models.user import User
from app.schemas.exam import ExamCreate, ExamResponse, ExamUpdate

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
async def create_exam(
    data: ExamCreate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await exams.create_exam(db, data)


@router.patch("/{exam_id}", response_model=ExamResponse)
async def update_exam(
    exam_id: int,
    data: ExamUpdate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    exam = await exams.get_exam(db, exam_id)
    if not exam:
        raise HTTPException(404, "Exam not found")
    return await exams.update_exam(db, exam, data)


@router.delete("/{exam_id}", status_code=204)
async def delete_exam(
    exam_id: int,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    exam = await exams.get_exam(db, exam_id)
    if not exam:
        raise HTTPException(404, "Exam not found")
    try:
        await exams.delete_exam(db, exam)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(409, "Нельзя удалить экзамен: есть связанные записи") from None
