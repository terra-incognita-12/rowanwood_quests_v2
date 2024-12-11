from uuid import uuid4
from sqlalchemy import TIMESTAMP, Column, String, Boolean, TEXT, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.database import Base

class Quest(Base):
    __tablename__ = "quests"

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid4)
    name = Column(String(50), nullable=False)
    telegram_url = Column(String(255), unique=True, nullable=False)
    brief_description = Column(String(100), nullable=True)
    full_description = Column(TEXT, nullable=True)
    photo = Column(String, nullable=True)
    is_activated = Column(Boolean, default=False, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    # Back-populate quest_lines
    quest_lines = relationship("QuestLine", back_populates="quest")

class QuestLine(Base):
    __tablename__ = "quest_lines"
    __table_args__ = (
        UniqueConstraint("quest_id", "order_number", name="uq_quest_order"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid4)
    name = Column(String(50), nullable=False)
    order_number = Column(Integer, nullable=False) # Unique per quest
    description = Column(TEXT, nullable=False)
    photo = Column(String, nullable=True)
    quest_id = Column(UUID(as_uuid=True), ForeignKey("quests.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    # Back-populate quests
    quest = relationship("Quest", back_populates="quest_lines")