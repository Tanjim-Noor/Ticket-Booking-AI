"""Pydantic schemas for booking operations."""
from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from datetime import date, datetime
from enum import Enum


class BookingStatus(str, Enum):
    """Booking status enumeration."""
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    PENDING = "pending"


class BookingCreateRequest(BaseModel):
    """Request model for creating a booking."""
    customer_name: str = Field(..., min_length=2, max_length=100)
    customer_email: EmailStr
    customer_phone: str = Field(..., pattern=r"^\+?[0-9]{10,15}$")
    from_district: str
    to_district: str
    provider: str
    travel_date: date
    num_seats: int = Field(..., gt=0, le=10, description="Number of seats (1-10)")
    dropping_point: Optional[str] = None


class BookingResponse(BaseModel):
    """Response model for booking details."""
    id: int
    customer_name: str
    customer_email: str
    customer_phone: str
    from_district: str
    to_district: str
    provider: str
    travel_date: date
    num_seats: int
    dropping_point: Optional[str]
    status: BookingStatus
    total_fare: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BookingListResponse(BaseModel):
    """Response model for list of bookings."""
    bookings: list[BookingResponse]
    total_bookings: int
