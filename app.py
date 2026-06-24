"""
app.py — Luna AI Girlfriend Chatbot — FastAPI Backend

Endpoints:
  POST  /chat        Main chat endpoint
  GET   /state       Get current session state
  POST  /reset       Reset session data
  POST  /gift        Send a gift
  GET   /health      Health check
"""

import os
import json
import uuid
import random
import asyncio
import re
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx

from brain import (
    Brain, default_state, update_emos, get_top_emo,
    get_affection, get_affection_progress, add_xp,
    check_streak, check_achievements, add_memory,
    MAX_XP, AFF_LEVELS, MODS, pick, R,
    firewall_check,
)

# ─── App Setup ──────────────────────────────────────────────────────

app = FastAPI(title="Luna Chatbot", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Session Store ──────────────────────────────────────────────────

# In-memory session store. For production, replace with Redis/DB.
_sessions: dict[str, dict] = {}

GROQ_EP = "https://api.groq.com/openai/v1/chat/completions"
MAX_HIST = 24


def get_or_create_session(session_id: Optional[str] = None) -> tuple[str, dict]:
    """Get existing session or create a new one."""
    if session_id and session_id in _sessions:
        return session_id, _sessions[session_id]
    sid = session_id or uuid.uuid4().hex[:12]
    _sessions[sid] = default_state()
    return sid, _sessions[sid]


# ─── Pydantic Models ────────────────────────────────────────────────

class SettingsModel(BaseModel):
    personality: str = "sweet"
    girl_name: str = "Luna"
    pet_name: str = ""
    user_gender: str = "boyfriend"
    custom_persona: str = ""
    connected: bool = False
    api_key: str = ""
    model: str = "llama-3.3-70b-versatile"
    avatar_type: str = "emoji"
    avatar_data: str = "👧"
    theme: str = "pink"
    particles: str = "hearts"
    temperature: float = 0.85


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
    settings: Optional[SettingsModel] = None


class ChatResponse(BaseModel):
    session_id: str
    response: str
    state: dict
    new_achievements: list = []


class GiftRequest(BaseModel):
    session_id: Optional[str] = None
    emoji: str
    name: str
    xp: int = 3


class GiftResponse(BaseModel):
    session_id: str
    response: str
    state: dict
    new_achievements: list = []


class StateResponse(BaseModel):
    session_id: str
    state: dict


# ─── Helpers ────────────────────────────────────────────────────────

def _apply_settings(state: dict, settings: Optional[SettingsModel]):
    """Apply request settings to the session state."""
    if not settings:
        return
    state["personality"] = settings.personality
    state["girl_name"] = settings.girl_name
    state["pet_name"] = settings.pet_name
    state["user_gender"] = settings.user_gender
    state["custom_persona"] = settings.custom_persona
    state["avatar_type"] = settings.avatar_type
    state["avatar_data"] = settings.avatar_data
    state["theme"] = settings.theme
    state["particles"] = settings.particles
    state["api_key"] = settings.api_key
    state["model"] = settings.model
    state["connected"] = settings.connected
    state["temperature"] = settings.temperature


def _build_client_state(state: dict) -> dict:
    """Build a client-facing state snapshot (no history)."""
    return {
        "emos": state.get("emos", []),
        "aff_xp": state.get("aff_xp", 0),
        "affection": get_affection(state.get("aff_xp", 0)),
        "affection_progress": get_affection_progress(state.get("aff_xp", 0)),
        "total_msgs": state.get("total_msgs", 0),
        "memory": state.get("memory", []),
        "streak_days": state.get("streak_days", 0),
        "longest_streak": state.get("longest_streak", 0),
        "gifts_sent": state.get("gifts_sent", 0),
        "achievements": state.get("achievements", []),
        "love_count": state.get("love_count", 0),
        "sorry_count": state.get("sorry_count", 0),
        "personality": state.get("personality", "sweet"),
        "girl_name": state.get("girl_name", "Luna"),
        "pet_name": state.get("pet_name", ""),
        "user_gender": state.get("user_gender", "boyfriend"),
        "custom_persona": state.get("custom_persona", ""),
        "avatar_type": state.get("avatar_type", "emoji"),
        "avatar_data": state.get("avatar_data", "👧"),
        "theme": state.get("theme", "pink"),
        "particles": state.get("particles", "hearts"),
        "connected": state.get("connected", False),
        "model": state.get("model", "llama-3.3-70b-versatile"),
        "temperature": state.get("temperature", 0.85),
    }


# ─── Groq API ───────────────────────────────────────────────────────

async def call_groq(text: str, state: dict, ctx: dict, api_key: str, model: str) -> str:
    """Call the Groq API for AI-powered response."""
    sys_prompt = Brain.get_sys_prompt(state, ctx)
    history = state.get("history", [])[-MAX_HIST:]
    messages = [
        {"role": "system", "content": sys_prompt},
        *history,
        {"role": "user", "content": text},
    ]
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            GROQ_EP,
            json={
                "model": model,
                "messages": messages,
                "temperature": state.get("temperature", 0.85),
                "max_tokens": 250,
                "top_p": 0.95,
            },
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
        )
        if resp.status_code != 200:
            err = resp.json()
            raise RuntimeError(err.get("error", {}).get("message", f"HTTP {resp.status_code}"))
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()


