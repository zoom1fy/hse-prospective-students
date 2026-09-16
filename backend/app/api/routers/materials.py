from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.crud import materials
from app.db.database import get_db
from app.models.user import User
from app.schemas.material import MaterialCreate, MaterialResponse, MaterialUpdate

router = APIRouter()


@router.get("/all", response_model=list[MaterialResponse])
async def get_all_materials(
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await materials.get_materials(db, published_only=False)


@router.get("/slug/{slug}", response_model=MaterialResponse)
async def get_material_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    material = await materials.get_material_by_slug(db, slug)
    if not material or not material.is_published:
        raise HTTPException(404, "Material not found")
    return material


@router.get("/", response_model=list[MaterialResponse])
async def get_materials(db: AsyncSession = Depends(get_db)):
    return await materials.get_materials(db, published_only=True)


@router.get("/{material_id}", response_model=MaterialResponse)
async def get_material(material_id: int, db: AsyncSession = Depends(get_db)):
    material = await materials.get_material(db, material_id)
    if not material:
        raise HTTPException(404, "Material not found")
    return material


@router.post("/", response_model=MaterialResponse, status_code=201)
async def create_material(
    data: MaterialCreate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    existing = await materials.get_material_by_slug(db, data.slug)
    if existing:
        raise HTTPException(409, "Материал с таким slug уже существует")
    return await materials.create_material(db, data)


@router.patch("/{material_id}", response_model=MaterialResponse)
async def update_material(
    material_id: int,
    data: MaterialUpdate,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    material = await materials.get_material(db, material_id)
    if not material:
        raise HTTPException(404, "Material not found")
    if data.slug is not None and data.slug != material.slug:
        existing = await materials.get_material_by_slug(db, data.slug)
        if existing:
            raise HTTPException(409, "Материал с таким slug уже существует")
    return await materials.update_material(db, material, data)


@router.delete("/{material_id}", status_code=204)
async def delete_material(
    material_id: int,
    _: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    material = await materials.get_material(db, material_id)
    if not material:
        raise HTTPException(404, "Material not found")
    await materials.delete_material(db, material)
