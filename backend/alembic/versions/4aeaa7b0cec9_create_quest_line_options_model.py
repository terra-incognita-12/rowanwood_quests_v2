"""Create Quest Line Options model

Revision ID: 4aeaa7b0cec9
Revises: 7325c64ecba0
Create Date: 2024-12-13 09:13:32.037070

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4aeaa7b0cec9'
down_revision: Union[str, None] = '7325c64ecba0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('quest_line_options',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('current_quest_line_id', sa.UUID(), nullable=False),
    sa.Column('next_quest_line_id', sa.UUID(), nullable=False),
    sa.ForeignKeyConstraint(['current_quest_line_id'], ['quest_lines.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['next_quest_line_id'], ['quest_lines.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('quest_line_options')
    # ### end Alembic commands ###
