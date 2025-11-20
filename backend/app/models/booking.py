"""Database models for bookings."""
from sqlalchemy import Column, Integer, String, DateTime, Enum, Date
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
    customer_email = Column(String, nullable=False, index=True)
    customer_phone = Column(String, nullable=False, index=True)
    
    # Route information
    from_district = Column(String, nullable=False)
    to_district = Column(String, nullable=False)
    provider = Column(String, nullable=False)  # Changed from bus_provider to provider
    
    # Booking details
    travel_date = Column(Date, nullable=False)
    num_seats = Column(Integer, nullable=False, default=1)
    dropping_point = Column(String, nullable=True)
    total_fare = Column(Integer, nullable=False, default=0)
    status = Column(Enum(BookingStatus), default=BookingStatus.CONFIRMED)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Booking {self.id}: {self.customer_name} - {self.from_district} to {self.to_district}>"
