from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.references import Region
    from app.models.faculty import Faculty


class University(Base):
    __tablename__ = "universities"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    short_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    official_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    logo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    id_region: Mapped[int] = mapped_column(ForeignKey("regions.id", ondelete="RESTRICT"), nullable=False)

    region: Mapped["Region"] = relationship(back_populates="universities")
    faculties: Mapped[list["Faculty"]] = relationship(back_populates="university", cascade="all, delete-orphan")
