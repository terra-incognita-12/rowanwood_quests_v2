from decouple import config
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    debug: bool = config("DEBUG", cast=bool, default=True)
    db_name: str = config("DB_NAME")
    db_user: str = config("DB_USER")
    db_pass: str = config("DB_PASS")
    db_host: str = config("DB_HOST")
    db_port: str = config("DB_PORT")

    class Config:
        env_file = ".env"

settings = Settings()