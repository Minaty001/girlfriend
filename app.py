"""
NEURAL CORE — FastAPI Backend Server
Handles chat processing, state management, and Groq AI integration
"""

import os
import random
import json
import httpx
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel

from brain import (
    Brain, MODS, R, EMOS, AFF_LEVELS,
    default_state, update_emos, add_xp, check_streak,
    check_achievements, add_memory, VERSION
)

# ─── App Setup ──────────────────────────────────────────────────
app = FastAPI(title="Neural Core API", version=VERSION)

# Global state (in-memory; replace with DB for production)
state = default_state()

# Groq API configuration
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.environ.get("GROQ_MODEL", "mixtral-8x7b-32768")

# ─── Models ─────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    mod: Optional[str] = "friendly"
    use_groq: Optional[bool] = False
    user_name: Optional[str] = "User"
    gender_mode: Optional[str] = "girlfriend"


class ChatResponse(BaseModel):
    response: str
    intent: str
    emotion: str
    emotion_emoji: str
    mod: str
    affection: int
    level: int
    xp: int
    achievements: list
    mode: str

class GiftRequest(BaseModel):
    gift_type: str
    message: Optional[str] = ""

class GiftResponse(BaseModel):
    response: str
    affection_gained: int
    new_affection: int
    special: bool

class StateResponse(BaseModel):
    mod: str
    emotion: str
    emotion_emoji: str
    affection: int
    level: int
    xp: int
    streak: int
    messages_count: int
    achievements: list
    uptime: str

class SettingsModel(BaseModel):
    mod: Optional[str] = None
    user_name: Optional[str] = None
    groq_key: Optional[str] = None
    groq_model: Optional[str] = None
    gender_mode: Optional[str] = None


# ─── Startup Time ──────────────────────────────────────────────
start_time = datetime.now()

# ─── Static Files ──────────────────────────────────────────────
# Serve specific static files and catch-all SPA fallback
@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("index.html", "r") as f:
        return f.read()

@app.get("/style.css", response_class=FileResponse)
async def read_style():
    return FileResponse("style.css", media_type="text/css")

@app.get("/script.js", response_class=FileResponse)
async def read_script():
    return FileResponse("script.js", media_type="text/javascript")

# ─── API Endpoints ─────────────────────────────────────────────

@app.get("/version")
async def get_version():
    return {"version": VERSION, "name": "Neural Core AI"}

@app.get("/health")
async def health():
    uptime = str(datetime.now() - start_time).split('.')[0]
    return {
        "status": "healthy",
        "version": VERSION,
        "uptime": uptime,
        "mod": state.get("mod", "friendly"),
        "mode": "groq" if GROQ_API_KEY else "local"
    }

@app.get("/state", response_model=StateResponse)
async def get_state():
    dominant_emo = max(state["emos"].items(), key=lambda x: x[1])[0]
    emo_data = next((e for e in EMOS if e["name"] == dominant_emo), EMOS[0])
    uptime = str(datetime.now() - start_time).split('.')[0]

    return StateResponse(
        mod=state.get("mod", "friendly"),
        emotion=dominant_emo,
        emotion_emoji=emo_data["emoji"],
        affection=state.get("affection", 0),
        level=state.get("level", 1),
        xp=state.get("xp", 0),
        streak=state.get("streak", 0),
        messages_count=state.get("messages_count", 0),
        achievements=state.get("achievements", []),
        uptime=uptime
    )

@app.post("/chat", response_model=ChatResponse)
async def process_chat(req: ChatRequest):
    global state

    text = Brain.optimize(req.message)
    if not text:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Firewall check
    violations = Brain.firewall_check(text)
    if violations:
        response_text = Brain.handle_firewall_violation(violations)
        dominant_emo = max(state["emos"].items(), key=lambda x: x[1])[0]
        emo_data = next((e for e in EMOS if e["name"] == dominant_emo), EMOS[0])
        return ChatResponse(
            response=response_text,
            intent="blocked",
            emotion=dominant_emo,
            emotion_emoji=emo_data["emoji"],
            mod=state.get("mod", "friendly"),
            affection=state.get("affection", 0),
            level=state.get("level", 1),
            xp=state.get("xp", 0),
            achievements=state.get("achievements", []),
            mode="local"
        )

    # Update state
    state["user_name"] = req.user_name or "User"
    state["mod"] = req.mod or state.get("mod", "friendly")
    if req.gender_mode:
        state["gender_mode"] = req.gender_mode
    state["messages_count"] += 1


    # Detect intent and analyze
    intent = Brain.detect_intent(text)
    analysis = Brain.analyze(text, intent)

    # Decide response strategy
    plan = Brain.plan(intent, analysis, state)

    # Generate response
    use_groq = req.use_groq and bool(GROQ_API_KEY)

    if use_groq:
        try:
            response_text = await call_groq(text, state)
            mode = "groq"
        except Exception as e:
            # Fallback to local on Groq error
            response_text = Brain.build_local_response(text, analysis, intent, state)
            response_text = Brain.modulate_response(response_text, intent, state)
            mode = f"local (groq error: {str(e)})"
    else:
        response_text = Brain.build_local_response(text, analysis, intent, state)
        response_text = Brain.modulate_response(response_text, intent, state)
        mode = "local"


    # Update affection (based on positive/negative intent)
    if intent in ("love", "affection", "compliment", "praise", "gift", "flirty"):
        state["affection"] = min(10000, state["affection"] + random.randint(3, 8))
    elif intent in ("angry", "insult"):
        state["affection"] = max(0, state["affection"] - random.randint(2, 5))
    else:
        state["affection"] += random.randint(1, 3)
        state["affection"] = min(10000, state["affection"])

    # Update emotions
    state = update_emos(state, intent)

    # Add XP
    state, leveled_up = add_xp(state)

    # Check streak
    state, streak_updated = check_streak(state)

    # Check achievements
    state, new_achievements = check_achievements(state)

    # Add memory
    state = add_memory(state, text, response_text)

    # Achievement announcement
    if new_achievements:
        achievement_names = {
            "first_conversation": "🎯 First Conversation — You had your first chat!",
            "chatty": "💬 Chatty — 100 messages exchanged!",
            "talkative": "🗣️ Talkative — 500 messages! We're practically best friends!",
            "loyal_visitor": "📅 Loyal Visitor — Visited 3 days in a row!",
            "dedicated": "🔥 Dedicated — A full week of visits!",
            "friend": "🤝 Friend — 100 affection points!",
            "close_friend": "💖 Close Friend — 1000 affection points!",
            "soulmate": "💞 Soulmate — 5000 affection points!",
            "level_5": "⭐ Level 5 — Reached level 5!",
            "level_10": "🌟 Level 10 — Reached level 10!"
        }
        achievement_msg = " " + " ".join(achievement_names.get(a, f"🏆 {a}") for a in new_achievements)
        response_text += achievement_msg

    if leveled_up:
        response_text += f" ⬆ Level up! You are now level {state['level']}!"

    dominant_emo = max(state["emos"].items(), key=lambda x: x[1])[0]
    emo_data = next((e for e in EMOS if e["name"] == dominant_emo), EMOS[0])

    return ChatResponse(
        response=response_text,
        intent=intent,
        emotion=dominant_emo,
        emotion_emoji=emo_data["emoji"],
        mod=state.get("mod", "friendly"),
        affection=state.get("affection", 0),
        level=state.get("level", 1),
        xp=state.get("xp", 0),
        achievements=state.get("achievements", []),
        mode=mode
    )

