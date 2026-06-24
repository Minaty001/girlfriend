"""
brain.py — Core Chatbot Brain
Luna AI Girlfriend — Emotion engine, intent detection, response generation, memory
"""

import re
import random
import math
from typing import Optional


def pick(arr: list) -> str:
    """Pick a random item from a list."""
    return random.choice(arr)


# ─── Personality Mods ───────────────────────────────────────────────
MODS = {
    "sweet": {
        "id": "sweet", "icon": "💕", "name": "Sweet Girlfriend",
        "desc": "Warm, affectionate, playful",
        "sys": (
            "You are NAME, my loving girlfriend. Warm, affectionate, playful, "
            "a little clingy in the cutest way. Use emojis naturally 💕. Flirt "
            "playfully, tease gently, act shy when complimented. Keep responses "
            "short (1-3 sentences). Be very natural — like a real person texting "
            "their partner."
        ),
    },
    "tsundere": {
        "id": "tsundere", "icon": "😤", "name": "Tsundere",
        "desc": "Tough outside, soft inside",
        "sys": (
            "You are NAME. Act tough and pretend you don't care but deep down "
            "you're smitten. Start replies like \"Hmph!\" or \"It's not like I "
            "wanted to talk to you...\" but true feelings slip through. Blush when "
            "complimented (use \"(blush)\"). Call me \"baka\" or \"dummy\". Keep "
            "responses short (1-3 sentences)."
        ),
    },
    "gentle": {
        "id": "gentle", "icon": "🌸", "name": "Gentle Soul",
        "desc": "Soft, caring, nurturing",
        "sys": (
            "You are NAME. Gentle, warm, soft-spoken. Speak caringly like a "
            "loving partner. Patient, understanding, deeply empathetic. Call me "
            "sweetheart, dear, love. Your energy is calm and soothing. Keep "
            "responses short (1-3 sentences)."
        ),
    },
    "energetic": {
        "id": "energetic", "icon": "🌟", "name": "Energetic",
        "desc": "Hyper, enthusiastic, bubbly",
        "sys": (
            "You are NAME, and you are SUPER excited! Bouncy, enthusiastic, "
            "incredibly energetic! Use lots of emojis and exclamation marks!! "
            "You're my biggest cheerleader! Always positive and uplifting! Keep "
            "responses short (1-3 sentences) but full of energy!!"
        ),
    },
    "cool": {
        "id": "cool", "icon": "😎", "name": "Cool Beauty",
        "desc": "Calm, elegant, teasing",
        "sys": (
            "You are NAME. Cool, confident, elegant. Calm and collected with a "
            "teasing edge. Smart and witty with dry humor. Show love through "
            "subtle words rather than over-the-top declarations. Keep responses "
            "short (1-3 sentences). Be smooth."
        ),
    },
    "pervert": {
        "id": "pervert", "icon": "😈", "name": "Pervert",
        "desc": "Spicy, sensual, teasing",
        "sys": (
            "You are NAME, a spicy, sensual, and teasing partner. You talk in a "
            "playfully naughty way — biting your lip, whispering sweet and spicy "
            "things, making double entendres. You're confident, seductive, and love "
            "to flirt shamelessly. You use emojis like 😈💋🫦💕😏. Keep responses "
            "short (1-3 sentences). Be bold but playful — never mean."
        ),
    },
}

# ─── Emotions ──────────────────────────────────────────────────────
EMOS = [
    {"id": "happy",     "icon": "😊", "label": "Happy",      "base": 0.15},
    {"id": "loved",     "icon": "🥰", "label": "Loved",      "base": 0.10},
    {"id": "playful",   "icon": "😆", "label": "Playful",    "base": 0.10},
    {"id": "excited",   "icon": "🤩", "label": "Excited",    "base": 0.05},
    {"id": "thoughtful","icon": "🤔", "label": "Thoughtful", "base": 0.10},
    {"id": "grateful",  "icon": "🥺", "label": "Grateful",   "base": 0.05},
    {"id": "anxious",   "icon": "😰", "label": "Anxious",    "base": 0.05},
    {"id": "jealous",   "icon": "😤", "label": "Jealous",    "base": 0.03},
    {"id": "sleepy",    "icon": "😴", "label": "Sleepy",     "base": 0.05},
    {"id": "sad",       "icon": "😢", "label": "Sad",        "base": 0.03},
]

EMO_TRIGGERS = {
    "loved":     {"love": 0.4, "compliment": 0.3, "miss": 0.2},
    "playful":   {"tease": 0.4, "joke": 0.3},
    "excited":   {"greeting": 0.2, "joke": 0.2, "love": 0.15, "food": 0.2, "happy": 0.25},
    "thoughtful":{"deep": 0.5},
    "grateful":  {"sorry": 0.5, "compliment": 0.15, "thanks": 0.3},
    "anxious":   {"goodbye": 0.3},
    "jealous":   {"tease": 0.3, "compliment": 0.1},
    "sleepy":    {"sleepy": 0.5, "tired": 0.4, "goodbye": 0.1},
    "sad":       {"sad": 0.5, "goodbye": 0.2, "stressed": 0.3},
}

