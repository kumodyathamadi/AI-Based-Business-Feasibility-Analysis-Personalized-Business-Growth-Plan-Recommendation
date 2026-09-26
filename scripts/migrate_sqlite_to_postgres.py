import os
import sys
import sqlite3
import json
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Ensure root directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.models import Base, AnalysisRecord
from backend.database import SQLITE_DB_PATH, DATABASE_URL

load_dotenv()

def migrate_data():
    """
    Safely migrates existing historical analysis records from SQLite to PostgreSQL.
    """
    print("=" * 80)
    print("SQLITE TO POSTGRESQL DATA MIGRATION UTILITY")
    print("=" * 80)

    if not os.path.exists(SQLITE_DB_PATH):
        print(f"[Info] No existing SQLite database found at: {SQLITE_DB_PATH}")
        return

    # 1. Read SQLite data
    print(f"Reading SQLite database at: {SQLITE_DB_PATH}...")
    conn = sqlite3.connect(SQLITE_DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id, business_stage, business_category, district, feasibility_label, confidence_score, input_profile, structured_profile, created_at FROM analysis_records")
        rows = cursor.fetchall()
        print(f"Found {len(rows)} record(s) in SQLite database.")
    except sqlite3.OperationalError as e:
        print(f"[Info] Could not query SQLite table 'analysis_records': {e}")
        conn.close()
        return

    conn.close()

    if not rows:
        print("No records to migrate.")
        return

    # 2. Connect to PostgreSQL
    postgres_url = os.getenv("DATABASE_URL", DATABASE_URL)
    if postgres_url.startswith("sqlite"):
        print("[Notice] DATABASE_URL is set to SQLite. Set DATABASE_URL to your PostgreSQL connection string in .env to run migration.")
        return

    print(f"Connecting to target database: {postgres_url.split('@')[-1]}...")
    try:
        pg_engine = create_engine(postgres_url, pool_pre_ping=True)
        Base.metadata.create_all(bind=pg_engine)
        SessionLocal = sessionmaker(bind=pg_engine)
        session = SessionLocal()
    except Exception as e:
        print(f"[Error] Failed to connect to PostgreSQL: {e}")
        return

    # 3. Insert records into PostgreSQL
    migrated_count = 0
    for row in rows:
        rec_id, stage, cat, dist, label, conf, raw_input_json, raw_profile_json, created = row
        
        # Parse JSON if stored as string in SQLite
        input_data = json.loads(raw_input_json) if isinstance(raw_input_json, str) else raw_input_json
        profile_data = json.loads(raw_profile_json) if isinstance(raw_profile_json, str) else raw_profile_json

        # Check if record already exists in PostgreSQL
        existing = session.query(AnalysisRecord).filter_by(id=rec_id).first()
        if not existing:
            new_rec = AnalysisRecord(
                id=rec_id,
                business_stage=stage,
                business_category=cat,
                district=dist,
                feasibility_label=label,
                confidence_score=conf,
                input_profile=input_data,
                structured_profile=profile_data
            )
            session.add(new_rec)
            migrated_count += 1

    session.commit()
    session.close()
    print(f"[Success] Migrated {migrated_count} record(s) into PostgreSQL database.")
    print("=" * 80)

if __name__ == "__main__":
    migrate_data()
