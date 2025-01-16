from uuid import uuid4
from sqlalchemy import TIMESTAMP, Column, String, Boolean, TEXT, Integer, ForeignKey, UniqueConstraint, DateTime, Enum
from sqlalchemy.orm import relationship, backref
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import enum

from app.db.database import Base

'''
Users - user: no access to admin/editor page; edtior: no access to admin page; admin: full access 
'''
class UserRole(enum.Enum):
    user = "user"
    editor = "editor"
    admin = "admin"

class User(Base):
    __tablename__ = "users";

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid4)
    email = Column(String, unique=True, nullable=False)
    username = Column(String(25), unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_verified = Column(Boolean, default=False)
    password_token = Column(String, nullable=True, unique=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
'''
Quests are the models that contains main quest entities.
'''
class Quest(Base):
    __tablename__ = "quests"

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid4)
    # Quest name (ex: "Ranger Aaty on the planet Bonnasis")
    name = Column(String(50), nullable=False)
    # URL that uses telegram bot
    telegram_url = Column(String(255), unique=True, nullable=False)
    # Quest description (ex: The local intelligence office for one of the Human planets has received information about a secret base belonging to a notorious Peleng Lyakusha known as Borzukhan. You need to capture him alive.)
    description = Column(TEXT, nullable=True)
    # Quest profile photo
    photo = Column(String, nullable=True)
    # is_acitvated - once quest creating/editing is done, editor submitting this to admin before quest is posted
    is_activated = Column(Boolean, default=False, nullable=False)
    # Timestamps
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    quest_lines = relationship("QuestLine", back_populates="quest")

'''
Quest lines are the "pages" in a full quest story. For example:

Ranger Aaty is standing on the intersection of four roads. What is his next step?
'''
class QuestLine(Base):
    __tablename__ = "quest_lines"
    # Ensures the "order_number" stay unique per each quest_id
    __table_args__ = (
        UniqueConstraint("quest_id", "order_number", name="uq_quest_order"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid4)
    # Name for the editor panel (only editor and admin can see it)
    name = Column(String(50), nullable=False)
    # Unique number for the editor panel (only editor and admin can see it)
    order_number = Column(Integer, nullable=False)
    # Description of the current quest line for the player
    description = Column(TEXT, nullable=False)
    # Pointer to the host Quest
    quest_id = Column(UUID(as_uuid=True), ForeignKey("quests.id", ondelete="CASCADE"), nullable=False)
    # Timestamps
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    quest = relationship("Quest", back_populates="quest_lines")
    quest_line_options = relationship("QuestLineOption", back_populates="current_quest_line", foreign_keys="[QuestLineOption.current_quest_line_id]", cascade="all, delete")

'''
Quest line options are the chains between the quest lines. For example:

Ranger Aaty is standing on the intersection of four roads. What is his next step?
- Go straight <- That is the quest line
- Go right    <- That is the quest line
- Go left     <- That is the quest line
- Return back <- That is the quest line
'''
class QuestLineOption(Base):
    __tablename__ = "quest_line_options"

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid4)
    # Description of the current quest line option for the player
    description = Column(String(255), nullable=False)
    # Pointer to the host Quest Line
    current_quest_line_id = Column(UUID(as_uuid=True), ForeignKey("quest_lines.id", ondelete="CASCADE"), nullable=False)
    # Pointer to the next Quest Line if this option is selected
    next_quest_line_id = Column(UUID(as_uuid=True), ForeignKey("quest_lines.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    current_quest_line = relationship("QuestLine", foreign_keys=[current_quest_line_id], back_populates="quest_line_options")
    next_quest_line = relationship("QuestLine", foreign_keys=[next_quest_line_id])