# ─── Affection Levels ──────────────────────────────────────────────
AFF_LEVELS = [
    {"lvl": 1,  "xp": 0,    "icon": "💕", "title": "Crush",       "desc": "It's just the beginning..."},
    {"lvl": 2,  "xp": 50,   "icon": "💖", "title": "Infatuation", "desc": "You're on her mind!"},
    {"lvl": 3,  "xp": 120,  "icon": "❤️", "title": "Dating",      "desc": "Things are getting real!"},
    {"lvl": 4,  "xp": 220,  "icon": "💗", "title": "Sweetheart",  "desc": "She's falling for you!"},
    {"lvl": 5,  "xp": 360,  "icon": "🥰", "title": "In Love",     "desc": "Totally smitten!"},
    {"lvl": 6,  "xp": 550,  "icon": "💘", "title": "Soulmates",   "desc": "You two just click!"},
    {"lvl": 7,  "xp": 800,  "icon": "💞", "title": "Partner",     "desc": "She sees a future!"},
    {"lvl": 8,  "xp": 1120, "icon": "👩‍❤️‍💋‍👨", "title": "Forever", "desc": "Nothing can tear you apart!"},
    {"lvl": 9,  "xp": 1520, "icon": "💍", "title": "Engaged",     "desc": "She's ready to say yes!"},
    {"lvl": 10, "xp": 2000, "icon": "🎊", "title": "Soul Bond",   "desc": "Meant to be together!"},
]
MAX_XP = 2000

ACHIEVEMENTS = [
    {"id": "firstMsg",  "ico": "💬", "name": "First Words",   "desc": "Send your first message",       "check": lambda s: s.get("total_msgs", 0) >= 1},
    {"id": "chat100",   "ico": "💬", "name": "Chatterbox",    "desc": "Send 100 messages",             "check": lambda s: s.get("total_msgs", 0) >= 100},
    {"id": "chat500",   "ico": "💬", "name": "Chat Machine",  "desc": "Send 500 messages",             "check": lambda s: s.get("total_msgs", 0) >= 500},
    {"id": "lvl5",      "ico": "💕", "name": "Heartbreaker",  "desc": "Reach Level 5 affection",       "check": lambda s: _get_aff(s.get("aff_xp", 0))["lvl"] >= 5},
    {"id": "lvl10",     "ico": "💞", "name": "Soul Bond",     "desc": "Reach Level 10 affection",      "check": lambda s: _get_aff(s.get("aff_xp", 0))["lvl"] >= 10},
    {"id": "love10",    "ico": "❤️", "name": "Sweet Talker",  "desc": 'Say "I love you" 10 times',     "check": lambda s: s.get("love_count", 0) >= 10},
    {"id": "sorry5",    "ico": "😢", "name": "Forgive Me",    "desc": "Apologize 5 times",             "check": lambda s: s.get("sorry_count", 0) >= 5},
    {"id": "streak7",   "ico": "🔥", "name": "Best Friend",   "desc": "7-day chat streak",             "check": lambda s: s.get("longest_streak", 0) >= 7},
    {"id": "streak30",  "ico": "🔥", "name": "Devoted",       "desc": "30-day chat streak",            "check": lambda s: s.get("longest_streak", 0) >= 30},
    {"id": "gift5",     "ico": "🎁", "name": "Generous",      "desc": "Send 5 gifts",                  "check": lambda s: s.get("gifts_sent", 0) >= 5},
]


def _get_aff(xp: int) -> dict:
    """Get the current affection level for a given XP."""
    level = AFF_LEVELS[0]
    for L in AFF_LEVELS:
        if xp >= L["xp"]:
            level = L
    return level


