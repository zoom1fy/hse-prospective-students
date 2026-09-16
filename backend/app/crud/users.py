from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import hash_password
from app.models.achievement import Achievement
from app.models.diploma import Diploma
from app.models.user import User
from app.schemas.user import UserRegister, UserUpdate


def profile_loader():
    return (
        selectinload(User.diplomas).selectinload(Diploma.diploma_type),
        selectinload(User.achievements).selectinload(Achievement.category),
    )


async def get_user(session: AsyncSession, user_id: int) -> User | None:
    result = await session.execute(
        select(User).where(User.id == user_id).options(*profile_loader())
    )
    return result.scalar_one_or_none()


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    result = await session.execute(
        select(User).where(User.email == email).options(*profile_loader())
    )
    return result.scalar_one_or_none()


async def get_users(session: AsyncSession) -> list[User]:
    result = await session.execute(
        select(User).order_by(User.id).options(*profile_loader())
    )
    return list(result.scalars().unique().all())


async def create_user(session: AsyncSession, data: UserRegister) -> User:
    user = User(
        **data.model_dump(exclude={"password"}),
        password_hash=hash_password(data.password),
    )
    session.add(user)
    await session.commit()
    created = await get_user(session, user.id)
    return created if created is not None else user


async def update_user(session: AsyncSession, user: User, data: UserUpdate) -> User:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    await session.commit()
    return await get_user(session, user.id)


async def delete_user(session: AsyncSession, user: User) -> None:
    await session.delete(user)
    await session.commit()
