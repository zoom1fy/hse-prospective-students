from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.faculty import Faculty
    from app.models.references import TypeStudy, EducationLevel
    from app.models.exam import ProgramExam
    from app.models.statement import Statement
    from app.models.favorite import UserProgram
    from app.models.recommendation import RecommendationProgramUser
    from app.models.comparison import Comparison


class Program(Base):
    __tablename__ = "programs"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    official_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    duration_years: Mapped[int] = mapped_column(Integer, nullable=False)
    budget_places: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    paid_places: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    tuition_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    id_type_study: Mapped[int] = mapped_column(ForeignKey("type_study.id", ondelete="RESTRICT"), nullable=False)
    id_education_level: Mapped[int] = mapped_column(ForeignKey("education_level.id", ondelete="RESTRICT"), nullable=False)
    id_faculty: Mapped[int] = mapped_column(ForeignKey("faculties.id", ondelete="CASCADE"), nullable=False, index=True)

    faculty: Mapped["Faculty"] = relationship(back_populates="programs")
    type_study: Mapped["TypeStudy"] = relationship(back_populates="programs")
    education_level: Mapped["EducationLevel"] = relationship(back_populates="programs")
    exams: Mapped[list["ProgramExam"]] = relationship(back_populates="program", cascade="all, delete-orphan")
    statements: Mapped[list["Statement"]] = relationship(back_populates="program")
    favorite_by_users: Mapped[list["UserProgram"]] = relationship(back_populates="program", cascade="all, delete-orphan")
    recommendations: Mapped[list["RecommendationProgramUser"]] = relationship(back_populates="program", cascade="all, delete-orphan")
    comparison_program_1: Mapped[list["Comparison"]] = relationship(foreign_keys="Comparison.id_program_1", back_populates="program_1")
    comparison_program_2: Mapped[list["Comparison"]] = relationship(foreign_keys="Comparison.id_program_2", back_populates="program_2")
    selected_in_comparisons: Mapped[list["Comparison"]] = relationship(foreign_keys="Comparison.selected_program_id", back_populates="selected_program")
