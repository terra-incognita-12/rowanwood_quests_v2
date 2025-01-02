from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID, uuid4
from pathlib import Path

from app.db.database import get_db
from app.db.models import Quest
from app.schemas import quest_schemas as schema

UPLOAD_DIR = Path("app/assets")
UPLOAD_DIR.mkdir(exist_ok=True)

router = APIRouter()

def get_quest_by_id(db: Session, quest_id: UUID):
    return db.query(Quest).filter(Quest.id == quest_id).first()

def get_quest_by_telegram_url(db: Session, telegram_url: str):
    return db.query(Quest).filter(Quest.telegram_url == telegram_url).first()

# CREATE

# No schema since the request is multipart/form-data
@router.post("/", status_code=201)
async def create_quest(
    name: str = Form(...),
    telegram_url: str = Form(...),
    description: str = Form(...),
    photo: UploadFile = File(None),  # photo is optional
    db: Session = Depends(get_db),
):
    if get_quest_by_telegram_url(db, telegram_url):
        raise HTTPException(status_code=409, detail="Quest with this telegram url already exists")

    photo_path = None
    if photo:
        photo_path = UPLOAD_DIR / f"{uuid4()}-{photo.filename}"
        with open(photo_path, "wb") as f:
            f.write(await photo.read())

    new_quest = Quest(
        name=name.capitalize(),
        telegram_url=telegram_url,
        description=description,
        photo=str(photo_path) if photo_path else None,
    )

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
        