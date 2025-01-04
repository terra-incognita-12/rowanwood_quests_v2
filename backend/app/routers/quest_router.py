from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID, uuid4
from pathlib import Path

from app.db.database import get_db
from app.db.models import Quest
from app.schemas import quest_schemas as schema
from app.core.config import settings

UPLOAD_DIR = Path(settings.quest_uploads)

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

    photo_url = None
    if photo:
        file_name = f"{uuid4()}-{photo.filename}"
        photo_path = UPLOAD_DIR / file_name
        with open(photo_path, "wb") as f:
            f.write(await photo.read())
        photo_url = f"/quest_uploads/{file_name}"

    new_quest = Quest(
        name=name,
        telegram_url=telegram_url,
        description=description,
        photo=photo_url,
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
async def update_quest(
    quest_id: UUID, 
    name: str = Form(None, max_length=50),
    telegram_url: str = Form(None, max_length=255),
    description: str = Form(None),
    photo: UploadFile = File(None), 
    db: Session = Depends(get_db)
):
    quest = get_quest_by_id(db, quest_id)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest doesn't exist")
    if db.query(Quest).filter(Quest.telegram_url == telegram_url, Quest.id != quest_id).first():
        raise HTTPException(status_code=409, detail="Quest with this telegram url already exists")
    
    if photo is not None:
        # Deleting photo
        if photo.filename == "null":
            if quest.photo:
                old_file_path = UPLOAD_DIR / Path(quest.photo).name
                if old_file_path.exists():
                    old_file_path.unlink()
            quest.photo = None
        # Updating photo
        else:
            if quest.photo:
                old_file_path = UPLOAD_DIR / Path(quest.photo).name
                if old_file_path.exists():
                    old_file_path.unlink()
            file_name = f"{uuid4()}-{photo.filename}"
            photo_path = UPLOAD_DIR / file_name
            with open(photo_path, "wb") as f:
                f.write(await photo.read())
            quest.photo = f"/quest_uploads/{file_name}"

    if name:
        quest.name = name
    if telegram_url:
        quest.telegram_url = telegram_url
    if description:
        quest.description = description

    db.commit()
    db.refresh(quest)

    return {"status": "OK", "data": quest}

# DELETE

@router.delete("/{quest_id}", status_code=200)
def delete_quest(quest_id: UUID, db: Session = Depends(get_db)):
    quest = get_quest_by_id(db, quest_id)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest doesn't exist")
    
    if quest.photo:
        file_path = UPLOAD_DIR / Path(quest.photo).name
        if file_path.exists():
            file_path.unlink()

    db.query(Quest).filter(Quest.id == quest_id).delete(synchronize_session=False)
    db.commit()

    return {"status": "OK"}
        