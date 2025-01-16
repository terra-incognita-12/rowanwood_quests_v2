from fastapi import Request, HTTPException
import datetime as dt
import jwt
from app.core.config import settings

def create_access_token(username: str) -> str:
    payload = {
        "sub": username,
        "iat": dt.datetime.now(dt.timezone.utc),
        "exp": dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=settings.access_token_expire_minutes),
    }
    token = jwt.encode(payload, settings.access_token_secret, algorithm="HS256")
    
    return token

def create_refresh_token(username: str) -> str:
    payload = {
        "sub": username,
        "iat": dt.datetime.now(dt.timezone.utc),
        "exp": dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=settings.refresh_token_expire_minutes),
    }
    token = jwt.encode(payload, settings.refresh_token_secret, algorithm="HS256")
    
    return token

def decode_access_token(token: str) -> dict:
    payload = jwt.decode(token, settings.access_token_secret, algorithms=["HS256"])
    
    return payload

def decode_refresh_token(token: str) -> dict:
    payload = jwt.decode(token, settings.refresh_token_secret, algorithms=["HS256"])
    
    return payload

async def get_current_user(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token payload.")
    try:
        payload = decode_access_token(token)
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token payload.")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token expired.")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate token.")