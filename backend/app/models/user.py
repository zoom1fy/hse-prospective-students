from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.references import Region
    from app.models.achievement import Achievement
    from app.models.exam import UserExam
    from app.models.statement import Statement
    from app.models.favorite import UserProgram
    from app.models.recommendation import RecommendationProgramUser
    from app.models.comparison import Comparison


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    patronymic: Mapped[str | None] = mapped_column(String(100), nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    passport: Mapped[str | None] = mapped_column(String(50), unique=True, nullable=True)
    snils: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True)
    education: Mapped[str | None] = mapped_column(Text, nullable=True)
    id_region: Mapped[int | None] = mapped_column(ForeignKey("regions.id", ondelete="SET NULL"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    region: Mapped["Region | None"] = relationship(back_populates="users")
    achievements: Mapped[list["Achievement"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    exams: Mapped[list["UserExam"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    statements: Mapped[list["Statement"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    favorite_programs: Mapped[list["UserProgram"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    recommendations: Mapped[list["RecommendationProgramUser"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    comparisons: Mapped[list["Comparison"]] = relationship(back_populates="user", cascade="all, delete-orphan")
