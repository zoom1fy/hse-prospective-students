from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.program import Program
    from app.models.user import User


class Exam(Base):
    __tablename__ = "exams"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)

    programs: Mapped[list["ProgramExam"]] = relationship(back_populates="exam", cascade="all, delete-orphan")
    users: Mapped[list["UserExam"]] = relationship(back_populates="exam", cascade="all, delete-orphan")


class ProgramExam(Base):
    __tablename__ = "program_exam"

    id: Mapped[int] = mapped_column(primary_key=True)
    id_program: Mapped[int] = mapped_column(ForeignKey("programs.id", ondelete="CASCADE"), nullable=False)
    id_exam: Mapped[int] = mapped_column(ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    passing_score: Mapped[int | None] = mapped_column(Integer, nullable=True)

    program: Mapped["Program"] = relationship(back_populates="exams")
    exam: Mapped["Exam"] = relationship(back_populates="programs")

    __table_args__ = (
        UniqueConstraint("id_program", "id_exam", name="uq_program_exam"),
        CheckConstraint("passing_score IS NULL OR passing_score >= 0", name="ck_program_exam_passing_score"),
    )


class UserExam(Base):
    __tablename__ = "user_exam"

    id: Mapped[int] = mapped_column(primary_key=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    id_exam: Mapped[int] = mapped_column(ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    score_achieved: Mapped[int] = mapped_column(Integer, nullable=False)

    user: Mapped["User"] = relationship(back_populates="exams")
    exam: Mapped["Exam"] = relationship(back_populates="users")

    __table_args__ = (
        UniqueConstraint("id_user", "id_exam", name="uq_user_exam"),
        CheckConstraint("score_achieved >= 0", name="ck_user_exam_score"),
    )
