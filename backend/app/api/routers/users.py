from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.crud import diplomas, users
from app.db.database import get_db
from app.models.user import User
from app.schemas.diploma import DiplomaCreate, DiplomaResponse
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


@router.get("/me/diplomas", response_model=list[DiplomaResponse])
async def get_my_diplomas(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await diplomas.get_user_diplomas(db, user.id)


@router.post("/me/diplomas", response_model=DiplomaResponse, status_code=201)
async def create_my_diploma(
    data: DiplomaCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await diplomas.create_diploma(db, user.id, data)


@router.delete("/me/diplomas/{diploma_id}", status_code=204)
async def delete_my_diploma(
    diploma_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    diploma = await diplomas.get_diploma(db, user.id, diploma_id)
    if not diploma:
        raise HTTPException(404, "Diploma not found")
    await diplomas.delete_diploma(db, diploma)


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await users.update_user(db, user, data)


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