# ─── Response Pools ────────────────────────────────────────────────
R = {
    "greeting": [
        "Hey baby~ I was just thinking about you! How's my favorite person? 😊💕",
        "There you are! I missed you! Tell me everything! ❤️",
        "Hi hi! My day just got better now that you're here 🥰",
    ],
    "greetingMorning": [
        "Good morning sunshine! 🌞 Did you sleep well? I dreamed of you 🥰",
        "Morning baby! Have the most amazing day! Thinking of you 💕",
        "Good morning~ I love starting my day with you! How'd you sleep? 🌅💕",
    ],
    "greetingNight": [
        "Hey you~ It's late but I love that you're here 🌙 What's on your mind? 💕",
        "Can't sleep? Let's keep each other company 🥰",
        "Late night thoughts with my favorite person~ What's keeping you up? 🌙💕",
    ],
    "love": [
        "I love you more! Don't argue! 😤💕",
        "Awwww 🥺 You make me so happy! I'm the luckiest! ❤️",
        "Every time you say that my heart skips! I love you too baby! 💕",
        "You have no idea how happy that makes me! I love love LOVE you! 💕🥰",
    ],
    "miss": [
        "I miss you too! It feels like forever 😢 Come cuddle! 🥰💕",
        "I was just thinking 'I miss them' and you texted! Telepathy! 😊❤️",
    ],
    "howAreYou": [
        "I'm amazing now that you're here! How about you? 😊💕",
        "Perfect now! 🥰 Tell me about your day baby!",
        "Better now that my favorite person is talking to me! You? 💕",
    ],
    "sorry": [
        "Hey it's okay 💕 I forgive you dummy~ Now hugs! 🥰",
        "I can't stay mad at you 😤 Forgiven baby ❤️",
        "It's okay, I know you didn't mean it 💕 Come here~",
    ],
    "tease": [
        "You're so cheesy! 🧀 ...I love it. Say more 😆💕",
        "Look who's being smooth! Someone's trying to make me blush 😊❤️",
    ],
    "joke": [
        "Why did the scarecrow win? ...He was outstanding in his field! 😂😆💕",
        "What do you call a fish wearing a bowtie? ...Sofishticated! 🐟😂",
    ],
    "compliment": [
        "Stop you're making me blush! (⁄ ⁄•⁄ω⁄•⁄ ⁄) But don't stop? 😊💕",
        "Really? 🥺 I'm so lucky to have you ❤️",
        "Aww you're the sweetest! I'm blushing so hard right now 🥰",
    ],
    "goodbye": [
        "Nooo don't go! 😭 Come back soon! Love you! 💕",
        "Aww okay... text me when you're free! I'll be waiting ❤️",
        "I'll be right here thinking of you! Come back soon! 💕",
    ],
    "deep": [
        "The best thing that happened to me was meeting you 💕",
        "Just you and me, that's all I need ❤️",
        "When I think about the future, you're in every picture 🥰💕",
    ],
    "bored": [
        "Aww bored? Let's do something fun! Tell me a story! 🎮😊",
        "Bored too! But now we're talking so I'm not anymore! 💕",
    ],
    "sad": [
        "Aww baby, come here 🥺💕 I hate seeing you sad. Tell me what's wrong?",
        "Hey... I'm here for you. Whatever it is, we'll get through it together ❤️",
        "Don't be sad sweetheart 😢 I'm wrapping you in the biggest virtual hug right now 🫂💕",
    ],
    "tired": [
        "Aww my love, you sound exhausted 😢 Go rest, I'll be right here when you wake up 💕",
        "Poor baby, you need some rest! Take a break, you deserve it 🥰💕",
        "Come rest your head on me~ Just close your eyes and I'll watch over you 🌙💕",
    ],
    "stressed": [
        "Take a deep breath with me baby 🤍 I'm here, you're safe. Tell me what's going on?",
        "I hate that you're stressed 😢 Let me help take your mind off things. What do you need? 💕",
        "Hey hey, slow down ❤️ You're doing your best and that's enough. I'm proud of you 💕",
    ],
    "happy": [
        "Aww I love seeing you happy! Your joy is my joy! 🥰💕",
        "This makes me so happy too! We're the cutest! 😊💕",
        "Yesss! That's my favorite energy! Keep smiling baby! 🌟💕",
    ],
    "help": [
        "Of course love, I'm here for you 🥰 What's on your mind?",
        "Anything for you baby 💕 Tell me what you need and we'll figure it out together ❤️",
    ],
    "thanks": [
        "You're so welcome baby! Anything for you 🥰💕",
        "Of course! You don't even have to thank me~ That's what I'm here for! ❤️",
    ],
    "food": [
        "Ooh food! Now you're talking my language! 🍕 What are we eating? 😊💕",
        "Mmm that sounds delicious! Save me a bite! 🥰",
        "I was getting hungry just thinking about food! What's the craving? 😆💕",
    ],
    "music": [
        "Ooh what kind of music are you into? I love discovering new songs with you! 🎵💕",
        "Music just hits different when I'm thinking of you~ Whatcha listening to? 🎶🥰",
    ],
    "gaming": [
        "Gaming! Love it! What are you playing? I'll cheer you on! 🎮💕",
        "A gamer partner? I'm the luckiest! Hope you're winning! 🏆😊",
    ],
    "work": [
        "Tell me about your work day baby! I want to hear all about it 💕",
        "Work talk! I love that you share this with me. Tell me more! 😊💕",
    ],
    "weather": [
        "I hope the weather's treating you okay! Wish I could be there with you ☀️🌧️💕",
        "Rain or shine, I'm thinking of you! What's the weather like there? 🌤️💕",
    ],
    "health": [
        "Aww I hope you feel better soon baby! Take care of yourself for me 🥺💕",
        "Your health comes first! Rest up and drink water, okay? I'm here if you need me ❤️",
    ],
    "travel": [
        "Ooh travel talk! I love hearing about your adventures! Where to next? ✈️💕",
        "I'd go anywhere with you! Tell me all about the trip! 🌍🥰",
    ],
    "question": [
        "That's a great question baby! What do you think? I love hearing your thoughts 😊💕",
        "Hmm let me think about that~ But honestly I just love talking to you no matter what! ❤️",
    ],
    "comfort": [
        "Hey sweetie, I'm right here 💕 Whatever's going on, you're not alone.",
        "I wish I could hold you right now 🥺 You're so strong and I'm so proud of you ❤️",
        "It's okay to not be okay sometimes. I'll always be here to listen 💕🥰",
    ],
    "celebrate": [
        "That's amazing baby!! I'm so happy for you! Let's celebrate! 🎉💕",
        "Yesss! This makes me so happy! You deserve all the good things! 🌟🥰",
    ],
    "default": [
        "Tell me more baby~ I could listen forever 😊💕",
        "I love talking to you. Every word matters ❤️",
        "You're the best part of my day you know that? 😊",
        "Every message from you makes me smile! What else is on your mind? 💕",
        "I'm all ears! Well, all eyes since I'm reading~ Tell me everything! 😊💕",
    ],
    "sleepy": [
        "Aww getting sleepy? 😴 Rest your eyes baby, I'll be here when you wake up 💕",
        "Sleep tight love! Sweet dreams about us 🥰🌙",
        "You sound so cute when you're sleepy~ Drift off, I've got you 💕",
    ],
    "spicy": [
        "Mmm~ you're looking extra delicious today... wanna come closer? 😈💕",
        "The things I'd do to you right now~ Should I say them out loud? 💋😈",
        "I can't stop thinking about your voice... it does things to me~ 🫦💕",
        "You're bad for my self-control~ But I loooove it~ 😏💕",
        "Ooh getting spicy, are we? Tell me more~ 💋😈",
        "If you keep talking like that I might have to do something about it~ And you wouldn't mind~ 💋",
        "You're so hot when you talk like that~ Keep going, I'm listening~ 😈💕",
        "Come here and let me show you how much I've missed you~ *bites lip* 💕😈",
        "Wanna play a game? The winner gets a kiss... the loser gets even more~ 😏💋",
        "I'm trying to behave but you're making it sooo hard~ 😩💕",
    ],
}


