from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.university import University
    from app.models.program import Program


class Faculty(Base):
    __tablename__ = "faculties"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    short_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    official_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    id_university: Mapped[int] = mapped_column(ForeignKey("universities.id", ondelete="CASCADE"), nullable=False, index=True)

    university: Mapped["University"] = relationship(back_populates="faculties")
    programs: Mapped[list["Program"]] = relationship(back_populates="faculty", cascade="all, delete-orphan")
