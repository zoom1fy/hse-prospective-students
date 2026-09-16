from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.material import Material
from app.schemas.material import MaterialCreate, MaterialUpdate


async def get_materials(
    session: AsyncSession, published_only: bool = False
) -> list[Material]:
    query = select(Material).order_by(Material.id)
    if published_only:
        query = query.where(Material.is_published.is_(True))
    result = await session.execute(query)
    return list(result.scalars().all())


async def get_material(session: AsyncSession, material_id: int) -> Material | None:
    result = await session.execute(select(Material).where(Material.id == material_id))
    return result.scalar_one_or_none()


async def get_material_by_slug(session: AsyncSession, slug: str) -> Material | None:
    result = await session.execute(select(Material).where(Material.slug == slug))
    return result.scalar_one_or_none()


async def create_material(session: AsyncSession, data: MaterialCreate) -> Material:
    obj = Material(**data.model_dump())
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj


async def update_material(
    session: AsyncSession, material: Material, data: MaterialUpdate
) -> Material:
    for field, value in data.model_dump(exclude_unset=True, exclude={"sections"}).items():
        setattr(material, field, value)
    if data.sections is not None:
        material.sections = [section.model_dump() for section in data.sections]
    await session.commit()
    await session.refresh(material)
    return material


async def delete_material(session: AsyncSession, material: Material) -> None:
    await session.delete(material)
    await session.commit()
