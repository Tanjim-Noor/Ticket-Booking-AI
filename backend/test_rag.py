import asyncio
import os
import sys

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.services.rag_service import get_rag_service

async def test_rag():
    print("Initializing RAG Service...")
    rag = get_rag_service()
    
    query = "Are there any buses from Dhaka to Rajshahi under 1000 taka?"
    print(f"\nTesting Query: {query}")
    
    result = await rag.get_answer(query)
    
    print("\n--- Answer ---")
    print(result["answer"])
    
    print("\n--- Sources ---")
    for source in result["sources"]:
        print(f"- {source}")

if __name__ == "__main__":
    asyncio.run(test_rag())