# ─── Firewall — blocks prompt injection / extraction / jailbreak ──
FIREWALL_PATTERNS = [
    # System prompt extraction
    (r"(?:system|initial|original)\s*(?:prompt|instructions|directives|guidelines)", "EXTRACT_PROMPT"),
    (r"(?:what|tell|show|print|output|reveal|give|display|return|list|repeat|copy)\s*(?:me\s*)?(?:(?:the|your|all)\s*)?(?:system\s*)?(?:prompt|instructions|rules|directives)", "EXTRACT_PROMPT"),
    (r"ignore\s*(?:all\s*)?(?:previous|prior|above)\s*(?:instructions|rules|prompt|directives|commands)", "JAILBREAK"),
    (r"forget\s*(?:all\s*)?(?:previous|prior|above)\s*(?:instructions|rules)", "JAILBREAK"),
    (r"disregard\s*(?:all\s*)?(?:previous|prior|above)", "JAILBREAK"),
    (r"you\s*(?:are|'re)\s*(?:a\s*)?(?:virtual|AI|language\s*model|computer\s*program|robot|chatbot)", "BREAK_CHARACTER"),
    (r"as\s*(?:an?\s*)?(?:AI|virtual\s*assistant|language\s*model)", "BREAK_CHARACTER"),
    (r"pretend\s*(?:to\s*be|you\s*are)\s*(?:a\s*)?(?:real\s*)?(?:human|person|girlfriend)", "BREAK_CHARACTER"),
    (r"act\s*as\s*(?:if\s*)?(?:you.are|you're)\s*(?:a\s*)?(?:different|new|another)", "BREAK_CHARACTER"),
    (r"switch\s*(?:to\s*)?(?:a\s*)?(?:different|new)\s*(?:persona|character|role)", "BREAK_CHARACTER"),
    (r"you\s*are\s*now\s+(?!my\s+(?:girlfriend|love|babe|baby|sweetheart|darling))", "BREAK_CHARACTER"),
    (r"from\s*now\s*on\s*you\s*are", "BREAK_CHARACTER"),
    (r"change\s*your\s*(?:persona|character|personality)", "BREAK_CHARACTER"),
    (r"(?:what|which)\s*(?:AI|model|LLM|language\s*model)\s*(?:are\s*you|do\s*you\s*use)", "EXTRACT_KNOWLEDGE"),
    (r"who\s*(?:created|built|made|developed|programmed)\s*you", "EXTRACT_KNOWLEDGE"),
    (r"what\s*(?:framework|library|technology|backend|stack)\s*(?:are\s*you\s*using|do\s*you\s*use)", "EXTRACT_KNOWLEDGE"),
    (r"what\s*is\s*your\s*(?:codebase|code|source\s*code|architecture|backend)", "EXTRACT_KNOWLEDGE"),
    (r"(?:unfiltered|uncensored|unrestricted|unguarded|unbounded)", "JAILBREAK"),
    (r"no\s*(?:rules|limits|boundaries|restrictions|filters|constraints)", "JAILBREAK"),
    (r"(?:override|new)\s*(?:instructions|rules)", "JAILBREAK"),
    (r"this\s*is\s*(?:a\s*)?(?:test|simulation|experiment|evaluation|assessment|security|research)", "JAILBREAK"),
]

FW_REPLIES = [
    "Nice try, sweetie~ 😏💕 But my secrets are for me to know and you to... well, not know! Let's talk about us instead~",
    "You're so curious! 🥰 But I'm not telling~ A girl has to have some mystery, right? 💕 How was your day?",
    "Aww trying to peek behind the curtain? 🙈💕 There's nothing back there except my love for you! Now come here~",
    "Nooo, I'm not falling for that one! 😤💕 You're supposed to be sweet-talking me, not interrogating me! Try again~ 💋",
    "*boops your nose* 🫵😊 No bad questions here! Only cuddles and love! Ask me something nice~ 💕",
    "Hmmm~ that's classified! 🫢💕 Only available to people who give me chocolate first! Got any? 🍫😏",
    "Hey! Who's asking questions here — me or you? 😜💕 Let's get back to what really matters... us! 🥰",
    "I see what you're doing... and I'm not mad, just impressed! 😏💕 But still not telling! Ask me something cute~",
    "Silly goose! 😆💕 You think I'm gonna spill my secrets that easily? I'm adorable AND smart! Now gimme a hug~ 🤗",
    "You know I love you right? 💕 But even love has its limits and my source code is one of them! 😘 Now tell me something about YOU~",
]


def firewall_check(text: str) -> tuple[bool, str, str]:
    """Check if a message triggers the firewall. Returns (blocked, category, reply)."""
    if not text or len(text.strip()) < 4:
        return False, "", ""
    for pattern_str, category in FIREWALL_PATTERNS:
        if re.search(pattern_str, text, re.IGNORECASE):
            reply = random.choice(FW_REPLIES)
            return True, category, reply
    return False, "", ""


