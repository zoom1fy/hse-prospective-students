from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.program import Program


class StatementStatus(Base):
    __tablename__ = "statement_statuses"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    statements: Mapped[list["Statement"]] = relationship(back_populates="status")


class Statement(Base):
    __tablename__ = "statement"

    id: Mapped[int] = mapped_column(primary_key=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    id_program: Mapped[int] = mapped_column(ForeignKey("programs.id", ondelete="RESTRICT"), nullable=False, index=True)
    id_status: Mapped[int] = mapped_column(ForeignKey("statement_statuses.id", ondelete="RESTRICT"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="statements")
    program: Mapped["Program"] = relationship(back_populates="statements")
    status: Mapped["StatementStatus"] = relationship(back_populates="statements")
