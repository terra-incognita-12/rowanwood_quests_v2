from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.database import get_db
from app.db.models import Quest
from app.schemas import quest_schemas as schema

router = APIRouter()

# CREATE

@router.post("/", status_code=201)
def create_quest(payload: schema.CreateQuest, db: Session = Depends(get_db)): 
    check_url = db.query(Quest).filter(Quest.url == payload.url).first()
    if check_url:
        raise HTTPException(status_code=409, detail="Quest with this url already exists")
    check_telegram_url = db.query(Quest).filter(Quest.telegram_url == payload.telegram_url).first()
    if check_telegram_url:
        raise HTTPException(status_code=409, detail="Quest with this telegram url already exists")
    
    payload.name = payload.name.capitalize()

    new_quest = Quest(**payload.model_dump())
    db.add(new_quest)
    db.commit()
    db.refresh(new_quest)

    return {"status": "OK", "id": new_quest.id}

# READ

@router.get("/", response_model=List[schema.ReadQuest])
def read_quests(db: Session = Depends(get_db)):
    quests = db.query(Quest).all()
    return quests

@router.get("/{quest_id}", response_model=schema.ReadQuest)
def read_quest(quest_id: uuid.UUID, db: Session = Depends(get_db)):
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest doesn't exist")
    
    return quest

# UPDATE

@router.patch("/{quest_id}", status_code=200)
def update_quest(quest_id: uuid.UUID, payload: schema.UpdateQuest, db: Session = Depends(get_db)):
    check_quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not check_quest:
        raise HTTPException(status_code=404, detail="Quest doesn't exist")
    
    check_telegram_url = db.query(Quest).filter(Quest.telegram_url == payload.telegram_url).first()
    if check_telegram_url and check_telegram_url.id != quest_id:
        raise HTTPException(status_code=409, detail="Quest with this telegram url already exists")
    
    payload.name = payload.name.capitalize()

    updated_quest_data = payload.model_dump(exclude_unset=True)
    quest = db.query(Quest).filter(Quest.id == quest_id)
    quest.update(updated_quest_data, synchronize_session=False)
    db.commit()
    db.refresh(check_quest)

    return {"status": "OK", "id": check_quest.id}

# DELETE

@router.delete("/{quest_id}", status_code=200)
def delete_quest(quest_id: uuid.UUID, db: Session = Depends(get_db)):
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest doesn't exist")
    db.delete(quest)
    db.commit()

    return {"status": "OK"}
        