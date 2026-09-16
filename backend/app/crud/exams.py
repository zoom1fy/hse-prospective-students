from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.exam import Exam, ProgramExam, UserExam
from app.schemas.exam import ExamCreate, ExamUpdate, ProgramExamCreate


async def get_exams(session: AsyncSession) -> list[Exam]:
    result = await session.execute(select(Exam).order_by(Exam.name))
    return list(result.scalars().all())


async def get_exam(session: AsyncSession, exam_id: int) -> Exam | None:
    result = await session.execute(select(Exam).where(Exam.id == exam_id))
    return result.scalar_one_or_none()


async def create_exam(session: AsyncSession, data: ExamCreate) -> Exam:
    obj = Exam(**data.model_dump())
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj


async def update_exam(session: AsyncSession, exam: Exam, data: ExamUpdate) -> Exam:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(exam, field, value)
    await session.commit()
    await session.refresh(exam)
    return exam


async def delete_exam(session: AsyncSession, exam: Exam) -> None:
    await session.delete(exam)
    await session.commit()


async def create_program_exam(session: AsyncSession, data: ProgramExamCreate) -> ProgramExam:
    obj = ProgramExam(**data.model_dump())
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj


async def get_user_exams(session: AsyncSession, user_id: int) -> list[UserExam]:
    result = await session.execute(select(UserExam).where(UserExam.id_user == user_id))
    return list(result.scalars().all())
