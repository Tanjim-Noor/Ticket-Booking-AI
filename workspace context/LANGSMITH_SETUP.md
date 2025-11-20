# LangSmith Monitoring Setup

This guide explains how to configure LangSmith for monitoring and tracing your LangChain RAG application.

## What is LangSmith?

LangSmith is LangChain's observability platform that provides:
- **Tracing**: Track every step of your agent's execution
- **Debugging**: Inspect inputs, outputs, and intermediate steps
- **Monitoring**: View performance metrics and identify bottlenecks
- **Testing**: Evaluate agent performance over time

## Setup Instructions

### 1. Get Your LangSmith API Key

1. Visit [smith.langchain.com](https://smith.langchain.com)
2. Sign up or log in
3. Navigate to **Settings** → **API Keys**
4. Click **Create API Key**
5. Copy your API key (starts with `lsv2_...`)

### 2. Configure Environment Variables

**Note:** The LangSmith configuration fields have already been added to `app/core/config.py`. You just need to set the values in your `.env` file.

Add the following to your `backend/.env` file:

```bash
# LangSmith Configuration
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=lsv2_your_api_key_here
LANGSMITH_PROJECT=bus-ticket-booking-ai
```

**Environment Variables Explained:**
- `LANGSMITH_TRACING=true`: Enables automatic tracing
- `LANGSMITH_API_KEY`: Your LangSmith API key for authentication
- `LANGSMITH_PROJECT`: Project name to organize traces (optional)

### 3. Verify Configuration

Once configured, LangSmith will automatically trace:
- All agent invocations
- Tool calls (e.g., `retrieve_bus_info`)
- LLM requests and responses
- Retrieval queries to ChromaDB

No code changes required! Tracing happens automatically when environment variables are set.

### 4. View Traces in LangSmith GUI

1. Go to [smith.langchain.com](https://smith.langchain.com)
2. Select your project: **bus-ticket-booking-ai**
3. View traces in real-time as users interact with the chatbot

## LangSmith GUI Features

### Traces Dashboard
- **Timeline View**: See the execution flow of your agent
- **Input/Output**: Inspect what the user asked and what the agent responded
- **Latency**: Identify slow components
- **Token Usage**: Monitor LLM API costs

### Filtering & Search
- Filter by status (success, error)
- Search by user query
- Filter by tags or metadata

### Debugging
- Click on any trace to see detailed step-by-step execution
- View retrieved documents from ChromaDB
- Inspect tool calls and their results
- See LLM prompts and completions

## Advanced: Custom Metadata & Tags

You can add custom metadata to specific requests for better organization:

```python
response = await self.agent.ainvoke(
    {"messages": [{"role": "user", "content": query}]},
    config={
        "tags": ["production", "chat-endpoint"],
        "metadata": {
            "user_id": "user_123",
            "session_id": "session_456"
        }
    }
)
```

## Troubleshooting

**Traces not appearing?**
1. Verify `LANGSMITH_TRACING=true` is set
2. Check your API key is correct
3. Ensure the backend server restarted after adding env vars
4. Check logs for any LangSmith connection errors

**Want to disable tracing temporarily?**
Set `LANGSMITH_TRACING=false` or remove the environment variable.

## Resources

- [LangSmith Documentation](https://docs.smith.langchain.com)
- [LangSmith Python SDK](https://github.com/langchain-ai/langsmith-sdk)
- [Observability Guide](https://docs.langchain.com/oss/python/langchain/observability)
