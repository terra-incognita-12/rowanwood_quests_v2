import uuid
from sqlalchemy import TIMESTAMP, Column, String, Boolean, TEXT
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.database import Base

class Quest(Base):
    __tablename__ = "quests"

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4)
    name = Column(String(50), nullable=False)
    url = Column(String(255), unique=True, nullable=False)
    telegram_url = Column(String, unique=True, nullable=False)
    brief_description = Column(String, nullable=True)
    full_description = Column(TEXT, nullable=True)
    photo = Column(String, nullable=True)
    is_activated = Column(Boolean, default=False, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())