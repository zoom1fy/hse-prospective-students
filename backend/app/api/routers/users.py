from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.crud import users
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()


@router.get("/", response_model=list[UserResponse])
async def get_users(
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await users.get_users(db)


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user = await users.get_user(db, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await users.update_user(db, user, data)
