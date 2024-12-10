from fastapi import FastAPI
from app.routers import quest_router
from app.core.config import settings

app = FastAPI()

app.include_router(quest_router.router, prefix="/quests", tags=["quests"])

@app.get("/")
def read_root():
    return {"message": "Hello world!"}
