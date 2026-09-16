from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.crud import users
from app.db.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserUpdate

router = APIRouter()


@router.get("/", response_model=list[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    return await users.get_users(db)


@router.get("/me", response_model=UserResponse)
async def get_me(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    user = await users.get_user(db, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await users.get_user(db, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user


@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(data: UserCreate, db: AsyncSession = Depends(get_db)):
    return await users.create_user(db, data)


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    user = await users.get_user(db, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return await users.update_user(db, user, data)
