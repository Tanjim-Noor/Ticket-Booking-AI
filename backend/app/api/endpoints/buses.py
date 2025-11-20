"""API endpoints for bus-related operations."""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends, status

from app.schemas.bus import (
    BusSearchResponse,
    RouteResponse,
    BusProvidersListResponse,
    BusProviderResponse
)
from app.services.bus_service import get_bus_service, BusService
from app.core.logging import logger

router = APIRouter()


@router.get("/buses/search", response_model=BusSearchResponse)
async def search_buses(
    from_district: str = Query(..., description="Departure district"),
    to_district: str = Query(..., description="Destination district"),
    provider: Optional[str] = Query(None, description="Filter by provider"),
    bus_service: BusService = Depends(get_bus_service)
):
    """
    Search for available bus routes between two districts.
    
    - **from_district**: Departure district name
    - **to_district**: Destination district name
    - **provider**: Optional provider name filter
    """
    try:
        routes = await bus_service.search_buses(from_district, to_district, provider)
        return BusSearchResponse(
            routes=routes,
            total_results=len(routes)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error searching buses: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while searching for buses"
        )


@router.get("/buses/providers", response_model=BusProvidersListResponse)
async def get_providers(
    district: Optional[str] = Query(None, description="Filter by district"),
    bus_service: BusService = Depends(get_bus_service)
):
    """
    Get list of all bus providers.
    
    - **district**: Optional district filter to show only providers serving that district
    """
    try:
        providers = bus_service.get_all_providers(district)
        return BusProvidersListResponse(
            providers=providers,
            total_providers=len(providers)
        )
    except Exception as e:
        logger.error(f"Error getting providers: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching providers"
        )


@router.get("/buses/providers/{provider_name}", response_model=BusProviderResponse)
async def get_provider_details(
    provider_name: str,
    bus_service: BusService = Depends(get_bus_service)
):
    """
    Get detailed information about a specific bus provider.
    
    - **provider_name**: Name of the bus provider
    """
    try:
        provider = await bus_service.get_provider_details(provider_name)
        if not provider:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Provider '{provider_name}' not found"
            )
        return provider
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting provider details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching provider details"
        )
