from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class QuestBase(BaseModel):
    name: str = Field(..., max_length=50)
    telegram_url: str = Field(..., max_length=255)
    description: Optional[str] = None
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
    name: Optional[str] = Field(None, max_length=50)
    url: Optional[str] = None
    telegram_url: Optional[str] = Field(None, max_length=255)
    brief_description: Optional[str] = None
    full_description: Optional[str] = None
    photo: Optional[str] = None