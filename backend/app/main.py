from fastapi import Depends
from app.core.security import get_current_user

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import quest_router, quest_line_router, user_router
from app.core.config import settings
from pathlib import Path

UPLOAD_DIR = Path(settings.quest_uploads)
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()

app.include_router(quest_router.router, prefix="/quests", tags=["Quests"])
app.include_router(quest_line_router.router, prefix="/quest_lines", tags=["Quest Lines"])
app.include_router(user_router.router, prefix="/auth", tags=["User"])

app.mount("/quest_uploads", StaticFiles(directory=UPLOAD_DIR), name="quest_uploads")

# Temporarily solution to conncet with react
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def read_root(user: str = Depends(get_current_user)):
    return {"message": "Hello world!"}
