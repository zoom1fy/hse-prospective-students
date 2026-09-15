from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.program import Program


class Comparison(Base):
    __tablename__ = "comparisons"

    id: Mapped[int] = mapped_column(primary_key=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    id_program_1: Mapped[int] = mapped_column(ForeignKey("programs.id", ondelete="RESTRICT"), nullable=False)
    id_program_2: Mapped[int] = mapped_column(ForeignKey("programs.id", ondelete="RESTRICT"), nullable=False)
    selected_program_id: Mapped[int | None] = mapped_column(ForeignKey("programs.id", ondelete="SET NULL"), nullable=True)
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="comparisons")
    program_1: Mapped["Program"] = relationship(foreign_keys=[id_program_1], back_populates="comparison_program_1")
    program_2: Mapped["Program"] = relationship(foreign_keys=[id_program_2], back_populates="comparison_program_2")
    selected_program: Mapped["Program | None"] = relationship(foreign_keys=[selected_program_id], back_populates="selected_in_comparisons")

    __table_args__ = (
        CheckConstraint("id_program_1 <> id_program_2", name="ck_comparison_different_programs"),
    )
