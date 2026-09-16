from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.university import University
    from app.models.user import User
    from app.models.program import Program
    from app.models.statement import Statement


class Region(Base):
    __tablename__ = "regions"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)

    users: Mapped[list["User"]] = relationship(back_populates="region")
    universities: Mapped[list["University"]] = relationship(back_populates="region")


class TypeStudy(Base):
    __tablename__ = "type_study"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    programs: Mapped[list["Program"]] = relationship(back_populates="type_study")


class EducationLevel(Base):
    __tablename__ = "education_level"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    programs: Mapped[list["Program"]] = relationship(back_populates="education_level")
