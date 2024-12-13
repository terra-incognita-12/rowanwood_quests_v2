from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.schemas import quest_line_options_schemas as qlo_schema

class QuestLineBase(BaseModel):
    name: str = Field(..., max_length=50)
    order_number: int
    description: str
    photo: Optional[str] = None

class CreateQuestLine(QuestLineBase):
    quest_line_options: Optional[List[qlo_schema.CreateQuestLineOption]] = None

class ReadQuestLine(QuestLineBase):
    id: UUID
    quest_id: UUID
    created_at: datetime
    updated_at: datetime
    quest_line_options: List[qlo_schema.ReadNestedQuestLineOption] = []

    class Config:
        from_attributes = True

class UpdateQuestLine(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    order_number: Optional[int] = None
    description: Optional[str] = None
    photo: Optional[str] = None
    quest_line_options: Optional[List[qlo_schema.UpdateQuestLineOption]] = None

    