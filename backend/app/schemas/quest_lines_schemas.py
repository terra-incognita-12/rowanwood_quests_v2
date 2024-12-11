from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class QuestLineBase(BaseModel):
    name: str = Field(..., max_length=50)
    order_number: int
    description: str
    photo: Optional[str] = None

class CreateQuestLine(QuestLineBase):
    pass

class ReadQuestLine(QuestLineBase):
    id: UUID
    quest_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UpdateQuestLine(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    order_number: Optional[int] = None
    description: Optional[str] = None
    photo: Optional[str] = None
    