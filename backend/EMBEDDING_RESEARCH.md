# Embedding Model Research Summary

## Selected Model: **sentence-transformers/all-MiniLM-L6-v2**

### Why This Model?

**Best for our bus ticket booking RAG use case:**
- ✅ **Fast & Lightweight**: Only 22M parameters, perfect for production
- ✅ **Optimized for Short Texts**: Ideal for bus routes, district names, provider info
- ✅ **Offline & Free**: No API limits, works locally, no external dependencies
- ✅ **High Quality**: Trained on 1B+ sentence pairs, excellent semantic search
- ✅ **Normalized Embeddings**: Better similarity matching for RAG retrieval

### Alternatives Considered:

1. **Google Gemini Embeddings** ❌
   - Hit API quota limits
   - Requires internet connection
   - Rate limited on free tier

2. **all-mpnet-base-v2** ✅ (Alternative option)
   - More powerful (110M params)
   - Higher quality but slower
   - Good if speed isn't critical

3. **Ollama (nomic-embed-text)** ✅ (Alternative option)
   - Requires separate Ollama server
   - Good for advanced use cases
   - More setup complexity

### Performance:
- ✅ Successfully ingested 88 documents into ChromaDB
- ✅ Query test: "buses from Dhaka to Rajshahi" → Returns relevant routes instantly
- ✅ Embedding dimension: 384 (efficient for storage)
- ✅ Processing speed: ~3 seconds for 88 documents

### References:
- HuggingFace Model: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
- LangChain Integration: langchain-huggingface
- Research: MTEB Leaderboard, 2024 embedding benchmarks
