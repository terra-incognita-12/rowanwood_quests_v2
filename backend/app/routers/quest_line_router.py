from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID, uuid4
from pathlib import Path
import json

from app.db.database import get_db
from app.db.models import Quest, QuestLine, QuestLineOption
from app.schemas import quest_lines_schemas as lines_schema
from app.schemas import quest_line_options_schemas as options_schema
from app.core.config import settings

UPLOAD_DIR = Path(settings.quest_line_photos)

router = APIRouter()

'''
Quest Line operations also includes Quest Line Option operations
'''

def get_quest_by_id(db: Session, quest_id: UUID):
    return db.query(Quest).filter(Quest.id == quest_id).first()

def get_quest_line_by_id(db: Session, quest_line_id: UUID):
    return db.query(QuestLine).filter(QuestLine.id == quest_line_id).first()

def check_order_number_exists(db: Session, quest_id: UUID, order_number: int):
    return db.query(QuestLine).filter(
        QuestLine.quest_id == quest_id, QuestLine.order_number == order_number
    ).first()

# CREATE

@router.post("/{quest_id}", status_code=201)
async def create_quest_line(
    quest_id: UUID,
    name: str = Form(...),
    order_number: int = Form(...),
    description: str = Form(...),
    photo: UploadFile = File(None),
    quest_line_options: List[options_schema.CreateQuestLineOption] = None,
    db: Session = Depends(get_db)
):
    # Check if quest exists
    quest = get_quest_by_id(db, quest_id)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest doesn't exist")

    # Check for dulicate order number
    if check_order_number_exists(db, quest_id, order_number):
        raise HTTPException(status_code=409, detail="Quest Line with this order number already exists")
    
    # Create photo 
    photo_url = None
    file_name = None
    if photo:
        file_name = f"{uuid4()}-{photo.filename}"
        photo_path = UPLOAD_DIR / file_name
        with open(photo_path, "wb") as f:
            f.write(await photo.read())
        photo_url = f"{settings.quest_line_photos}/{file_name}"

    if quest_line_options:
        validation_errors = []
        for option in quest_line_options:
            if not option.description.strip():
                validation_errors.append(f"Description cannot empty.")
            if option.next_quest_line_id:
                # Check if next_quest_line_id exists in the database
                if not db.query(QuestLine).filter(QuestLine.id == option.next_quest_line_id).first():
                    validation_errors.append(
                        f"Next quest line doesn't exist"
                    )
        if validation_errors:
            raise HTTPException(status_code=422, detail={"errors": validation_errors})
        
    new_quest_line = QuestLine(
        name=name.capitalize(),
        order_number=order_number,
        description=description,
        photo=photo_url,
        quest_id=quest_id,
    )

    db.add(new_quest_line)
    db.commit()
    db.refresh(new_quest_line)

    if quest_line_options:
        for option in quest_line_options:
            new_option = QuestLineOption(description=option.description, next_quest_line_id=option.next_quest_line_id, current_quest_line_id=new_quest_line.id)
            db.add(new_option)
        db.commit()

    return {"status": "OK", "data": new_quest_line}

# READ

# All quest lines
@router.get("/{quest_id}", response_model=List[lines_schema.ReadQuestLine])
def read_quest_lines(quest_id: UUID, db: Session = Depends(get_db)):
    quest = get_quest_by_id(db, quest_id)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest doesn't exist")
    
    return quest.quest_lines

# One quest line
@router.get("/{quest_id}/{quest_line_id}", response_model=lines_schema.ReadQuestLine)
def read_quest_line(quest_line_id: UUID, db: Session = Depends(get_db)):
    quest_line = get_quest_line_by_id(db, quest_line_id)
    if not quest_line:
        raise HTTPException(status_code=404, detail="Quest Line doesn't exist")
    
    return quest_line

# Options for the quest line
@router.get("/options/{quest_line_id}", response_model=List[options_schema.ReadQuestLineOption])
def read_quest_line_options(quest_line_id: UUID, db: Session = Depends(get_db)):
    quest_line = get_quest_line_by_id(db, quest_line_id)
    if not quest_line:
        raise HTTPException(status_code=404, detail="Quest Line doesn't exist")
    
    return quest_line.quest_line_options