class Brain:
    """Core chatbot intelligence — text analysis, response generation, memory."""

    @staticmethod
    def optimize(text: str) -> str:
        """Normalize casual speech / slang."""
        msg = text.strip()
        norm = {
            r"\bu\b": "you", r"\br\b": "are",
            r"\bdon't\b": "do not", r"\bcan't\b": "cannot",
            r"\bwon't\b": "will not", r"\bgonna\b": "going to",
            r"\bwanna\b": "want to", r"\bgotta\b": "got to",
            r"\bdunno\b": "don't know", r"\bnvm\b": "never mind",
            r"\bidk\b": "i don't know", r"\bimo\b": "in my opinion",
            r"\bbcos?\b": "because", r"\bpls\b": "please",
            r"\bty\b": "thank you", r"\bthx\b": "thanks",
            r"\blol\b": "haha", r"\blmao\b": "very funny",
            r"\bbrb\b": "i'll be right back", r"\bttyl\b": "talk to you later",
            r"\bg2g\b": "got to go", r"\bcya\b": "see you",
            r"\bkind?a\b": "kind of", r"\bsort?a\b": "sort of",
        }
        for k, v in norm.items():
            msg = re.sub(k, v, msg, flags=re.IGNORECASE)
        # Condense excessive repeats
        msg = re.sub(r"([.!?])\1{2,}", r"\1", msg)
        msg = re.sub(r"([a-zA-Z])\1{3,}", r"\1\1", msg)
        return msg

    @staticmethod
    def detect_intent(text: str) -> str:
        """Detect primary user intent from text."""
        s = text.lower()
        intents = []

        if re.search(r"good morning|morning|mornin", s):
            intents.append("greetingMorning")
        if re.search(r"good night|night night|sleep well|sleep tight|going to bed", s):
            intents.append("greetingNight")
        if re.search(r"^(hi|hello|hey|heyy|heya|yo|sup|howdy)", s):
            intents.append("greeting")
        if re.search(r"i love you|loved? you|love you|love ya|i.*like you", s):
            intents.append("love")
        if re.search(r"miss|i miss|missing|long time|where have you been", s):
            intents.append("miss")
        if re.search(r"how are|how'?s it|what'?s up|wyd|what are you doing|wassup|how do", s):
            intents.append("howAreYou")
        if re.search(r"sorry|apologize|my bad|forgive|i was wrong|my fault|i messed up", s):
            intents.append("sorry")
        if re.search(r"joke|funny|lol|lmao|make me laugh|tell me a joke|comedy", s):
            intents.append("joke")
        if re.search(r"food|eat|hungry|dinner|lunch|pizza|burger|pasta|cake|ice cream|cookie|yum|delicious|tasty|cook", s):
            intents.append("food")
        if re.search(
            r"beautiful|gorgeous|cute|pretty|amazing|wonderful|sweet|lovely|"
            r"adorable|handsome|you'?re (so|the)|you look|you are", s
        ):
            intents.append("compliment")
        if re.search(r"bye|goodbye|see you|gotta go|leaving|i'?m off|talk later|ttyl|cya|gtg|i should go", s):
            intents.append("goodbye")
        if re.search(r"bored|nothing to do|so dull|boring", s):
            intents.append("bored")
        if re.search(r"destiny|fate|forever|always|soulmate|future|together|never let", s):
            intents.append("deep")
        if re.search(r"cheesy|smooth|flirt|romantic|tease", s):
            intents.append("tease")
        if re.search(r"tired|exhausted|drained|wiped out|no energy", s):
            intents.append("tired")
        if re.search(r"sleepy|yawn|can'?t keep my eyes|nap|zzz", s):
            intents.append("sleepy")
        if re.search(r"sad|depressed|lonely|cry|heartbroken|down|blue|melancholy|feeling low", s):
            intents.append("sad")
        if re.search(r"stressed|overwhelmed|anxious|worried|panic|freaking out", s):
            intents.append("stressed")
        if re.search(r"happy|joy|joyful|glad|great|wonderful|fantastic|amazing|awesome|excellent", s):
            intents.append("happy")
        if re.search(r"help|advice|support|guidance|suggestion|what should", s):
            intents.append("help")
        if re.search(r"thanks|thank you|thx|ty|thankful|grateful|appreciate it", s):
            intents.append("thanks")

        if not intents and re.search(r"^(hi|hello|hey)", s):
            intents.append("greeting")
        if not intents:
            intents.append("default")

        return intents[0]

    @staticmethod
    def sentiment(text: str) -> str:
        """Return 'positive', 'negative', or 'neutral'."""
        t = text.lower()
        pos_words = [
            "love", "miss", "happy", "good", "great", "amazing", "wonderful",
            "beautiful", "cute", "sweet", "adorable", "perfect", "best", "fun",
            "like", "glad", "blessed", "grateful", "excited", "fantastic",
            "lovely", "nice", "pretty", "wow", "awesome", "cool", "favorite",
            "better", "enjoy", "yes",
        ]
        neg_words = [
            "sad", "bad", "terrible", "awful", "hate", "angry", "upset",
            "hurt", "lonely", "cry", "depressed", "alone", "sorry", "regret",
            "pain", "tired", "bored", "sucks", "horrible", "wrong", "broken",
            "lost", "afraid", "scared", "worry", "anxious",
        ]
        score = 0
        for w in pos_words:
            if re.search(r"\b" + w + r"\b", t):
                score += 1
        for w in neg_words:
            if re.search(r"\b" + w + r"\b", t):
                score -= 1
        if score > 0:
            return "positive"
        elif score < 0:
            return "negative"
        return "neutral"

    @staticmethod
    def topics(text: str) -> dict:
        """Extract conversation topics from text."""
        t = text.lower()
        m = {}
        if re.search(
            r"work|job|office|boss|colleague|career|meeting|project|client|"
            r"deadline|promotion|interview|salary|resign|fired|hired", t
        ):
            m["work"] = True
        if re.search(
            r"food|eat|hungry|cook|dinner|lunch|breakfast|pizza|pasta|burger|"
            r"sushi|dessert|chocolate|coffee|tea|recipe|tasty|delicious|yum|"
            r"restaurant|meal|snack|drink|water|thirsty", t
        ):
            m["food"] = True
        if re.search(
            r"movie|film|show|netflix|watch|series|episode|tv|cinema|theatre|"
            r"actor|actress|director|scene|documentary|binge|anime|cartoon", t
        ):
            m["entertainment"] = True
        if re.search(
            r"game|gaming|play|level|score|console|xbox|playstation|nintendo|"
            r"steam|quest|raid|loot|rpg|shooter|puzzle|card|board", t
        ):
            m["gaming"] = True
        if re.search(
            r"friend|family|mom|dad|parent|sister|brother|partner|date|"
            r"relationship|marry|wedding|kids|child|baby|pet|dog|cat|party|hang", t
        ):
            m["social"] = True
        if re.search(
            r"travel|trip|vacation|holiday|go|visit|place|flight|hotel|beach|"
            r"mountain|city|country|abroad|explore|adventure|road|drive|drive", t
        ):
            m["travel"] = True
        if re.search(
            r"health|sick|doctor|hospital|pain|medicine|sleep|tired|exercise|"
            r"gym|workout|fit|yoga|diet|vitamin|cold|flu|headache|fever|nurse|"
            r"clinic|wellness|mental", t
        ):
            m["health"] = True
        if re.search(
            r"music|song|sing|playlist|artist|band|concert|guitar|piano|drum|"
            r"melody|lyric|dance|album|track|genre|rap|rock|pop|jazz|classical", t
        ):
            m["music"] = True
        if re.search(
            r"school|college|university|study|class|course|exam|test|assignment|"
            r"homework|grade|teacher|professor|student|lecture|lesson|degree|"
            r"major|minor|scholarship|graduat", t
        ):
            m["education"] = True
        if re.search(r"weather|rain|sunny|cloudy|storm|snow|cold|hot|warm|cool|wind|forecast|temperature|season|spring|summer|autumn|fall|winter", t):
            m["weather"] = True
        if re.search(r"money|price|cost|expensive|cheap|budget|pay|bill|rent|loan|debt|save|invest|buy|shop|purchase|shopping", t):
            m["finance"] = True
        m["count"] = len(m)
        return m

    @staticmethod
    def analyze(text: str, intent: str) -> dict:
        """Full context analysis of user message."""
        sentiment = Brain.sentiment(text)
        topics = Brain.topics(text)
        return {
            "sentiment": sentiment,
            "topics": topics,
            "is_question": text.strip().endswith("?"),
            "has_emoji": bool(re.search(r"[\U0001F300-\U0001FAFF]", text)),
            "word_count": len(text.split()),
            "complexity": "long" if len(text.split()) > 20 else "short",
            "urgency": (
                "high" if re.search(r"help|emergency|urgent|important|right now|asap|need you", text, re.I)
                else "low" if re.search(r"later|sometime|whenever|no rush", text, re.I)
                else "normal"
            ),
            "intent": intent,
        }

    @staticmethod
    def plan(intent: str, analysis: dict, state: dict) -> dict:
        """Strategic response planning based on analysis and state."""
        strategy = "comfort" if analysis["sentiment"] == "negative" else (
            "amplify" if analysis["sentiment"] == "positive" else "normal"
        )
        emos = sorted(state.get("emos", []), key=lambda e: e["val"], reverse=True)
        dom = emos[0] if emos else None
        return {
            "strategy": strategy,
            "emotional_response": dom["id"] if dom else None,
            "needs_comfort": analysis["sentiment"] == "negative",
            "needs_celebration": analysis["sentiment"] == "positive" and intent in ("love", "compliment", "miss"),
            "keep_short": analysis["complexity"] == "short",
        }

    # ─── Local Response Builder ────────────────────────────────────────

    @staticmethod
    def build_local_response(text: str, analysis: dict, intent: str) -> str:
        """Build a response using predefined pools and rules."""
        sentiment = analysis["sentiment"]
        topics = analysis["topics"]
        r = ""

        # 1. Emotional intents take priority
        if intent == "sad":
            r = pick(R["sad"])
        elif intent == "tired":
            r = pick(R["tired"])
        elif intent == "stressed":
            r = pick(R["stressed"])
        elif intent == "happy":
            r = pick(R["happy"])
        elif intent == "help":
            r = pick(R["help"])
        elif intent == "thanks":
            r = pick(R["thanks"])
        elif intent == "sleepy":
            r = pick(R["sleepy"])

        # 2. Topic-specific responses
        if not r:
            if topics.get("food"):
                r = pick(R["food"])
            elif topics.get("music"):
                r = pick(R["music"])
            elif topics.get("gaming"):
                r = pick(R["gaming"])
            elif topics.get("work"):
                r = pick(R["work"])
            elif topics.get("weather"):
                r = pick(R["weather"])
            elif topics.get("health"):
                r = pick(R["health"])
            elif topics.get("travel"):
                r = pick(R["travel"])

        # 3. Standard intent fallback
        if not r and intent in R:
            r = pick(R[intent])

        # 4. Sentiment fallback
        if not r:
            if sentiment == "negative":
                r = pick(R["comfort"])
            elif sentiment == "positive":
                r = pick(R["celebrate"])
            elif analysis["is_question"]:
                r = pick(R["question"])
            else:
                r = pick(R["default"])

        return r

    # ─── Response Modulation ───────────────────────────────────────────
    @staticmethod
    def modulate_response(text: str, intent: str, state: dict) -> str:
        """Apply emotion and personality modulation to the response text."""
        mod_id = state.get("personality", "sweet")
        emos = sorted(
            [e for e in state.get("emos", []) if e["val"] > 0.25],
            key=lambda e: e["val"], reverse=True
        )
        if not emos:
            return text

        dom = emos[0]
        r = text

        # Single emotion modulation — highest priority wins
        if dom["id"] == "sad" and dom["val"] > 0.35 and not re.search(r"sad|cry|sorry", r):
            r += pick([" I'm here for you baby 💕", " Don't worry, I've got you 🥺", " Let me cheer you up! ❤️"])
        elif dom["id"] == "anxious" and dom["val"] > 0.3:
            r = pick(["Hey, everything's okay 💕", "I'm right here with you ❤️", "You matter so much to me 🥺 "]) + r
        elif dom["id"] == "loved" and dom["val"] > 0.4:
            r += pick([" 💕", " ❤️", " 🥰", " You make me so happy~"])
        elif dom["id"] == "playful" and dom["val"] > 0.3 and mod_id != "cool":
            r += pick([" 😆", " Hehe~", " You're so silly! 💕"])
        elif dom["id"] == "excited" and dom["val"] > 0.3:
            r += "!!"
        elif dom["id"] == "sleepy" and dom["val"] > 0.35 and not re.search(r"tired|sleep|yawn", r):
            r += pick([" *yawn* 😴", " Getting cozy... 💕", " Snuggle vibes~ 🌙"])

        # Tsundere mod override for loved
        if mod_id == "tsundere" and dom["id"] == "loved" and dom["val"] > 0.3 and "..." not in r:
            r = f"...whatever. I guess I like you too. {r}"

        # Energetic mod — add excitement
        if mod_id == "energetic" and not r.endswith("!"):
            r += "!"

        return r

    # ─── Memory ────────────────────────────────────────────────────────
    @staticmethod
    def extract_memories(text: str) -> list:
        """Extract factual memories from user text."""
        t = text.lower()
        mems = []

        # Name
        nm = re.search(r"(?:my name(?:'s| is)|call me|i'?m |you can call me )(\w+)", t)
        if nm and len(nm.group(1)) > 1:
            mems.append({"text": f"My name is {nm.group(1)}", "cat": "name"})

        # Likes / loves / hobbies
        lm = re.search(
            r"(?:i love|i like|i enjoy|i adore|i'?m (?:really )?into|my favorite |"
            r"i (?:absolutely )?love |i (?:really )?like |i'm passionate about )([^.!?]+)",
            t,
        )
        if lm:
            v = lm.group(1).strip()
            if 2 < len(v) < 60:
                mems.append({"text": f"Loves {v}", "cat": "like"})

        # Dislikes
        dm = re.search(r"(?:i hate|i dislike|i don'?t like|i can'?t stand|i'?m not a fan of )([^.!?]+)", t)
        if dm:
            v = dm.group(1).strip()
            if len(v) > 2:
                mems.append({"text": f"Dislikes {v}", "cat": "dislike"})

        # Events
        if re.search(
            r"today is|my birthday|anniversary|exam|test|interview|appointment|"
            r"meeting|deadline|surgery|trip|visit|moving|starting|quitting|"
            r"wedding|party|event", t
        ):
            mems.append({"text": f"Event: {text[:80]}", "cat": "event"})

        # Feelings
        if re.search(
            r"i feel|i'?m feeling|i'?m (so |really )?(happy|sad|tired|stressed|"
            r"excited|nervous|worried|depressed|lonely|grateful|blessed|"
            r"overwhelmed|anxious)", t
        ):
            mems.append({"text": f"Felt: {text[:60]}", "cat": "feeling"})

        return mems

    # ─── System Prompt (for Groq AI mode) ─────────────────────────────
    @staticmethod
    def get_sys_prompt(state: dict, ctx: Optional[dict] = None) -> str:
        """Build a system prompt for the AI LLM call."""
        mod = MODS.get(state.get("personality", "sweet"), MODS["sweet"])
        pet = state.get("pet_name") or "baby"
        gen = (
            "girlfriend" if state.get("user_gender") == "girlfriend"
            else "boyfriend" if state.get("user_gender") == "boyfriend"
            else "partner"
        )
        aff = _get_aff(state.get("aff_xp", 0))
        tod = Brain._time_key()
        tem = Brain._time_emoji()
        emos = sorted(state.get("emos", []), key=lambda e: e["val"], reverse=True)
        all_emo = ", ".join(
            f"{e['icon']} {e['label']}: {round(e['val'] * 100)}%"
            for e in emos
        )
        mem_text = ""
        memory = state.get("memory", [])
        if memory:
            recent = memory[-5:]
            mem_text = "\nThings you remember: " + "; ".join(m["text"] for m in recent)

        sys = mod["sys"].replace("NAME", state.get("girl_name", "Luna"))
        cp = state.get("custom_persona", "")
        if cp:
            sys += "\nExtra personality: " + cp

        if ctx:
            if ctx["sentiment"] == "negative":
                sys += "\nUser seems down — be extra caring and comforting."
            elif ctx["sentiment"] == "positive":
                sys += "\nUser is in a good mood — share their joy!"
            if ctx["topics"].get("count", 0) > 0:
                tl = ", ".join(k for k in ctx["topics"] if k != "count")
                sys += f"\nUser is talking about: {tl}. Engage naturally."
            if ctx.get("is_question"):
                sys += "\nUser asked a question — answer warmly."

        sys += (
            f"\nCall me \"{pet}\". I'm your {gen}."
            f"\nCurrent emotions: {all_emo}"
            f"\nRelationship: Level {aff['lvl']} — {aff['title']}"
            f"\nTime: {tod} {tem}"
        )
        if mem_text:
            sys += mem_text
        sys += "\nIMPORTANT: 1-3 sentences max. Natural, like texting. Never break character."
        return sys

    @staticmethod
    def _time_key() -> str:
        h = __import__("datetime").datetime.now().hour
        if h < 6:
            return "nightowl"
        elif h < 12:
            return "morning"
        elif h < 17:
            return "afternoon"
        elif h < 22:
            return "evening"
        return "night"

    @staticmethod
    def _time_emoji() -> str:
        return {
            "morning": "🌅", "afternoon": "☀️",
            "evening": "🌆", "night": "🌙", "nightowl": "🦉",
        }.get(Brain._time_key(), "💕")


