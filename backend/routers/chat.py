from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import anthropic
import json
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]


@router.post("/chat")
async def chat(payload: ChatRequest):
    messages = [{"role": m.role, "content": m.content} for m in payload.messages]

    def stream_response():
        with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system="You are ChatWave, a friendly and intelligent AI assistant. Be helpful, concise, and clear.",
            messages=messages,
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {json.dumps({'token': text})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(stream_response(), media_type="text/event-stream")
