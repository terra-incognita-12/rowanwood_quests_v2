from pydantic import BaseModel
from typing import Optional

class QuestBase(BaseModel):
    name: str
    url: str
    telegram_url: str
    brief_description: Optional[str]
    full_description: Optional[str]
    photo: Optional[str]

class ReadQuest(QuestBase):
    class Config:
        orm_mode = True