from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.db.models import Quest
from app.schemas import quest_schemas as schema

router = APIRouter()

def get_quest_by_id(db: Session, quest_id: UUID):
    return db.query(Quest).filter(Quest.id == quest_id).first()

def get_quest_by_telegram_url(db: Session, telegram_url: str):
    return db.query(Quest).filter(Quest.telegram_url == telegram_url).first()

# CREATE

@router.post("/", status_code=201)
def create_quest(payload: schema.CreateQuest, db: Session = Depends(get_db)): 
    if get_quest_by_telegram_url(db, payload.telegram_url):
        raise HTTPException(status_code=409, detail="Quest with this telegram url already exists")

    new_quest = Quest(name=payload.name.capitalize(), **payload.model_dump(exclude={"name"}))
    db.add(new_quest)
    db.commit()
    db.refresh(new_quest)

    return {"status": "OK", "data": new_quest}

# READ

@router.get("/", response_model=List[schema.ReadQuest])
def read_quests(db: Session = Depends(get_db)):
    return db.query(Quest).all()

@router.get("/{quest_id}", response_model=schema.ReadQuest)
def read_quest(quest_id: UUID, db: Session = Depends(get_db)):
    quest = get_quest_by_id(db, quest_id)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest doesn't exist")
    
    return quest

# UPDATE

@router.patch("/{quest_id}", status_code=200)
def update_quest(quest_id: UUID, payload: schema.UpdateQuest, db: Session = Depends(get_db)):
    quest = get_quest_by_id(db, quest_id)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest doesn't exist")
    if db.query(Quest).filter(Quest.telegram_url == payload.telegram_url, Quest.id != quest_id).first():
        raise HTTPException(status_code=409, detail="Quest with this telegram url already exists")
    
    updated_data = payload.model_dump(exclude_unset=True)
    updated_data["name"] = updated_data.get("name", quest.name).capitalize()
    db.query(Quest).filter(Quest.id == quest_id).update(updated_data, synchronize_session=False)
    db.commit()
    db.refresh(quest)

    return {"status": "OK", "data": quest}

# DELETE

@router.delete("/{quest_id}", status_code=200)
def delete_quest(quest_id: UUID, db: Session = Depends(get_db)):
    quest = get_quest_by_id(db, quest_id)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest doesn't exist")
    
    db.query(Quest).filter(Quest.id == quest_id).delete(synchronize_session=False)
    db.commit()

    return {"status": "OK"}
        