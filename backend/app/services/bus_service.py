"""Business logic for bus-related operations."""
from typing import List, Optional
import json
from pathlib import Path

from app.services.rag_service import get_rag_service
from app.schemas.bus import RouteResponse, BusProviderResponse
from app.core.logging import logger


class BusService:
    """Service for bus search and provider information."""
    
    def __init__(self):
        """Initialize bus service."""
        self.rag_service = get_rag_service()
        self._load_data()
    
    def _load_data(self):
        """Load bus data from context/data.json."""
        # Navigate to project root and load data
        project_root = Path(__file__).parent.parent.parent.parent
        data_path = project_root / "context" / "data.json"
        
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self.districts = {d["name"]: d for d in data["districts"]}
        self.providers = {p["name"]: p for p in data["bus_providers"]}
        logger.info(f"Loaded {len(self.districts)} districts and {len(self.providers)} providers")
    
    async def search_buses(
        self,
        from_district: str,
        to_district: str,
        provider: Optional[str] = None
    ) -> List[RouteResponse]:
        """
        Search for available bus routes.
        
        Args:
            from_district: Departure district
            to_district: Destination district
            provider: Optional provider filter
            
        Returns:
            List of available routes
        """
        # Validate districts
        if from_district not in self.districts:
            raise ValueError(f"Unknown departure district: {from_district}")
        if to_district not in self.districts:
            raise ValueError(f"Unknown destination district: {to_district}")
        
        # Build search query
        query = f"bus routes from {from_district} to {to_district}"
        if provider:
            query += f" with {provider}"
        
        # Use RAG to find relevant routes
        logger.info(f"Searching routes: {query}")
        result = await self.rag_service.get_answer(query)
        
        # Parse routes from ChromaDB (simplified - in production, query ChromaDB directly)
        routes = []
        for provider_name, provider_data in self.providers.items():
            if provider and provider.lower() != provider_name.lower():
                continue
            
            coverage = provider_data["coverage_districts"]
            if from_district in coverage and to_district in coverage:
                # Estimate fare based on distance (simplified)
                base_fare = 500
                routes.append(RouteResponse(
                    provider=provider_name,
                    from_district=from_district,
                    to_district=to_district,
                    estimated_fare=base_fare + (len(from_district) + len(to_district)) * 10,
                    description=f"{provider_name} operates on this route"
                ))
        
        return routes
    
    def get_all_providers(self, district: Optional[str] = None) -> List[BusProviderResponse]:
        """
        Get list of bus providers.
        
        Args:
            district: Optional district filter
            
        Returns:
            List of providers
        """
        providers_list = []
        
        for name, data in self.providers.items():
            if district and district not in data["coverage_districts"]:
                continue
            
            providers_list.append(BusProviderResponse(
                name=name,
                coverage_districts=data["coverage_districts"]
            ))
        
        return providers_list
    
    async def get_provider_details(self, provider_name: str) -> Optional[BusProviderResponse]:
        """
        Get detailed information about a specific provider.
        
        Args:
            provider_name: Provider name
            
        Returns:
            Provider details or None if not found
        """
        if provider_name not in self.providers:
            return None
        
        provider_data = self.providers[provider_name]
        
        # Use RAG to get additional details from attachment files
        query = f"Tell me about {provider_name} bus service, their privacy policy and contact information"
        result = await self.rag_service.get_answer(query)
        
        return BusProviderResponse(
            name=provider_name,
            coverage_districts=provider_data["coverage_districts"],
            details=result["answer"]
        )


# Global instance
_bus_service = None

def get_bus_service() -> BusService:
    """Get or create the global bus service instance."""
    global _bus_service
    if _bus_service is None:
        _bus_service = BusService()
    return _bus_service