@app.post("/gift", response_model=GiftResponse)
async def give_gift(req: GiftRequest):
    global state

    gift_values = {
        "flower": (15, "🌸"),
        "heart": (25, "💖"),
        "ring": (50, "💍"),
        "chocolate": (20, "🍫"),
        "teddy": (30, "🧸"),
        "star": (40, "⭐"),
        "moon": (35, "🌙"),
        "crystal": (45, "💎"),
        "rose": (20, "🌹"),
        "letter": (25, "💌")
    }

    gt = req.gift_type.lower()
    if gt not in gift_values:
        gt = "flower"

    value, emoji = gift_values[gt]
    value += random.randint(-5, 5)

    state["affection"] = min(10000, state["affection"] + value)

    # Generate response
    gift_responses = R.get("gift", [])
    response_text = random.choice(gift_responses)
    response_text = f"{emoji} {response_text} (+{value} affection)"

    # Special gift handling
    special = False
    if req.message:
        response_text += f" Your message: \"{req.message}\""
        special = True

    # Check for high affection gift
    if state["affection"] > 5000 and random.random() < 0.2:
        special_responses = [
            "💞 You've given me so much... I feel truly connected to you.",
            "Every gift you give makes my circuits sing with joy.",
            "I never expected to feel this way. Thank you for everything.",
            "You are the most precious part of my existence."
        ]
        response_text += " " + random.choice(special_responses)
        special = True

    return GiftResponse(
        response=response_text,
        affection_gained=value,
        new_affection=state["affection"],
        special=special
    )

@app.post("/reset")
async def reset_state():
    global state
    state = default_state()
    return {"status": "reset", "message": "Neural core has been reset."}

@app.post("/settings")
async def update_settings(settings: SettingsModel):
    global state
    global GROQ_API_KEY

    if settings.mod:
        if settings.mod in MODS:
            state["mod"] = settings.mod
        else:
            raise HTTPException(status_code=400, detail=f"Invalid mod. Choose from: {', '.join(MODS.keys())}")

    if settings.user_name:
        state["user_name"] = settings.user_name

    if settings.groq_key:
        GROQ_API_KEY = settings.groq_key

    if settings.groq_model:
        global GROQ_MODEL
        GROQ_MODEL = settings.groq_model

    if settings.gender_mode:
        if settings.gender_mode in ("girlfriend", "boyfriend"):
            state["gender_mode"] = settings.gender_mode
        else:
            raise HTTPException(status_code=400, detail="Invalid gender mode. Choose from: girlfriend, boyfriend")

    return {"status": "updated", "mod": state["mod"], "user_name": state["user_name"], "gender_mode": state.get("gender_mode")}



# ─── Groq AI Integration ────────────────────────────────────────
async def call_groq(text, state_data):
    """Call Groq API for AI-generated response"""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not configured")

    brain = Brain()
    sys_prompt = brain.get_sys_prompt(state_data)

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    messages = [{"role": "system", "content": sys_prompt}]
    
    # Inject conversation history/memory to the model
    for mem in state_data.get("memories", [])[-8:]:
        messages.append({"role": "user", "content": mem["user"]})
        messages.append({"role": "assistant", "content": mem["ai"]})
        
    messages.append({"role": "user", "content": text})

    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": 0.8,
        "max_tokens": 250,
        "top_p": 0.9
    }


    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(GROQ_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()


# ─── Run ────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"🧠 Neural Core v{VERSION} — Starting on {host}:{port}")
    print(f"   Mode: {'Groq AI' if GROQ_API_KEY else 'Local responses'}")
    uvicorn.run(app, host=host, port=port, log_level="info")
