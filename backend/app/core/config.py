from decouple import config
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    debug: bool = config("DEBUG", cast=bool, default=True)
    db_name: str = config("DB_NAME")
    db_user: str = config("DB_USER")
    db_pass: str = config("DB_PASS")
    db_host: str = config("DB_HOST")
    db_port: str = config("DB_PORT")
    quest_uploads: str = config("QUEST_UPLOADS")
    smtp_server: str = config("SMTP_SERVER")
    smtp_port: str = config("SMTP_PORT")
    from_email: str = config("FROM_EMAIL")

    access_token_secret: str = config("ACCESS_TOKEN_SECRET")
    refresh_token_secret: str = config("REFRESH_TOKEN_SECRET")
    access_token_expire_minutes: int = config("ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_minutes: int = config("REFRESH_TOKEN_EXPIRE_MINUTES")

    class Config:
        env_file = ".env"

settings = Settings()