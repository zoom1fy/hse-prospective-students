from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


async def get_user(session: AsyncSession, user_id: int) -> User | None:
    result = await session.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_users(session: AsyncSession) -> list[User]:
    result = await session.execute(select(User).order_by(User.id))
    return list(result.scalars().all())


async def create_user(session: AsyncSession, data: UserCreate) -> User:
    user = User(**data.model_dump())
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def update_user(session: AsyncSession, user: User, data: UserUpdate) -> User:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    await session.commit()
    await session.refresh(user)
    return user
