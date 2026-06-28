from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.chat import router as chat_router
from routes.thread import router as thread_router
from routes.auth import router as auth_router
from routes.memory import router as memory_router
from routes.document import router as document_router
# from routes.voice import router as voice_router
from routes.export import router as export_router
from routes.export_docx import router as export_docx_router

app = FastAPI(
    title="AI Chat App"
)

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Routers
# =========================

app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(thread_router)
app.include_router(memory_router)
app.include_router(document_router)
# app.include_router(voice_router)
app.include_router(export_router)
app.include_router(export_docx_router)

# =========================
# Health Routes
# =========================

@app.get("/")
async def root():
    return {
        "message": "Backend Running"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }