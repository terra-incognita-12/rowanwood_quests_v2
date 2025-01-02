from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import quest_router, quest_line_router
from app.core.config import settings

app = FastAPI()

app.include_router(quest_router.router, prefix="/quests", tags=["Quests"])
app.include_router(quest_line_router.router, prefix="/quest_lines", tags=["Quest Lines"])

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
def read_root():
    return {"message": "Hello world!"}