# UPDATE

@router.patch("/{quest_id}/{quest_line_id}", status_code=200)
async def update_quest_line(
    quest_id: UUID, 
    quest_line_id: UUID, 
    name: Optional[str] = Form(None),
    order_number: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    photo: UploadFile = File(None),
    quest_line_options: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    # Check if quest line exists
    quest_line = get_quest_line_by_id(db, quest_line_id)
    if not quest_line:
        raise HTTPException(status_code=404, detail="Quest Line doesn't exist")

    # Check for duplicate order number
    check_order_number = check_order_number_exists(db, quest_id, order_number)
    if (check_order_number and check_order_number.id != quest_line_id):
        raise HTTPException(status_code=409, detail="Quest Line with this order number already exists")

    if photo is not None:
        if quest_line.photo:
            old_file_path = UPLOAD_DIR / Path(quest_line.photo).name
            if old_file_path.exists():
                old_file_path.unlink()
        file_name = f"{uuid4()}-{photo.filename}"
        photo_path = UPLOAD_DIR / file_name
        with open(photo_path, "wb") as f:
            f.write(await photo.read())
        quest_line.photo = f"{settings.quest_line_photos}/{file_name}"

    quest_line_options_parsed = []

    if quest_line_options:
        try:
            quest_line_options_parsed = json.loads(quest_line_options)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON in quest_line_options")
        
        validation_errors = []
        for option in quest_line_options_parsed:

            option_description = option.get("description", "").strip()
            next_quest_line_id = option.get("next_quest_line_id")
            
            if not option_description:
                validation_errors.append(f"Description cannot empty.")
            if next_quest_line_id:
                # Check if next_quest_line_id exists in the database
                if not db.query(QuestLine).filter(QuestLine.id == next_quest_line_id).first():
                    validation_errors.append(
                        f"Next quest line doesn't exist"
                    )
        if validation_errors:
            raise HTTPException(status_code=422, detail={"errors": validation_errors})

    if name:
        quest_line.name = name
    if order_number:
        quest_line.order_number = order_number
    if description:
        quest_line.description = description

    db.commit()
    db.refresh(quest_line)

    # Updating options if they are needs to be updated
    if (len(quest_line_options_parsed) > 0):
        # Deleting existing options to avoid collisions
        db.query(QuestLineOption).filter(QuestLineOption.current_quest_line_id == quest_line_id).delete()
        db.commit()

        # Adding new options
        for option in quest_line_options_parsed:
            new_option = QuestLineOption(description=option["description"], next_quest_line_id=option["next_quest_line_id"], current_quest_line_id=quest_line.id)
            db.add(new_option)
        db.commit()

    return {"status": "OK", "data": quest_line}

# DELETE

@router.delete("/{quest_line_id}", status_code=200)
def delete_quest_line(quest_line_id: UUID, db: Session = Depends(get_db)):
    quest_line = get_quest_line_by_id(db, quest_line_id)
    if not quest_line:
        raise HTTPException(status_code=404, detail="Quest Line doesn't exist")
    
    if quest_line.photo:
        old_file_path = UPLOAD_DIR / Path(quest_line.photo).name
        if old_file_path.exists():
            old_file_path.unlink()
    
    db.delete(quest_line)
    db.commit()

    return {"status": "OK"}

# Delete only photo
@router.delete("/{quest_line_id}/photo", status_code=200)
def delete_quest_line_photo(quest_line_id: UUID, db: Session = Depends(get_db)):
    quest_line = get_quest_line_by_id(db, quest_line_id)
    if not quest_line:
        raise HTTPException(status_code=404, detail="Quest Line doesn't exist")
    
    if quest_line.photo:
        old_file_path = UPLOAD_DIR / Path(quest_line.photo).name
        if old_file_path.exists():
            old_file_path.unlink()
        quest_line.photo = None

    db.commit()
    db.refresh(quest_line)

    return {"status": "OK"}
