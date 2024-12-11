from fastapi import FastAPI
from app.routers import quest_router, quest_line_router
from app.core.config import settings

app = FastAPI()

app.include_router(quest_router.router, prefix="/quests", tags=["Quests"])
app.include_router(quest_line_router.router, prefix="/quest_lines", tags=["Quest Lines"])

@app.get("/")
def read_root():
    return {"message": "Hello world!"}
