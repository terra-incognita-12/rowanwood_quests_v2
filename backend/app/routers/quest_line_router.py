from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.db.models import Quest, QuestLine, QuestLineOption
from app.schemas import quest_lines_schemas as lines_schema
from app.schemas import quest_line_options_schemas as options_schema

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
def create_quest_line(quest_id: UUID, payload: lines_schema.CreateQuestLine, db: Session = Depends(get_db)):
    # Check if quest exists
    quest = get_quest_by_id(db, quest_id)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest doesn't exist")

    # Check for duplicate order number
    if check_order_number_exists(db, quest_id, payload.order_number):
        raise HTTPException(status_code=409, detail="Quest Line with this order number already exists")
    
    new_quest_line = QuestLine(name=payload.name.capitalize(), quest_id=quest_id, **payload.model_dump(exclude={"name", "quest_line_options"}))
    db.add(new_quest_line)
    db.commit()
    db.refresh(new_quest_line)

    # Adding all quest line options if they are exists
    if payload.quest_line_options:
        for option in payload.quest_line_options:
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
@router.get("/line/{quest_line_id}", response_model=lines_schema.ReadQuestLine)
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
def update_quest_line(quest_id: UUID, quest_line_id: UUID, payload: lines_schema.UpdateQuestLine, db: Session = Depends(get_db)):
    # Check if quest line exists
    quest_line = get_quest_line_by_id(db, quest_line_id)
    if not quest_line:
        raise HTTPException(status_code=404, detail="Quest Line doesn't exist")

    # Check for duplicate order number
    if check_order_number_exists(db, quest_id, payload.order_number):
        raise HTTPException(status_code=409, detail="Quest Line with this order number already exists")
    
    updated_data = payload.model_dump(exclude_unset=True, exclude={"quest_line_options"})
    updated_data["name"] = updated_data.get("name", quest_line.name).capitalize()
    db.query(QuestLine).filter(QuestLine.id == quest_line_id).update(updated_data, synchronize_session=False)
    db.commit()
    db.refresh(quest_line)

    # Updating options if they are needs to be updated
    if payload.quest_line_options:
        # Deleting existing options to avoid collisions
        db.query(QuestLineOption).filter(QuestLineOption.current_quest_line_id == quest_line_id).delete()
        db.commit()

        # Adding new options
        for option in payload.quest_line_options:
            new_option = QuestLineOption(description=option.description, next_quest_line_id=option.next_quest_line_id, current_quest_line_id=quest_line.id)
            db.add(new_option)
        db.commit()

    return {"status": "OK", "data": quest_line}

# DELETE

@router.delete("/{quest_line_id}", status_code=200)
def delete_quest_line(quest_line_id: UUID, db: Session = Depends(get_db)):
    quest_line = get_quest_line_by_id(db, quest_line_id)
    if not quest_line:
        raise HTTPException(status_code=404, detail="Quest Line doesn't exist")
    db.delete(quest_line)
    db.commit()

    return {"status": "OK"}