"""Database models for bookings."""
from sqlalchemy import Column, Integer, String, DateTime, Enum
from datetime import datetime
import enum

from app.core.database import Base


class BookingStatus(str, enum.Enum):
    """Booking status enumeration."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


class Booking(Base):
    """Booking model for storing ticket bookings."""
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False, index=True)
    
    # Route information
    from_district = Column(String, nullable=False)
    to_district = Column(String, nullable=False)
    bus_provider = Column(String, nullable=False)
    
    # Booking details
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Booking {self.id}: {self.customer_name} - {self.from_district} to {self.to_district}>"
