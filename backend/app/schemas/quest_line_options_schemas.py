from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

class QuestLineOptionBase(BaseModel):
    description: str = Field(..., max_length=255)
    next_quest_line_id: Optional[UUID] = None

class CreateQuestLineOption(QuestLineOptionBase):
    pass

class ReadQuestLineOption(QuestLineOptionBase):
    id: UUID

    class Config:
        from_attributes = True

# That schema is to be included in Quest Line when it's pulled
class ReadNestedQuestLineOption(BaseModel):
    id: UUID
    description: str = Field(..., max_length=255)
    next_quest_line_id: Optional[UUID]
    
    class Config:
        from_attributes = True

class UpdateQuestLineOption(BaseModel):
    description: Optional[str] = Field(None, max_length=255)
    next_quest_line_id: Optional[UUID] = None
