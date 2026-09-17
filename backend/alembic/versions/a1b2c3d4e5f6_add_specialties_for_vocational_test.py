"""add specialties for vocational test

Revision ID: a1b2c3d4e5f6
Revises: ba7557634510
Create Date: 2026-09-17 22:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "ba7557634510"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "specialties",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("id_university", sa.Integer(), nullable=False),
        sa.Column("min_ege_score", sa.Integer(), nullable=False),
        sa.Column(
            "tags",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.ForeignKeyConstraint(["id_university"], ["universities.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_specialties_name"), "specialties", ["name"], unique=False)
    op.create_index(
        op.f("ix_specialties_id_university"),
        "specialties",
        ["id_university"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_specialties_id_university"), table_name="specialties")
    op.drop_index(op.f("ix_specialties_name"), table_name="specialties")
    op.drop_table("specialties")
