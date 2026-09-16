from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    first_name: str
    last_name: str
    patronymic: str | None = None
    email: EmailStr
    passport: str | None = None
    snils: str | None = None
    education: str | None = None
    id_region: int | None = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    patronymic: str | None = None
    email: EmailStr | None = None
    passport: str | None = None
    snils: str | None = None
    education: str | None = None
    id_region: int | None = None


class UserResponse(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
