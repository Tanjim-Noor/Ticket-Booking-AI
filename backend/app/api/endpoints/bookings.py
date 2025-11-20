"""API endpoints for booking operations."""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends, status
from sqlalchemy.orm import Session

from app.schemas.booking import (
    BookingCreateRequest,
    BookingResponse,
    BookingListResponse,
    BookingStatus
)
from app.models.booking import Booking
from app.core.database import get_db
from app.core.logging import logger

router = APIRouter()


@router.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_request: BookingCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Create a new bus ticket booking.
    
    - **customer_name**: Customer's full name
    - **customer_email**: Customer's email address
    - **customer_phone**: Customer's phone number
    - **from_district**: Departure district
    - **to_district**: Destination district
    - **provider**: Bus provider name
    - **travel_date**: Date of travel
    - **num_seats**: Number of seats to book (1-10)
    - **dropping_point**: Optional dropping point
    """
    try:
        # Calculate total fare (simplified - in production, get from pricing service)
        base_fare_per_seat = 500
        total_fare = base_fare_per_seat * booking_request.num_seats
        
        # Create booking
        booking = Booking(
            customer_name=booking_request.customer_name,
            customer_email=booking_request.customer_email,
            customer_phone=booking_request.customer_phone,
            from_district=booking_request.from_district,
            to_district=booking_request.to_district,
            provider=booking_request.provider,
            travel_date=booking_request.travel_date,
            num_seats=booking_request.num_seats,
            dropping_point=booking_request.dropping_point,
            total_fare=total_fare,
            status=BookingStatus.CONFIRMED
        )
        
        db.add(booking)
        db.commit()
        db.refresh(booking)
        
        logger.info(f"Created booking {booking.id} for {booking.customer_name}")
        return booking
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating booking: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the booking"
        )


@router.get("/bookings", response_model=BookingListResponse)
async def list_bookings(
    customer_email: Optional[str] = Query(None, description="Filter by customer email"),
    customer_phone: Optional[str] = Query(None, description="Filter by customer phone"),
    db: Session = Depends(get_db)
):
    """
    Get list of bookings filtered by customer email or phone.
    
    - **customer_email**: Filter bookings by customer email
    - **customer_phone**: Filter bookings by customer phone
    """
    if not customer_email and not customer_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either customer_email or customer_phone must be provided"
        )
    
    try:
        query = db.query(Booking)
        
        if customer_email:
            query = query.filter(Booking.customer_email == customer_email)
        elif customer_phone:
            query = query.filter(Booking.customer_phone == customer_phone)
        
        bookings = query.order_by(Booking.created_at.desc()).all()
        
        return BookingListResponse(
            bookings=bookings,
            total_bookings=len(bookings)
        )
        
    except Exception as e:
        logger.error(f"Error listing bookings: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching bookings"
        )


@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    """
    Get details of a specific booking by ID.
    
    - **booking_id**: Booking ID
    """
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Booking with ID {booking_id} not found"
            )
        
        return booking
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting booking: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching the booking"
        )


@router.delete("/bookings/{booking_id}")
async def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    """
    Cancel a booking by ID.
    
    - **booking_id**: Booking ID to cancel
    """
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Booking with ID {booking_id} not found"
            )
        
        if booking.status == BookingStatus.CANCELLED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Booking is already cancelled"
            )
        
        booking.status = BookingStatus.CANCELLED
        db.commit()
        
        logger.info(f"Cancelled booking {booking_id}")
        return {"message": f"Booking {booking_id} cancelled successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error cancelling booking: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while cancelling the booking"
        )
