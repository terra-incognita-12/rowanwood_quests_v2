from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class LibraryRecordBase(BaseModel):
    name: str
    description: str
    photo: Optional[str] = None

class ReadLibraryRecord(LibraryRecordBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True