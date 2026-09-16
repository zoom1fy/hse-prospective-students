from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class AchievementCategory(Base):
    __tablename__ = "achievement_categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)

    achievements: Mapped[list["Achievement"]] = relationship(back_populates="category")


class Achievement(Base):
    __tablename__ = "achievement"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    id_category: Mapped[int] = mapped_column(ForeignKey("achievement_categories.id", ondelete="RESTRICT"), nullable=False)

    user: Mapped["User"] = relationship(back_populates="achievements")
    category: Mapped["AchievementCategory"] = relationship(back_populates="achievements")

    @property
    def category_name(self) -> str:
        return self.category.name if self.category else ""
