from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.db.models import Quest
from app.schemas import quest_schemas as schema

router = APIRouter()

# READ

@router.get("/", response_model=List[schema.ReadQuest])
def read_quests(db: Session = Depends(get_db)):
    quests = db.query(Quest).all()
    return quests