from uuid import UUID
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class QuestBase(BaseModel):
    name: str
    telegram_url: str
    brief_description: Optional[str] = None
    full_description: Optional[str] = None
    photo: Optional[str] = None

class CreateQuest(QuestBase):
    pass

class ReadQuest(QuestBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UpdateQuest(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    telegram_url: Optional[str] = None
    brief_description: Optional[str] = None
    full_description: Optional[str] = None
    photo: Optional[str] = None