# 🌊 ChatWave

> A real-time AI chat application built with **Next.js**, **FastAPI**, and **Claude AI** — featuring live token-by-token streaming via Server-Sent Events.


## ✨ What is ChatWave?

ChatWave is a full-stack AI chatbot starter application that demonstrates how to build a production-style conversational AI interface from scratch. It connects a **React/Next.js frontend** to a **Python FastAPI backend**, which calls the **Anthropic Claude API** and streams responses back to the browser in real time — word by word, just like ChatGPT.

### Key Highlights

- ⚡ **Real-time streaming** — responses appear token-by-token using Server-Sent Events (SSE)
- 🧠 **Multi-turn conversations** — full message history is sent on every request so Claude remembers context
- 💬 **Markdown rendering** — code blocks, bold text, lists, and tables render beautifully
- 🎨 **Clean UI** — message bubbles, typing indicator, auto-scroll, and responsive design
- 🔌 **Simple architecture** — easy to understand, extend, and build upon

---

## 📸 Preview

```
┌─────────────────────────────────────────┐
│  🌊 ChatWave                            │
├─────────────────────────────────────────┤
│                                         │
│  👤  What is recursion?                 │
│                                         │
│  🌊  Recursion is when a function       │
│      calls itself to solve a smaller    │
│      version of the same problem...     │
│      ▌ (streaming live)                 │
│                                         │
├─────────────────────────────────────────┤
│  [ Message ChatWave...          ] Send  │
└─────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend Framework | Next.js (React) | 14.2.5 |
| Language (Frontend) | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4.x |
| Markdown Rendering | react-markdown + remark-gfm | 9.x |
| Backend Framework | FastAPI | Latest |
| Language (Backend) | Python | 3.10+ |
| ASGI Server | Uvicorn | Latest |
| AI Model | Anthropic Claude (claude-sonnet-4) | — |
| AI SDK | Anthropic Python SDK | Latest |
| Streaming Protocol | Server-Sent Events (SSE) | — |
| Secret Management | python-dotenv | Latest |

---

## 📁 Project Structure

```
chatwave/
│
├── backend/                        ← Python FastAPI server
│   ├── main.py                     ← App entry point, CORS config
│   ├── routers/
│   │   └── chat.py                 ← POST /api/chat — SSE streaming endpoint
│   ├── .env                        ← Your Anthropic API key (never commit this!)
│   └── requirements.txt            ← Python dependencies
│
└── frontend/                       ← Next.js React app
    ├── app/
    │   ├── layout.tsx              ← Root layout
    │   ├── page.tsx                ← Redirect to /chat
    │   ├── globals.css             ← Global styles
    │   └── chat/
    │       └── page.tsx            ← Main chat page (state, streaming logic)
    ├── components/
    │   ├── Header.tsx              ← Top navigation bar
    │   ├── InputBar.tsx            ← Message input + send button
    │   └── MessageBubble.tsx       ← Individual chat message with Markdown
    ├── package.json
    └── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- **Node.js** v18 or higher → [nodejs.org](https://nodejs.org)
- **Python** 3.10 or higher → [python.org](https://python.org)
- An **Anthropic API key** → [console.anthropic.com](https://console.anthropic.com)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chatwave.git
cd chatwave
```

---

### 2. Set Up the Backend

```bash
cd backend
```

Create and activate a virtual environment:

```bash
# macOS / Linux
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Add your Anthropic API key to the `.env` file:

```bash
# Open .env and replace the placeholder
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
```

> 💡 Get your API key from [console.anthropic.com](https://console.anthropic.com). Never commit your `.env` file to GitHub.

Start the backend server:

```bash
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

---

### 3. Set Up the Frontend

Open a **new terminal** and navigate to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
▲ Next.js 14.2.5
- Local: http://localhost:3000
```

---

### 4. Open in Browser

Visit **[http://localhost:3000](http://localhost:3000)** and start chatting! 🎉

---

## ⚙️ How It Works

### Request Flow

```
User types message
        │
        ▼
Next.js (frontend)
  POST /api/chat
  body: { messages: [...] }
        │
        ▼
FastAPI (backend)
  Receives message history
  Calls Anthropic Claude API
  with stream=True
        │
        ▼
Claude AI generates tokens
        │
        ▼
FastAPI yields SSE events:
  data: {"token": "Hello"}
  data: {"token": " there"}
  data: [DONE]
        │
        ▼
Browser reads stream
  Appends each token live
  to the message bubble
```

### Key Code — SSE Streaming (backend)

```python
# backend/routers/chat.py

@router.post("/chat")
async def chat(payload: ChatRequest):
    messages = [{"role": m.role, "content": m.content} for m in payload.messages]

    def stream_response():
        with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system="You are ChatWave, a friendly and intelligent AI assistant.",
            messages=messages,
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {json.dumps({'token': text})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(stream_response(), media_type="text/event-stream")
```

### Key Code — Reading the Stream (frontend)

```typescript
// frontend/app/chat/page.tsx

const reader = res.body!.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  const lines = decoder.decode(value).split('\n')
  for (const line of lines) {
    if (!line.startsWith('data: ')) continue
    const data = line.slice(6)
    if (data === '[DONE]') break
    const { token } = JSON.parse(data)
    // Append token to message bubble live
    setMessages(prev => {
      const updated = [...prev]
      updated[updated.length - 1].content += token
      return updated
    })
  }
}
```

---

## 🔑 Environment Variables

| Variable | Description | Where to get it |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | [console.anthropic.com](https://console.anthropic.com) |

Create a `.env` file inside the `backend/` folder:

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 🧩 API Reference

### `POST /api/chat`

Sends a conversation and streams the AI response back.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "What is Python?" },
    { "role": "assistant", "content": "Python is a programming language..." },
    { "role": "user", "content": "Give me an example" }
  ]
}
```

**Response:** `text/event-stream`
```
data: {"token": "Here"}
data: {"token": " is"}
data: {"token": " a"}
data: {"token": " simple"}
data: {"token": " example"}
data: [DONE]
```

---

## 🔮 Future Enhancements

This is the **starter version** of ChatWave. Planned upgrades include:

- 🔐 **User Authentication** — register/login with JWT and bcrypt
- 💾 **Chat History** — save and reload conversations from a database
- 🎤 **Voice Input** — speak instead of type using Web Speech API
- 📁 **File Upload** — send PDFs and images to Claude for analysis
- 🎭 **AI Personas** — switch between different bot personalities
- 🌙 **Dark Mode** — light and dark theme toggle
- 🚀 **Deployment** — host on Vercel (frontend) + Railway (backend)

---

## 🐛 Troubleshooting

**Backend won't start:**
- Make sure your virtual environment is activated
- Check that `ANTHROPIC_API_KEY` is correctly set in `.env`
- Ensure port 8000 is not in use

**Frontend can't connect to backend:**
- Confirm the backend is running on `http://localhost:8000`
- Check that CORS is configured for `http://localhost:3000` in `main.py`

**Streaming not working:**
- Make sure you are using a Chromium-based browser (Chrome, Edge, Brave)
- Check the browser console for any fetch or network errors

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Anthropic](https://anthropic.com) for the Claude AI API
- [Vercel](https://vercel.com) for Next.js
- [Sebastián Ramírez](https://github.com/tiangolo) for FastAPI
- [Tailwind Labs](https://tailwindlabs.com) for Tailwind CSS

---

<p align="center">Built with ❤️ using Next.js · FastAPI · Claude AI</p>
