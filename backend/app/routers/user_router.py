from fastapi import APIRouter, HTTPException, Depends, Request, Response
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from uuid import uuid4
import jwt
from app.core.email import send_email
from app.db.database import get_db
from app.db.models import User, UserRole
from app.core.utils import Hasher
from app.schemas import user_schemas as schema
from app.core.security import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token
from app.core.config import settings

router = APIRouter()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

@router.post("/register")
def register(payload: schema.UserRegister, db: Session = Depends(get_db)):
    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=409, detail="User with this email already exists.")
    if get_user_by_username(db, payload.username):
        raise HTTPException(status_code=409, detail="User wuth this username already exists.")

    hashed_password = Hasher.hash_password(payload.password)

    new_user = User(
        email=payload.email,
        username=payload.username,
        password=hashed_password,
        is_verified=True,
        password_token=None,
        role=UserRole.user,
    )

    db.add(new_user)
    db.commit()

    return {"status": "OK"}

@router.post("/login")
def login(payload: schema.UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_username(db, payload.username)
    if not user or not Hasher.verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = create_access_token(payload.username)
    refresh_token = create_refresh_token(payload.username)

    response = JSONResponse(content={"Status": "OK"})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=settings.access_token_expire_minutes * 60,
        samesite="strict"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=settings.refresh_token_expire_minutes * 24 * 60 * 60,
        samesite="strict"
    )

    return response

@router.post("/logout")
def logout():
    response = JSONResponse(content={"status": "OK"})
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return response

@router.post("/token/refresh")
def refresh_token(request: Request, db: Session = Depends(get_db)):
    """
    Use the refresh token to get a new access token.
    """
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token provided.")
    try:
        payload = decode_refresh_token(token)
        username = payload.get("sub")
        user = get_user_by_username(db, username)
        if username is None or not user:
            raise HTTPException(status_code=401, detail="Invalid refresh token payload.")
        # Create a new access token
        new_access_token = create_access_token(username)
        response = JSONResponse(content={"message": "Access token refreshed."})
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            max_age=settings.access_token_expire_minutes * 60,
            samesite="strict"
        )
        return response
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired.")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate refresh token.")