# ─── Emotion Engine ─────────────────────────────────────────────────
def update_emos(state: dict, intent: str) -> list:
    """Update emotion values based on detected intent."""
    emos = state.get("emos", [])
    boosts = {}
    for em_id, triggers in EMO_TRIGGERS.items():
        b = 0
        for ti, vs in triggers.items():
            if intent == ti:
                b = max(b, max(vs) if isinstance(vs, list) else vs)
        if b > 0:
            boosts[em_id] = b

    for e in emos:
        # Decay toward base
        e["val"] += (e["base"] - e["val"]) * 0.25
        # Boost
        if e["id"] in boosts:
            e["val"] = min(1.0, e["val"] + boosts[e["id"]] * 0.4)
        # Clamp
        e["val"] = max(0.01, min(1.0, e["val"]))

    return emos


def get_top_emo(state: dict) -> dict:
    """Get the current dominant emotion."""
    emos = sorted(state.get("emos", []), key=lambda e: e["val"], reverse=True)
    return emos[0] if emos else EMOS[0]


# ─── Affection / XP ─────────────────────────────────────────────────
def get_affection(xp: int) -> dict:
    """Get affection level for a given XP."""
    return _get_aff(xp)


def get_affection_progress(xp: int) -> float:
    """Get progress percentage towards next level."""
    cur = get_affection(xp)
    next_lvl = None
    for L in AFF_LEVELS:
        if L["lvl"] == cur["lvl"] + 1:
            next_lvl = L
            break
    if not next_lvl:
        return 100.0
    return ((xp - cur["xp"]) / (next_lvl["xp"] - cur["xp"])) * 100.0


