"""Pydantic schemas for bus-related operations."""
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date


class BusSearchRequest(BaseModel):
    """Request model for bus search."""
    from_district: str = Field(..., description="Departure district name")
    to_district: str = Field(..., description="Destination district name")
    travel_date: Optional[date] = Field(None, description="Travel date (optional)")
    provider: Optional[str] = Field(None, description="Filter by bus provider (optional)")


class DroppingPoint(BaseModel):
    """Dropping point information."""
    name: str
    price: int


class RouteResponse(BaseModel):
    """Response model for a single route."""
    provider: str
    from_district: str
    to_district: str
    min_price: int
    max_price: int
    dropping_points: List[DroppingPoint]
    description: str


class BusSearchResponse(BaseModel):
    """Response model for bus search results."""
    routes: List[RouteResponse]
    total_results: int


class BusProviderResponse(BaseModel):
    """Response model for bus provider information."""
    name: str
    coverage_districts: List[str]
    details: Optional[str] = None


class BusProvidersListResponse(BaseModel):
    """Response model for list of bus providers."""
    providers: List[BusProviderResponse]
    total_providers: int
