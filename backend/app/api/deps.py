from fastapi import Header, HTTPException


async def get_current_user_id(
    x_user_id: int | None = Header(default=None),
) -> int:
    """
    Временная зависимость.

    Сейчас user_id передается в заголовке X-User-Id.
    После реализации JWT заменить эту функцию на реальную авторизацию.
    """
    if x_user_id is None:
        raise HTTPException(status_code=401, detail="X-User-Id header is required")
    return x_user_id