# ─── XP Calculation ─────────────────────────────────────────────────

def _calc_xp(intent: str) -> int:
    """Calculate XP gain based on intent."""
    if intent in ("love", "miss", "compliment", "happy"):
        return 8
    elif intent in ("sorry", "sad", "stressed"):
        return 10
    elif intent in ("joke", "tease", "playful"):
        return 5
    elif intent in ("greeting", "thanks"):
        return 4
    elif intent == "goodbye":
        return 1
    return 3


# ─── Endpoints ──────────────────────────────────────────────────────

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """Main chat endpoint — process a message and return a response."""
    sid, state = get_or_create_session(req.session_id)
    _apply_settings(state, req.settings)

    raw = req.message.strip()
    if not raw:
        raise HTTPException(400, "Message cannot be empty")

    # Streak check
    streak_result = check_streak(state)

    # Track totals
    if re.search(r"love|like", raw, re.I):
        state["love_count"] = state.get("love_count", 0) + 1
    if re.search(r"sorry|apologize", raw, re.I):
        state["sorry_count"] = state.get("sorry_count", 0) + 1

    # ─── FIREWALL CHECK ──────────────────────────────────────────
    blocked, fw_cat, fw_reply = firewall_check(raw)
    if blocked:
        # Still track the message
        state["total_msgs"] = state.get("total_msgs", 0) + 1
        history = state.setdefault("history", [])
        history.append({"role": "user", "content": raw})
        if len(history) > MAX_HIST * 2:
            state["history"] = history[-MAX_HIST * 2:]
        resp_data = ChatResponse(
            session_id=sid,
            response=fw_reply,
            state=_build_client_state(state),
            new_achievements=[],
        )
        return resp_data

    # Brain processing
    text = Brain.optimize(raw)
    intent = Brain.detect_intent(raw)
    analysis = Brain.analyze(text, intent)
    plan = Brain.plan(intent, analysis, state)

    # Memory
    add_memory(state, raw)

    # Generate response
    used_ai = False
    response_text = ""

    api_key = state.get("api_key", "") or (req.settings.api_key if req.settings else "")
    model = state.get("model", "llama-3.3-70b-versatile") or (req.settings.model if req.settings else "llama-3.3-70b-versatile")
    is_connected = state.get("connected", False) or (req.settings.connected if req.settings else False)

    if is_connected and api_key:
        try:
            response_text = await call_groq(text, state, analysis, api_key, model)
            used_ai = True
        except Exception as e:
            response_text = Brain.build_local_response(text, analysis, intent)
            response_text = Brain.modulate_response(response_text, intent, state)
    else:
        response_text = Brain.build_local_response(text, analysis, intent)
        response_text = Brain.modulate_response(response_text, intent, state)

    # Update history
    history = state.setdefault("history", [])
    history.append({"role": "user", "content": text})
    history.append({"role": "assistant", "content": response_text})
    if len(history) > MAX_HIST * 2:
        state["history"] = history[-MAX_HIST * 2:]

    # Update emotions
    state["emos"] = update_emos(state, intent)

    # XP
    xp_gain = _calc_xp(intent)
    add_xp(state, xp_gain)
    state["total_msgs"] = state.get("total_msgs", 0) + 1

    # Check achievements
    new_achs = check_achievements(state)

    # Build response data
    resp_data = ChatResponse(
        session_id=sid,
        response=response_text,
        state=_build_client_state(state),
        new_achievements=new_achs,
    )

    return resp_data