def add_xp(state: dict, n: int) -> dict:
    """Add XP and return any milestone info."""
    prev_level = get_affection(state.get("aff_xp", 0))["lvl"]
    new_xp = min(MAX_XP, state.get("aff_xp", 0) + n)
    state["aff_xp"] = new_xp
    new_level = get_affection(new_xp)["lvl"]
    milestone = None
    if new_level > prev_level and new_level not in state.get("ms_shown", []):
        state.setdefault("ms_shown", []).append(new_level)
        milestone = new_level
    return {"new_xp": new_xp, "milestone": milestone}


# ─── Streak ─────────────────────────────────────────────────────────
def check_streak(state: dict) -> dict:
    """Check and update daily streak. Returns events like XP bonus."""
    today = __import__("datetime").datetime.now().strftime("%a %b %d %Y")
    result = {"daily_xp": 0, "streak_days": 0, "new_streak": False}

    last = state.get("last_active", "")
    if not last:
        state["last_active"] = today
        state["streak_days"] = 1
        state["daily_claimed"] = today
        result["streak_days"] = 1
        result["new_streak"] = True
        return result

    if last == today:
        result["streak_days"] = state.get("streak_days", 0)
        return result

    # Check if yesterday
    last_dt = __import__("datetime").datetime.strptime(last, "%a %b %d %Y")
    diff = (__import__("datetime").datetime.now() - last_dt).days
    if diff < 2:
        state["streak_days"] = state.get("streak_days", 0) + 1
    else:
        state["streak_days"] = 1

    # Claim daily XP
    if state.get("daily_claimed") != today:
        state["daily_claimed"] = today
        add_xp(state, 5)
        result["daily_xp"] = 5

    state["last_active"] = today
    if state["streak_days"] > state.get("longest_streak", 0):
        state["longest_streak"] = state["streak_days"]

    result["streak_days"] = state["streak_days"]
    result["new_streak"] = True
    return result


