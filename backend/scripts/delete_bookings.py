"""Script to delete all bookings from the database.

Usage:
    python delete_bookings.py
"""
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import SessionLocal
from app.models.booking import Booking
from app.core.logging import logger


def delete_all_bookings():
    """Delete all bookings from the database."""
    db = SessionLocal()
    try:
        # Count existing bookings
        count = db.query(Booking).count()
        logger.info(f"Found {count} bookings in the database")
        
        if count == 0:
            print("No bookings found. Database is already empty.")
            return
        
        # Confirm deletion
        confirmation = input(f"Are you sure you want to delete all {count} bookings? (yes/no): ")
        if confirmation.lower() != "yes":
            print("Operation cancelled.")
            return
        
        # Delete all bookings
        deleted = db.query(Booking).delete()
        db.commit()
        
        logger.info(f"Successfully deleted {deleted} bookings")
        print(f"✅ Successfully deleted {deleted} bookings from the database.")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting bookings: {str(e)}")
        print(f"❌ Error: {str(e)}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 50)
    print("Delete All Bookings Script")
    print("=" * 50)
    delete_all_bookings()
