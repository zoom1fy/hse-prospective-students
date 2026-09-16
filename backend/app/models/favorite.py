from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.program import Program


class UserProgram(Base):
    __tablename__ = "user_programs"

    id: Mapped[int] = mapped_column(primary_key=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    id_program: Mapped[int] = mapped_column(ForeignKey("programs.id", ondelete="CASCADE"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="favorite_programs")
    program: Mapped["Program"] = relationship(back_populates="favorite_by_users")

    __table_args__ = (
        UniqueConstraint("id_user", "id_program", name="uq_user_program"),
    )
