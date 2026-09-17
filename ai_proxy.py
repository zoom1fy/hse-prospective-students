from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import httpx

app = FastAPI()
OLLAMA_URL = "https://ai.thebigcumzone.mom/api/generate"
SECRET_MODEL = "abit"
@app.post("/chat")
async def proxy_chat(data: dict):
    user_text = data.get("message", "")
    
    async def stream_ollama():
        async with httpx.AsyncClient(timeout=300.0) as client:
            async with client.stream(
                "POST", 
                OLLAMA_URL, 
                json={"model": SECRET_MODEL, "prompt": user_text, "stream": True}
            ) as res:
                async for chunk in res.aiter_bytes():
                    yield chunk

    return StreamingResponse(stream_ollama(), media_type="application/x-ndjson")