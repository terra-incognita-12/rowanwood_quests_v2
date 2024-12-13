from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class QuestLineOptionBase(BaseModel):
    description: str
    current_quest_line_id: UUID
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
    description: str
    next_quest_line_id: Optional[UUID]
    
    class Config:
        from_attributes = True

class UpdateQuestLineOption(BaseModel):
    description: Optional[str] = None
    current_quest_line_id: Optional[UUID] = None
    next_quest_line_id: Optional[UUID] = None
