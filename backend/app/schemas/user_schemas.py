from pydantic import BaseModel, EmailStr
from app.db.models import UserRole

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    email: EmailStr
    username: str
    role: UserRole

    class Config:
        use_enum_values = True

class ResetPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordConfirm(BaseModel):
    token: str
    new_password: str