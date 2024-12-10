import uuid
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class QuestBase(BaseModel):
    name: str
    url: str
    telegram_url: str
    brief_description: Optional[str] = None
    full_description: Optional[str] = None
    photo: Optional[str] = None

# CREATE

class CreateQuest(QuestBase):
    pass

# READ

class ReadQuest(QuestBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# UPDATE

class UpdateQuest(QuestBase):
    name: Optional[str] = None
    url: Optional[str] = None
    telegram_url: Optional[str] = None
    brief_description: Optional[str] = None
    full_description: Optional[str] = None
    photo: Optional[str] = None