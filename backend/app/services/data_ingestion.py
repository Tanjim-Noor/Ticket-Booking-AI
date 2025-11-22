"""Data ingestion service for populating ChromaDB with bus route and provider information."""
import json
from pathlib import Path
from typing import List, Dict
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app.core.config import settings
from app.core.logging import logger


class DataIngestionService:
    """Service for ingesting data into ChromaDB vector store."""
    
    def __init__(self):
        """Initialize the data ingestion service."""
        # Initialize HuggingFace embeddings (local, free, no API limits)
        # all-MiniLM-L6-v2: Fast, efficient, perfect for short texts like bus routes
        logger.info("Initializing HuggingFace embeddings model (all-MiniLM-L6-v2)...")
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'},  # Use CPU (or 'cuda' for GPU)
            encode_kwargs={'normalize_embeddings': True}  # Normalize for better similarity search
        )
        
        # Initialize Chroma vector store
        self.vector_store = Chroma(
            collection_name="bus_routes_knowledge",
            embedding_function=self.embeddings,
            persist_directory=settings.CHROMA_PERSIST_DIR
        )
        
        logger.info("Data ingestion service initialized with local embeddings")
    
    def load_json_data(self) -> Dict:
        """Load data from context/data.json file."""
        # Go up from backend/app/services to project root
        data_path = Path(__file__).parent.parent.parent.parent / "context" / "data.json"
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        logger.info("Loaded JSON data from context/data.json")
        return data
    
    def load_provider_documents(self) -> Dict[str, str]:
        """Load bus provider documents from context/attachment folder."""
        # Go up from backend/app/services to project root
        attachment_path = Path(__file__).parent.parent.parent.parent / "context" / "attachment"
        provider_docs = {}
        
        for doc_file in attachment_path.glob("*.txt"):
            provider_name = doc_file.stem
            with open(doc_file, 'r', encoding='utf-8') as f:
                content = f.read()
            provider_docs[provider_name] = content
            logger.info(f"Loaded document for provider: {provider_name}")
        
        return provider_docs
    
    def create_district_documents(self, data: Dict) -> List[Dict]:
        """Create documents for districts and dropping points."""
        documents = []
        doc_id = 1
        
        for district in data.get("districts", []):
            district_name = district["name"]
            dropping_points = district.get("dropping_points", [])
            
            # Create document for each district
            dropping_info = ", ".join([
                f"{dp['name']} (৳{dp['price']})" 
                for dp in dropping_points
            ])
            
            doc_text = f"""District: {district_name}
Dropping Points: {dropping_info}
Number of dropping points: {len(dropping_points)}
"""
            
            documents.append({
                "id": f"district_{doc_id}",
                "document": doc_text,
                "metadata": {
                    "type": "district",
                    "district": district_name,
                    "num_points": len(dropping_points)
                }
            })
            doc_id += 1
        
        logger.info(f"Created {len(documents)} district documents")
        return documents
    
    def create_bus_provider_documents(self, data: Dict, provider_docs: Dict[str, str]) -> List[Dict]:
        """Create documents for bus providers."""
        documents = []
        doc_id = 1
        
        for provider in data.get("bus_providers", []):
            provider_name = provider["name"]
            coverage = provider.get("coverage_districts", [])
            
            # Get provider document content if available
            provider_key = provider_name.lower()
            provider_content = provider_docs.get(provider_key, "")
            
            # Create comprehensive document
            doc_text = f"""Bus Provider: {provider_name}
Coverage Districts: {", ".join(coverage)}
Number of districts covered: {len(coverage)}

{provider_content}
"""
            
            documents.append({
                "id": f"provider_{doc_id}",
                "document": doc_text,
                "metadata": {
                    "type": "bus_provider",
                    "provider": provider_name,
                    "coverage": ", ".join(coverage),
                    "num_districts": len(coverage)
                }
            })
            doc_id += 1
        
        logger.info(f"Created {len(documents)} bus provider documents")
        return documents
    
    def create_route_documents(self, data: Dict) -> List[Dict]:
        """Create documents for possible routes between districts."""
        documents = []
        doc_id = 1
        
        bus_providers = data.get("bus_providers", [])
        districts = data.get("districts", [])
        district_dict = {d["name"]: d for d in districts}
        
        # Create route documents for each provider
        for provider in bus_providers:
            provider_name = provider["name"]
            coverage = provider.get("coverage_districts", [])
            
            # Create routes between all covered districts
            for from_district in coverage:
                for to_district in coverage:
                    if from_district != to_district:
                        # Get dropping point info for the DESTINATION district
                        to_info = district_dict.get(to_district, {}).get("dropping_points", [])
                        
                        if not to_info:
                            continue

                        # Format dropping points and prices
                        dropping_points_str = "\n".join([
                            f"- {dp['name']}: ৳{dp['price']}" 
                            for dp in to_info
                        ])
                        
                        prices = [dp["price"] for dp in to_info]
                        min_price = min(prices) if prices else 0
                        max_price = max(prices) if prices else 0
                        
                        doc_text = f"""Route: {from_district} to {to_district}
Bus Provider: {provider_name}
Ticket Prices (to {to_district}):
{dropping_points_str}

From District: {from_district}
To District: {to_district}
""" 
                        
                        documents.append({
                            "id": f"route_{doc_id}",
                            "document": doc_text,
                            "metadata": {
                                "type": "route",
                                "provider": provider_name,
                                "from": from_district,
                                "to": to_district,
                                "min_price": min_price,
                                "max_price": max_price
                            }
                        })
                        doc_id += 1
        
        logger.info(f"Created {len(documents)} route documents")
        return documents
    
    def ingest_all_data(self):
        """Ingest all data into ChromaDB."""
        logger.info("Starting data ingestion...")
        
        # Load data
        json_data = self.load_json_data()
        provider_docs = self.load_provider_documents()
        
        # Create all documents
        district_docs = self.create_district_documents(json_data)
        provider_docs_list = self.create_bus_provider_documents(json_data, provider_docs)
        route_docs = self.create_route_documents(json_data)
        
        # Combine all documents
        all_documents = district_docs + provider_docs_list + route_docs
        
        # Convert to LangChain Document format
        langchain_docs = []
        for doc in all_documents:
            langchain_docs.append(
                Document(
                    page_content=doc["document"],
                    metadata=doc["metadata"]
                )
            )
            
        # Clear existing documents to ensure a fresh start
        try:
            existing_ids = self.vector_store.get()["ids"]
            if existing_ids:
                logger.info(f"Deleting {len(existing_ids)} existing documents...")
                self.vector_store.delete(ids=existing_ids)
                logger.info("Existing documents deleted.")
        except Exception as e:
            logger.warning(f"Could not clear existing documents: {e}")
        
        # Add to ChromaDB using LangChain's Chroma
        logger.info(f"Adding {len(langchain_docs)} documents to ChromaDB...")
        ids = [doc["id"] for doc in all_documents]
        self.vector_store.add_documents(documents=langchain_docs, ids=ids)
        
        logger.info(f"Successfully ingested {len(all_documents)} documents into ChromaDB")
        return len(all_documents)
    
    def query_knowledge_base(self, query: str, k: int = 5) -> List[Document]:
        """Query the knowledge base."""
        results = self.vector_store.similarity_search(query, k=k)
        return results
    
    def get_collection_count(self) -> int:
        """Get the number of documents in the collection."""
        # Get the underlying collection from Chroma
        return len(self.vector_store.get()['ids'])


# Standalone function to run ingestion
def run_data_ingestion():
    """Run the data ingestion process."""
    service = DataIngestionService()
    count = service.ingest_all_data()
    print(f"✅ Data ingestion complete! Ingested {count} documents.")
    print(f"📊 Total documents in collection: {service.get_collection_count()}")
    
    # Test with a sample query
    print("\n🔍 Testing with sample query: 'buses from Dhaka to Rajshahi'")
    results = service.query_knowledge_base("buses from Dhaka to Rajshahi")
    print(f"Found {len(results)} relevant documents:")
    for i, doc in enumerate(results[:3], 1):
        print(f"\n{i}. {doc.page_content[:150]}...")
        print(f"   Metadata: {doc.metadata}")
    
    return service


if __name__ == "__main__":
    run_data_ingestion()
