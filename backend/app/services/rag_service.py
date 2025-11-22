"""
RAG Service for Bus Ticket Booking Chatbot.
Integrates LangChain v1.0, ChromaDB (with local embeddings), and Gemini API.
"""
from typing import Dict, Any
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from langchain.tools import tool
from langchain_core.documents import Document

from app.core.config import settings
from app.core.logging import logger

class RAGService:
    """Service for Retrieval-Augmented Generation using LangChain v1.0."""
    
    def __init__(self):
        """Initialize the RAG service components."""
        self.embeddings = self._initialize_embeddings()
        self.vector_store = self._initialize_vector_store()
        self.llm = self._initialize_llm()
        self.agent = self._create_rag_agent()
        logger.info("RAG Service initialized successfully with LangChain v1.0")

    def _initialize_embeddings(self) -> HuggingFaceEmbeddings:
        """Initialize local HuggingFace embeddings."""
        logger.info("Initializing HuggingFace embeddings (all-MiniLM-L6-v2)...")
        return HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )

    def _initialize_vector_store(self) -> Chroma:
        """Initialize ChromaDB vector store."""
        store = Chroma(
            collection_name="bus_routes_knowledge",
            embedding_function=self.embeddings,
            persist_directory=settings.CHROMA_PERSIST_DIR
        )
        # Debug: Check what's in the store
        try:
            sample = store.get(limit=1)
            if sample and sample['ids']:
                logger.info(f"DEBUG: Vector Store loaded. Sample Doc ID: {sample['ids'][0]}")
                logger.info(f"DEBUG: Sample Metadata: {sample['metadatas'][0]}")
            else:
                logger.warning("DEBUG: Vector Store is empty!")
        except Exception as e:
            logger.error(f"DEBUG: Error checking vector store: {e}")
            
        return store

    def _initialize_llm(self) -> ChatGoogleGenerativeAI:
        """Initialize Gemini Chat Model."""
        return ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.3, # Low temperature for factual responses
            convert_system_message_to_human=True
        )


    def _create_retrieval_tool(self):
        """Create the retrieval tool for the agent."""
        vector_store = self.vector_store
        
        @tool(response_format="content_and_artifact")
        def retrieve_bus_info(query: str):
            """Retrieve information about bus routes, providers, and districts to help answer user questions."""
            retrieved_docs = vector_store.similarity_search(query, k=4)
            serialized = "\n\n".join(
                f"Source: {doc.metadata}\nContent: {doc.page_content}"
                for doc in retrieved_docs
            )
            return serialized, retrieved_docs
        
        return retrieve_bus_info

    def _create_rag_agent(self):
        """Create the RAG agent using LangChain v1.0 create_agent."""
        retrieval_tool = self._create_retrieval_tool()
        
        system_prompt = (
            "You are a helpful and knowledgeable Bus Ticket Booking Assistant for Bangladesh. "
            "You have access to a tool that retrieves information about bus routes, providers, and districts. "
            "Use this tool to answer questions accurately. "
            "Always provide clear, concise, and factual information. "
            "If you don't know the answer based on the retrieved information, say that you don't have that information. "
            "Do not make up answers. "
            "Prices are in BDT (Bangladeshi Taka). "
            "When mentioning bus routes, always include the provider name, from/to districts, and estimated fare if available."
        )

        agent = create_agent(
            self.llm,
            tools=[retrieval_tool],
            system_prompt=system_prompt
        )
        
        return agent

    async def get_answer(self, query: str) -> Dict[str, Any]:
        """
        Process a query and return the answer with sources.
        
        Args:
            query: User's question
            
        Returns:
            Dict containing 'answer' and 'sources'
        """
        logger.info(f"Processing RAG query: {query}")
        
        try:
            # Invoke the agent
            response = await self.agent.ainvoke({
                "messages": [{"role": "user", "content": query}]
            })
            
            # Extract the last message (AI response)
            messages = response["messages"]
            last_message = messages[-1]
            answer = last_message.content
            
            # Extract sources from context if available
            sources = []
            if "context" in response:
                context_docs = response["context"]
                seen_sources = set()
                
                for doc in context_docs:
                    metadata = doc.metadata
                    source_type = metadata.get("type", "unknown")
                    
                    if source_type == "route":
                        source_id = f"{metadata.get('provider')} ({metadata.get('from')} to {metadata.get('to')})"
                    elif source_type == "bus_provider":
                        source_id = f"{metadata.get('provider')} Info"
                    elif source_type == "district":
                        source_id = f"{metadata.get('district')} District Info"
                    else:
                        source_id = "General Info"
                    
                    if source_id not in seen_sources:
                        sources.append(source_id)
                        seen_sources.add(source_id)
            
            return {
                "answer": answer,
                "sources": sources
            }
            
        except Exception as e:
            logger.error(f"Error generating RAG response: {str(e)}")
            return {
                "answer": "I apologize, but I encountered an error while processing your request. Please try again later.",
                "sources": []
            }

# Global instance
rag_service = None

def get_rag_service() -> RAGService:
    """Get or create the global RAG service instance."""
    global rag_service
    if rag_service is None:
        rag_service = RAGService()
    return rag_service