@app.post("/gift", response_model=GiftResponse)
async def send_gift(req: GiftRequest):
    """Send a gift and get a reaction."""
    sid, state = get_or_create_session(req.session_id)

    state["gifts_sent"] = state.get("gifts_sent", 0) + 1
    add_xp(state, req.xp)

    # Gift reactions
    gift_msgs = {
        "🌸": [
            f"Aww a flower! 🌸 You're so sweet! +{req.xp} XP 💕",
            f"I love flowers! Thank you baby! 💕 +{req.xp} XP",
        ],
        "🍫": [
            f"Chocolate! 🍫 You know the way to my heart! +{req.xp} XP 💕",
            f"Mmm chocolate~ I'll share with you! +{req.xp} XP ❤️",
        ],
        "🧸": [
            f"A teddy bear! 🧸 He looks just like you! +{req.xp} XP 🥰",
            f"So cute! I'll name him after you! +{req.xp} XP 💕",
        ],
        "💍": [
            f"A ring! 💍 Is this what I think it means?! +{req.xp} XP 🥺💕",
            f"OH MY— it's beautiful! +{req.xp} XP ❤️😍",
        ],
        "💐": [
            f"A whole bouquet! 💐 You're spoiling me! +{req.xp} XP 🥰",
            f"They're gorgeous! Just like us! +{req.xp} XP 💕",
        ],
        "🎂": [
            f"Cupcake! 🎂 So tasty! Want a bite? +{req.xp} XP 😊💕",
        ],
    }
    reply = pick(gift_msgs.get(req.emoji, [f"You're so thoughtful! +{req.xp} XP 💕"]))

    # Check achievements
    new_achs = check_achievements(state)

    return GiftResponse(
        session_id=sid,
        response=reply,
        state=_build_client_state(state),
        new_achievements=new_achs,
    )


@app.get("/state", response_model=StateResponse)
async def get_state(session_id: Optional[str] = None):
    """Get the current state for a session."""
    if not session_id or session_id not in _sessions:
        # Return a fresh default state
        return StateResponse(
            session_id=session_id or "",
            state=_build_client_state(default_state()),
        )
    state = _sessions[session_id]
    return StateResponse(
        session_id=session_id,
        state=_build_client_state(state),
    )


@app.post("/reset")
async def reset_session(session_id: Optional[str] = None):
    """Reset a session's data."""
    if session_id and session_id in _sessions:
        _sessions[session_id] = default_state()
    else:
        sid = session_id or uuid.uuid4().hex[:12]
        _sessions[sid] = default_state()
        session_id = sid
    return {
        "session_id": session_id,
        "state": _build_client_state(_sessions[session_id]),
        "message": "All data has been reset 💔",
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "Luna Chatbot",
        "version": "3.0.0",
        "sessions_active": len(_sessions),
    }


# ─── Serve Static Frontend ─────────────────────────────────────────

from fastapi.responses import FileResponse


BASE = os.path.dirname(os.path.abspath(__file__))


@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(BASE, "index.html"))


@app.get("/style.css")
async def serve_css():
    return FileResponse(os.path.join(BASE, "style.css"), media_type="text/css")


@app.get("/script.js")
async def serve_js():
    return FileResponse(os.path.join(BASE, "script.js"), media_type="application/javascript")


# Mount static files directory (if we have one)
STATIC_DIR = os.path.join(BASE, "static")
if os.path.isdir(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# ─── Entry Point ────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"💕 Luna Chatbot running at http://{host}:{port}")
    uvicorn.run("app:app", host=host, port=port, reload=True)
