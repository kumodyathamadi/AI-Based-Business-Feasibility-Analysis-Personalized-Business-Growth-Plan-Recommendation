"""Initial PostgreSQL Schema for Component 1 SME Feasibility Decision Support

Revision ID: 2026_09_26_0001
Revises: 
Create Date: 2026-09-26 22:35:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '2026_09_26_0001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create Users Table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. Create Business Profiles Table
    op.create_table(
        'business_profiles',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('business_name', sa.String(), nullable=False),
        sa.Column('business_stage', sa.String(), nullable=False),
        sa.Column('business_category', sa.String(), nullable=False),
        sa.Column('district', sa.String(), nullable=False),
        sa.Column('location_type', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_business_profiles_business_category'), 'business_profiles', ['business_category'], unique=False)
    op.create_index(op.f('ix_business_profiles_business_stage'), 'business_profiles', ['business_stage'], unique=False)
    op.create_index(op.f('ix_business_profiles_district'), 'business_profiles', ['district'], unique=False)
    op.create_index(op.f('ix_business_profiles_user_id'), 'business_profiles', ['user_id'], unique=False)

    # 3. Create Analysis Records Table
    op.create_table(
        'analysis_records',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('business_profile_id', sa.String(), nullable=True),
        sa.Column('business_stage', sa.String(), nullable=False),
        sa.Column('business_category', sa.String(), nullable=False),
        sa.Column('district', sa.String(), nullable=False),
        sa.Column('feasibility_label', sa.String(), nullable=False),
        sa.Column('confidence_score', sa.Float(), nullable=False),
        sa.Column('input_profile', sa.JSON().with_variant(postgresql.JSONB(astext_type=sa.Text()), 'postgresql'), nullable=False),
        sa.Column('structured_profile', sa.JSON().with_variant(postgresql.JSONB(astext_type=sa.Text()), 'postgresql'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['business_profile_id'], ['business_profiles.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_analysis_records_business_category'), 'analysis_records', ['business_category'], unique=False)
    op.create_index(op.f('ix_analysis_records_business_profile_id'), 'analysis_records', ['business_profile_id'], unique=False)
    op.create_index(op.f('ix_analysis_records_business_stage'), 'analysis_records', ['business_stage'], unique=False)
    op.create_index(op.f('ix_analysis_records_district'), 'analysis_records', ['district'], unique=False)
    op.create_index(op.f('ix_analysis_records_feasibility_label'), 'analysis_records', ['feasibility_label'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_analysis_records_feasibility_label'), table_name='analysis_records')
    op.drop_index(op.f('ix_analysis_records_district'), table_name='analysis_records')
    op.drop_index(op.f('ix_analysis_records_business_stage'), table_name='analysis_records')
    op.drop_index(op.f('ix_analysis_records_business_profile_id'), table_name='analysis_records')
    op.drop_index(op.f('ix_analysis_records_business_category'), table_name='analysis_records')
    op.drop_table('analysis_records')

    op.drop_index(op.f('ix_business_profiles_user_id'), table_name='business_profiles')
    op.drop_index(op.f('ix_business_profiles_district'), table_name='business_profiles')
    op.drop_index(op.f('ix_business_profiles_business_stage'), table_name='business_profiles')
    op.drop_index(op.f('ix_business_profiles_business_category'), table_name='business_profiles')
    op.drop_table('business_profiles')

    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