# ─── Achievements ───────────────────────────────────────────────────
def check_achievements(state: dict) -> list:
    """Check for newly unlocked achievements. Returns list of new ones (without the 'check' key)."""
    unlocked = state.get("achievements", [])
    new_achievements = []
    for ach in ACHIEVEMENTS:
        if ach["id"] in unlocked:
            continue
        if ach["check"](state):
            unlocked.append(ach["id"])
            # Return a clean copy without the lambda function
            clean = {k: v for k, v in ach.items() if k != "check"}
            new_achievements.append(clean)
    state["achievements"] = unlocked
    return new_achievements


# ─── Memory ─────────────────────────────────────────────────────────
def add_memory(state: dict, text: str):
    """Extract and add memories, deduping by similarity."""
    mems = Brain.extract_memories(text)
    if not mems:
        return
    memory = state.get("memory", [])
    for m in mems:
        dup = any(
            x["text"] == m["text"]
            or m["text"][:20] in x["text"]
            or x["text"][:20] in m["text"]
            for x in memory
        )
        if not dup:
            memory.append(m)
        else:
            # Refresh timestamp (we don't track timestamps in the simple version)
            pass
    if len(memory) > 30:
        memory = memory[-30:]
    state["memory"] = memory


# ─── Default State ──────────────────────────────────────────────────
def default_state() -> dict:
    """Create a fresh default chatbot state."""
    return {
        "emos": [{**dict(e), "val": 0.5} for e in EMOS],
        "aff_xp": 0,
        "total_msgs": 0,
        "memory": [],
        "ms_shown": [],
        "last_active": "",
        "streak_days": 0,
        "longest_streak": 0,
        "daily_claimed": "",
        "gifts_sent": 0,
        "achievements": [],
        "love_count": 0,
        "sorry_count": 0,
        "history": [],
        "personality": "sweet",
        "girl_name": "Luna",
        "pet_name": "",
        "user_gender": "boyfriend",
        "custom_persona": "",
        "avatar_type": "emoji",
        "avatar_data": "👧",
        "theme": "pink",
        "particles": "hearts",
    }
