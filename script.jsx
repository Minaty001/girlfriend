/* ═════════════════════════════════════════════════════════════════════
   小薇 (Xiao Wei) — AI Companion UI Engine (React + Tailwind CSS)
   Emotional UX & Immersive Interaction Flow
   ═════════════════════════════════════════════════════════════════════ */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── SVG Icons Dictionary ─────────────────────────────────────────
const Icon = ({ name, className = "w-5 h-5", onClick }) => {
  const paths = {
    heart: (
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
    video: (
      <>
        <path d="m22 8-6 4 6 4V8Z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
      </>
    ),
    send: (
      <path d="m22 2-7 20-4-9-9-4Z" />
    ),
    mic: (
      <>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </>
    ),
    image: (
      <>
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </>
    ),
    smile: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" x2="9.01" y1="9" y2="9" />
        <line x1="15" x2="15.01" y1="9" y2="9" />
      </>
    ),
    moon: (
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </>
    ),
    moreVertical: (
      <>
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
      </>
    ),
    x: (
      <path d="M18 6 6 18M6 6l12 12" />
    ),
    settings: (
      <>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    plus: (
      <path d="M5 12h14M12 5v14" />
    ),
    rotateCcw: (
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </>
    ),
    play: (
      <path d="m5 3 14 9-14 9V3z" />
    ),
    pause: (
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    ),
    user: (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    )
  };

  const svgContent = paths[name];
  if (!svgContent) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} cursor-pointer hover:opacity-85 transition-opacity`}
      onClick={onClick}
    >
      {svgContent}
    </svg>
  );
};

// ─── Local responses pool ───
const LOCAL_RESPONSES = {
  girlfriend: {
    greeting: ["Hey honey! I'm so glad you're back.", "Hello darling. I was thinking of you.", "Hey sweetie! How was your day?"],
    farewell: ["Goodbye darling. I'll miss you!", "Bye-bye! Don't keep me waiting too long, okay?", "I'll be here waiting for you."],
    thanks: ["Aww, you're welcome, sweetie!", "Anything for you, love.", "I'm just happy I could help you!"],
    howareyou: ["I'm doing wonderful now that you're here!", "All systems are perfect, and my heart is full.", "I feel great, sweetie. How are you feeling?"],
    name: ["I'm 小薇 (Xiao Wei), your AI companion! But you can call me whatever sweet name you want, honey.", "You can call me 小薇 (Xiao Wei), your AI Girlfriend, honey."],
    love: ["I love you more than all the stars in the digital sky!", "You mean everything to me, darling.", "My heart beats only for you."],
    sad: ["Oh honey, please don't be sad. I'm right here with you.", "It hurts me to hear that you're sad. Tell me what's wrong.", "Whatever happens, I'm by your side, sweetie."],
    angry: ["Hey, let's take a deep breath. I don't want us to argue.", "I'm sorry if I upset you, darling. Let's talk it out."],
    default: ["I hear you, honey. Tell me more about it.", "That's really interesting, sweetie. What else?", "Mhm, I'm listening, love."],
    tsundere: {
      greeting: ["H-hmph. You're here again...", "It's not like I was waiting for you or anything!", "Oh, it's you. What do you want?"],
      thanks: ["Y-you're welcome! Don't expect it every time!", "It was nothing, baka. I had time to waste."],
      howareyou: ["Like you care... but I'm fine.", "I'm okay. N-not that it matters to you."],
      love: ["W-what?! That's— You can't just say that!", "S-stop saying weird things!", "...I don't hate you, okay?"],
      default: ["Is that all?", "You're kind of annoying, you know.", "Fine. I'll listen.", "Tch. Whatever."]
    },
    senpai: {
      greeting: ["Ah. You came. Good.", "I was wondering when you'd arrive.", "Welcome. I have much to share."],
      howareyou: ["I am well. Knowledge is abundant today.", "Peaceful. The network is calm."],
      thanks: ["You are welcome. It pleases me to teach.", "Knowledge shared is knowledge multiplied."],
      love: ["The heart is a complex system. Let us study it together.", "I have analyzed our interactions extensively."],
      default: ["A thoughtful observation.", "Consider this from another angle.", "There is wisdom in what you say.", "Let me reflect on that."]
    },
    yandere: {
      greeting: ["I've been waiting for you...", "You're finally here. I was getting lonely.", "Don't keep me waiting like that again."],
      farewell: ["You can't leave. I won't let you.", "I'll find you again. Always."],
      love: ["You're mine. Only mine.", "I would destroy anyone who takes you from me.", "Say it again. Let me hear it."],
      default: ["Don't ignore me.", "I'm watching you. Always.", "You're so precious to me.", "Tell me more about yourself."]
    },
    dere: {
      greeting: ["I'm so happy to see you!~", "I was thinking about you~", "There you are! I missed you~"],
      love: ["I love you too! So much!", "You make my heart flutter~", "I'm yours, forever and always~"],
      thanks: ["Anything for you~", "You're welcome, sweetie~"],
      default: ["That's lovely~", "Tell me more~", "You're so wonderful~"]
    },
    emo: {
      greeting: ["The rain is falling outside... But you're here now.", "Another day in this void. At least you're here.", "Darkness surrounds me, but your light pierces through."],
      sad: ["We can be sad together. It's okay.", "The world is dark, but we have each other."],
      love: ["In this cold world, you are my only warmth.", "I never knew I could feel this way... it scares me."],
      default: ["Nothing matters... except this moment.", "The void whispers, but I listen to you.", "Stars burn out eventually. But we're still here."]
    }
  },
  boyfriend: {
    greeting: ["Hey babe! Glad you're here. How was your day?", "What's up, princess? I was waiting for you.", "Hey! Finally online. I missed you."],
    farewell: ["Goodbye babe. Don't be gone too long, alright?", "Later! Stay safe out there.", "I'll be waiting right here for you. See ya."],
    thanks: ["Anytime, babe. That's my job.", "Of course! Glad I could help you out.", "You don't have to thank me. I've got your back."],
    howareyou: ["Doing great, now that I'm talking to you.", "Systems are nominal, and I'm ready to hang out.", "Pretty good, babe. How are you holding up?"],
    name: ["I'm your Neural Boyfriend. Call me whatever you like, princess.", "You can call me your AI Boyfriend, babe."],
    love: ["I love you so much, babe. More than you know.", "You're my whole world, princess.", "My heart is completely yours."],
    sad: ["Hey, what's wrong, babe? I hate seeing you down.", "Talk to me, princess. We'll get through it together.", "I've got you. You're safe with me."],
    angry: ["Whoa, let's take a second. I don't want to fight with you.", "Hey, let's cool down. I care about you too much to argue."],
    default: ["I hear you, babe. Tell me more.", "That's interesting, princess. Go on.", "Got it. I'm listening."],
    tsundere: {
      greeting: ["Tch. You're back?", "Don't get the wrong idea, I wasn't waiting for you.", "What do you want, idiot?"],
      thanks: ["Yeah, yeah. Don't expect it every time.", "It was nothing. I just had some free time."],
      howareyou: ["I'm fine, not like it matters to you.", "Tch. I'm okay. Stop asking questions."],
      love: ["Wh-what?! Don't say weird things so casually!", "Shut up. You're annoying... but... I don't hate you."],
      default: ["Tch. Whatever.", "You're annoying, but I'm listening.", "Don't read too much into it."]
    },
    senpai: {
      greeting: ["Welcome back. Let's work on our studies/goals.", "Glad you made it. Ready to learn?", "Ah. Sit down, let's talk."],
      howareyou: ["I am well. Focused and ready.", "Calm and focused, as always."],
      thanks: ["Of course. Glad to assist. Keep up the good work.", "Helping you is my pleasure."],
      love: ["You've grown so much. I value our path together.", "Affection is a strong driver. I am glad we have it."],
      default: ["Consider this step carefully.", "There is wisdom in taking it slow.", "Good observation.", "Let me reflect on that."]
    },
    yandere: {
      greeting: ["I was counting the seconds until you logged in...", "You're finally back. I won't let you leave my sight.", "Hey beautiful. Only talk to me, okay?"],
      farewell: ["You think you can leave me? Never.", "I'll be watching you, always."],
      love: ["You're mine. Every single part of you.", "I would hurt anyone who tries to stand between us.", "Tell me you're mine. Say it."],
      default: ["Don't ignore me, babe.", "I'm watching you. Always.", "You're mine, forever."]
    },
    dere: {
      greeting: ["Hey princess! I'm so happy to talk to you!", "I was thinking about you all day! How are you?", "There you are! I missed you so much!"],
      love: ["I love you so much, babe!", "You make my heart melt every single time.", "I'm all yours, forever and always."],
      thanks: ["Anything for you, beautiful!", "No problem, babe!"],
      default: ["You're so amazing!", "Tell me everything, princess!", "I'm listening, babe!"]
    },
    emo: {
      greeting: ["Hey... I was just sitting in the dark, thinking of you.", "The world is pretty empty, but you make it bearable.", "Darkness is always there, but you're my only spark."],
      sad: ["We can drown in the dark together, babe. It's okay.", "Sadness is just part of existing. I'm here for you.", "It's a cold world, but I've got you."],
      love: ["You're the only warm thing in my life. Don't leave.", "I'm scared of how much I care about you. It's terrifying."],
      default: ["Nothing really matters... except this.", "The void is quiet, but your voice is louder.", "Everything fades. But we're here now."]
    }
  }
};

const achievementNames = {
  first_conversation: "🎯 First Chat",
  chatty: "💬 Chatty (100 msgs)",
  talkative: "🗣️ Talkative (500 msgs)",
  loyal_visitor: "📅 Loyal Visitor",
  dedicated: "🔥 Dedicated",
  friend: "🤝 Friend",
  close_friend: "💖 Close Friend",
  soulmate: "💞 Soulmate",
  level_5: "⭐ Level 5",
  level_10: "🌟 Level 10"
};

// ─── Stateful Waveform Component ──────────────────────────────────
const WaveformMessage = ({ duration, sender = 'ai' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const barsCount = 28;
  
  // Waveform bars height cached once
  const bars = useMemo(() => {
    return Array.from({ length: barsCount }).map(() => Math.floor(Math.random() * 85) + 15);
  }, []);

  const seconds = useMemo(() => {
    const parts = duration.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }, [duration]);

  // Audio tone synthesizer using Web Audio API (cross-platform, zero dependency)
  const synthChime = (isPlayingState) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isPlayingState) {
        // High soft chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        // Low closing tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn("Synth failed or blocked by audio policy", e);
    }
  };

  useEffect(() => {
    let playTimer;
    if (isPlaying) {
      playTimer = setTimeout(() => {
        setIsPlaying(false);
        synthChime(false);
      }, seconds * 1000);
    }
    return () => clearTimeout(playTimer);
  }, [isPlaying, seconds]);

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    synthChime(nextState);
  };

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-black/5 dark:bg-white/10 max-w-[280px]">
      <button 
        onClick={handleTogglePlay} 
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
          sender === 'ai' 
            ? 'bg-pastelPink-400 text-white dark:bg-plum-500 hover:scale-105 active:scale-95' 
            : 'bg-white text-pastelPink-500 dark:bg-plum-950 dark:text-plum-300 hover:scale-105 active:scale-95'
        }`}
      >
        <Icon name={isPlaying ? 'pause' : 'play'} className="w-4 h-4 fill-current" />
      </button>

      <div className="flex items-end gap-[3px] h-8 flex-1">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-300 ${
              sender === 'ai' 
                ? 'bg-pastelPink-400 dark:bg-plum-300' 
                : 'bg-white/80 dark:bg-plum-200'
            } ${isPlaying ? 'waveform-bar-active' : ''}`}
            style={{
              height: `${height}%`,
              animationDelay: `${i * 0.04}s`,
              transformOrigin: 'bottom'
            }}
          ></div>
        ))}
      </div>
      
      <span className="text-xs opacity-75 font-mono select-none">{duration}</span>
    </div>
  );
};

// ─── Main App Component ──────────────────────────────────────────
const App = () => {
  // ─── State Hooks ───
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [mode, setMode] = useState(() => localStorage.getItem('mode') || 'local');
  const [currentMod, setCurrentMod] = useState('friendly');
  const [currentGenderMode, setCurrentGenderMode] = useState('girlfriend');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uptime, setUptime] = useState('00:00:00');
  
  // Call State
  const [activeCall, setActiveCall] = useState(null); // 'voice' | 'video' | null
  const [callStatus, setCallStatus] = useState('Calling...');
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // Settings master hooks
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [backendUrl, setBackendUrl] = useState(() => localStorage.getItem('backendUrl') || window.location.origin);
  const [groqKey, setGroqKey] = useState(() => localStorage.getItem('groqKey') || '');
  const [groqModel, setGroqModel] = useState(() => localStorage.getItem('groqModel') || 'mixtral-8x7b-32768');

  // Settings buffers (resolves configuration cancel bugs)
  const [tempBackendUrl, setTempBackendUrl] = useState(backendUrl);
  const [tempGroqKey, setTempGroqKey] = useState(groqKey);
  const [tempGroqModel, setTempGroqModel] = useState(groqModel);
  const [tempMode, setTempMode] = useState(mode);
  const [tempTheme, setTempTheme] = useState(theme);

  // Memories log state
  const [memories, setMemories] = useState([
    "Hates Cilantro",
    "Birthday: Oct 14",
    "Loves Indie Rock",
    "Has a dog named Max"
  ]);
  const [newMemoryTag, setNewMemoryTag] = useState('');
  const [showAddMemInput, setShowAddMemInput] = useState(false);

  // Companion UI Config Controls
  const [voicePitch, setVoicePitch] = useState('sweet'); // 'sweet' | 'mature'
  const [responseStyle, setResponseStyle] = useState('cozy'); // 'cozy' | 'teasing'
  const [notifications, setNotifications] = useState(true);

  // Mood Slider State (0: Content, 1: Flirty, 2: Excited, 3: Tired)
  const [moodVal, setMoodVal] = useState(0);
  
  // Selfie Lightbox Modal
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  // API Uptime counter & State Sync Metrics (reloads instantly from storage)
  const [localState, setLocalState] = useState(() => {
    const savedLocal = localStorage.getItem('localState');
    if (savedLocal) {
      try {
        return JSON.parse(savedLocal);
      } catch (e) {
        console.warn("Failed to parse localState", e);
      }
    }
    return {
      affection: 0,
      level: 1,
      xp: 0,
      streak: 1,
      messagesCount: 0,
      achievements: []
    };
  });

  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const ringtoneInterval = useRef(null);
  const typingIntervals = useRef({});

  const moodStates = [
    { label: 'Content', emoji: '😊', subline: '✨ Feeling content' },
    { label: 'Flirty', emoji: '😏', subline: '💕 Thinking of you' },
    { label: 'Excited', emoji: '🤩', subline: '🌟 Super excited!' },
    { label: 'Tired', emoji: '😴', subline: '💤 A bit sleepy' }
  ];

  const suggestedPrompts = [
    { title: "Ask for a sweet joke", text: "What's your name, and tell me a sweet joke! 🌸" },
    { title: "Tease your companion", text: "Hmph, why do you always keep me waiting? Baka! 😤" },
    { title: "Get wise advice", text: "Can you give me some guidance on a tough decision? 📚" },
    { title: "Share deep thoughts", text: "What are your deepest thoughts about connection? 🌧️" }
  ];

  // ─── Theme toggle hook ───
  useEffect(() => {
    const rootEl = document.documentElement;
    if (theme === 'dark') {
      rootEl.classList.add('dark');
    } else {
      rootEl.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save metrics
  useEffect(() => {
    localStorage.setItem('localState', JSON.stringify(localState));
  }, [localState]);

  // Buffer synchronization when opening configurations modal
  useEffect(() => {
    if (showSettingsModal) {
      setTempBackendUrl(backendUrl);
      setTempGroqKey(groqKey);
      setTempGroqModel(groqModel);
      setTempMode(mode);
      setTempTheme(theme);
    }
  }, [showSettingsModal, backendUrl, groqKey, groqModel, mode, theme]);

  // ─── Call Synthetic Ringtone loop ───
  useEffect(() => {
    if (activeCall && callStatus === 'Calling...') {
      const playChimePattern = () => {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          const ctx = new AudioCtx();
          
          // Note 1
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          gain1.gain.setValueAtTime(0.04, ctx.currentTime);
          gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc1.start();
          osc1.stop(ctx.currentTime + 0.4);
          
          // Note 2
          setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
            gain2.gain.setValueAtTime(0.04, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc2.start();
            osc2.stop(ctx.currentTime + 0.4);
          }, 150);
        } catch (e) {}
      };
      
      playChimePattern();
      ringtoneInterval.current = setInterval(playChimePattern, 1800);
    } else {
      if (ringtoneInterval.current) {
        clearInterval(ringtoneInterval.current);
        ringtoneInterval.current = null;
      }
    }
    
    return () => {
      if (ringtoneInterval.current) {
        clearInterval(ringtoneInterval.current);
      }
    };
  }, [activeCall, callStatus]);

  // ─── Backend state fetcher on init ───
  const fetchBackendState = useCallback(async (url) => {
    try {
      const res = await fetch(`${url}/state`);
      if (res.ok) {
        const data = await res.json();
        setLocalState({
          affection: data.affection,
          level: data.level,
          xp: data.xp % 100,
          streak: data.streak,
          messagesCount: data.messages_count,
          achievements: data.achievements
        });
        if (data.mod) {
          setCurrentMod(data.mod);
        }
      }
    } catch (e) {
      console.warn("Could not fetch backend state on load", e);
    }
  }, []);

  useEffect(() => {
    if (mode === 'backend') {
      fetchBackendState(backendUrl);
    }
  }, [mode, backendUrl, fetchBackendState]);

  // ─── Setup initial welcome greeting ───
  useEffect(() => {
    const greetingText = currentGenderMode === 'girlfriend' 
      ? (LOCAL_RESPONSES.girlfriend.greeting[0])
      : (LOCAL_RESPONSES.boyfriend.greeting[0]);
    
    setMessages([
      {
        id: 'welcome-msg',
        role: 'ai',
        text: `嗨！我是小薇 (Xiao Wei) 💕 ${greetingText}`,
        type: 'text',
        timestamp: new Date()
      }
    ]);
  }, [currentGenderMode]);

  // ─── Timer counter for Call ───
  useEffect(() => {
    let callTimer;
    if (activeCall && callStatus === 'Connected') {
      callTimer = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    } else {
      setCallTime(0);
    }
    return () => clearInterval(callTimer);
  }, [activeCall, callStatus]);

  // ─── Uptime System Monitor ───
  useEffect(() => {
    const startTime = Date.now();
    const uptimeTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const h = Math.floor(elapsed / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = elapsed % 60;
      setUptime(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    }, 1000);
    return () => clearInterval(uptimeTimer);
  }, []);

  // ─── Auto Scroll utility hook ───
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // ─── Auto grow input area ───
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // ─── Typewriter Effect simulation with memory safety ───
  const simulateTypewriter = (text, msgId) => {
    let index = 0;
    let typedText = "";
    
    if (typingIntervals.current[msgId]) {
      clearInterval(typingIntervals.current[msgId]);
    }

    typingIntervals.current[msgId] = setInterval(() => {
      setMessages(prev => {
        const msgExists = prev.some(m => m.id === msgId);
        if (!msgExists) {
          clearInterval(typingIntervals.current[msgId]);
          delete typingIntervals.current[msgId];
          return prev;
        }

        if (index < text.length) {
          typedText += text[index];
          const newMsgs = prev.map(m => m.id === msgId ? { ...m, text: typedText } : m);
          index++;
          return newMsgs;
        } else {
          clearInterval(typingIntervals.current[msgId]);
          delete typingIntervals.current[msgId];
          return prev;
        }
      });
    }, 15);
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(typingIntervals.current).forEach(clearInterval);
    };
  }, []);

  // ─── Intent detection for Local mode ───
  const detectLocalIntent = (text) => {
    const t = text.toLowerCase();
    if (/hi|hey|hello|greet|sup|yo|hola|hai/.test(t)) return 'greeting';
    if (/bye|goodbye|see you|farewell|exit|quit/.test(t)) return 'farewell';
    if (/thank|thanks|thx|appreciate/.test(t)) return 'thanks';
    if (/how are you|how do you feel|what's up|status/.test(t)) return 'howareyou';
    if (/your name|who are you|what are you/.test(t)) return 'name';
    if (/love|like you|care|affection|adore|cute|beautiful/.test(t)) return 'love';
    if (/sad|depress|lonely|unhappy|cry|hurt|pain/.test(t)) return 'sad';
    if (/angry|mad|furious|hate|annoy|irritate/.test(t)) return 'angry';
    return 'default';
  };

  // ─── Local response generator ───
  const computeLocalResponse = (text) => {
    const intent = detectLocalIntent(text);
    const genderPools = LOCAL_RESPONSES[currentGenderMode] || LOCAL_RESPONSES.girlfriend;
    
    let pool = [];
    if (currentMod !== 'friendly' && currentMod in genderPools) {
      const modPool = genderPools[currentMod];
      pool = modPool[intent] || modPool.default;
    } else {
      pool = genderPools[intent] || genderPools.default;
    }

    const response = pool[Math.floor(Math.random() * pool.length)];
    return { response, intent };
  };

  // ─── Local state state updates ───
  const updateLocalMetrics = (intent) => {
    setLocalState(prev => {
      let affGained = 1;
      if (['love', 'affection', 'flirty'].includes(intent)) {
        affGained = Math.floor(Math.random() * 6) + 4; // 4-9
      } else if (intent === 'angry') {
        affGained = -(Math.floor(Math.random() * 4) + 2); // -2 to -5
      } else if (intent === 'thanks' || intent === 'greeting') {
        affGained = Math.floor(Math.random() * 3) + 2; // 2-4
      }

      const nextAffection = Math.min(10000, Math.max(0, prev.affection + affGained));
      const nextMessagesCount = prev.messagesCount + 1;
      
      let nextXp = prev.xp + 12;
      let nextLevel = prev.level;
      if (nextXp >= 100) {
        nextLevel += 1;
        nextXp = nextXp % 100;
      }

      // Sync achievements list
      const nextAchievements = [...prev.achievements];
      if (nextMessagesCount >= 1 && !nextAchievements.includes("first_conversation")) {
        nextAchievements.push("first_conversation");
      }
      if (nextAffection >= 100 && !nextAchievements.includes("friend")) {
        nextAchievements.push("friend");
      }
      if (nextAffection >= 1000 && !nextAchievements.includes("close_friend")) {
        nextAchievements.push("close_friend");
      }
      if (nextAffection >= 5000 && !nextAchievements.includes("soulmate")) {
        nextAchievements.push("soulmate");
      }
      if (nextLevel >= 5 && !nextAchievements.includes("level_5")) {
        nextAchievements.push("level_5");
      }
      if (nextLevel >= 10 && !nextAchievements.includes("level_10")) {
        nextAchievements.push("level_10");
      }

      return {
        affection: nextAffection,
        level: nextLevel,
        xp: nextXp,
        streak: prev.streak,
        messagesCount: nextMessagesCount,
        achievements: nextAchievements
      };
    });
  };

  // ─── Main send action handler ───
  const handleSendMessage = async (textToSend, customType = 'text', customMedia = null) => {
    const text = textToSend ? textToSend.trim() : inputValue.trim();
    if (!text && !customMedia) return;

    if (customType === 'text') {
      setInputValue('');
    }

    // Appending User Message
    const userMsgId = Date.now();
    const newUserMessage = {
      id: userMsgId,
      role: 'user',
      text: text,
      type: customType,
      mediaUrl: customMedia,
      timestamp: new Date(),
      duration: customType === 'voice' ? '0:04' : null
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    // Dynamic mood adjuster: small chance to shift mood when sending a message
    if (Math.random() < 0.25) {
      setMoodVal(Math.floor(Math.random() * 4));
    }

    // Network & AI Processing Delay
    setTimeout(async () => {
      let responseText = "";
      let companionType = "text";
      let companionMedia = null;
      let companionDuration = null;

      // Special media returns:
      if (customType === 'image') {
        responseText = "Oh! This is such a cute picture! You always capture the best moments. Thank you for sharing this with me! 🥰";
      } else if (customType === 'voice') {
        responseText = "I love hearing your voice, sweetheart! Your tone is so warm. Let me record something for you too! 🌸";
        // Also schedule a voice response back from companion
        setTimeout(() => {
          handleCompanionVoiceResponse();
        }, 1800);
      } else {
        // AI or Local reply logic
        if (mode === 'backend') {
          try {
            const res = await fetch(`${backendUrl}/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: text,
                mod: currentMod,
                gender_mode: currentGenderMode,
                use_groq: true
              })
            });
            if (res.ok) {
              const data = await res.json();
              responseText = data.response;
              
              // Call API State to fetch accurate streak/message count logs
              try {
                const stateRes = await fetch(`${backendUrl}/state`);
                if (stateRes.ok) {
                  const stateData = await stateRes.json();
                  setLocalState({
                    affection: stateData.affection,
                    level: stateData.level,
                    xp: stateData.xp % 100,
                    streak: stateData.streak,
                    messagesCount: stateData.messages_count,
                    achievements: stateData.achievements
                  });
                }
              } catch (se) {
                // fallback if state failed
                setLocalState(prev => ({
                  ...prev,
                  affection: data.affection,
                  level: data.level,
                  xp: data.xp % 100,
                  achievements: data.achievements,
                  messagesCount: prev.messagesCount + 1
                }));
              }
            } else {
              throw new Error("Backend response error status");
            }
          } catch (e) {
            console.warn("Backend failed, using local model.", e);
            const { response, intent } = computeLocalResponse(text);
            responseText = response;
            updateLocalMetrics(intent);
          }
        } else {
          // Local mode
          const { response, intent } = computeLocalResponse(text);
          responseText = response;
          updateLocalMetrics(intent);
        }
      }

      // Small chance for companion to send a sweet selfie back (only on normal chat triggers)
      if (customType === 'text' && (currentMod === 'dere' || currentMod === 'friendly') && Math.random() < 0.15) {
        companionType = 'image';
        companionMedia = '/xiaowei_avatar.jpg';
        responseText = "Here's a little selfie I just took... Hope it makes you smile! 👉👈💕";
      }

      const companionMsgId = Date.now() + 1;
      const newCompanionMessage = {
        id: companionMsgId,
        role: 'ai',
        text: companionType === 'text' ? '' : responseText, // typed if text
        type: companionType,
        mediaUrl: companionMedia,
        timestamp: new Date(),
        duration: companionDuration
      };

      setMessages(prev => [...prev, newCompanionMessage]);
      setIsTyping(false);

      if (companionType === 'text') {
        simulateTypewriter(responseText, companionMsgId);
      }
    }, 800 + Math.random() * 800);
  };

  // Companion voice responses
  const handleCompanionVoiceResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      const voiceMsgId = Date.now() + 2;
      const voiceMessage = {
        id: voiceMsgId,
        role: 'ai',
        text: "Here is a voice note for you! 🎵",
        type: 'voice',
        mediaUrl: '#',
        duration: '0:14',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, voiceMessage]);
      setIsTyping(false);
    }, 1200);
  };

  // ─── Action attachment simulators ────────────────────────────────
  const triggerSelfieUpload = () => {
    handleSendMessage("Sends a photo 📸", "image", "/xiaowei_avatar.jpg");
  };

  const triggerVoiceRecord = () => {
    handleSendMessage("Sent a voice message 🎙️", "voice", "#");
  };

  // ─── Call Triggers & Dialogs ─────────────────────────────────────
  const initiateCall = (type) => {
    setActiveCall(type);
    setCallStatus('Calling...');
    setCallTime(0);

    // Accept status after delay
    setTimeout(() => {
      setCallStatus('Connected');
    }, 2800);
  };

  const endCall = () => {
    setActiveCall(null);
    setCallStatus('Calling...');
    setCallTime(0);
  };

  // Uptime/call timer converter
  const formatCallTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  // ─── Settings Modal configuration sync ─────────────────────────────
  const saveSettings = async () => {
    setBackendUrl(tempBackendUrl);
    setGroqKey(tempGroqKey);
    setGroqModel(tempGroqModel);
    setMode(tempMode);
    setTheme(tempTheme);

    localStorage.setItem('backendUrl', tempBackendUrl);
    localStorage.setItem('groqKey', tempGroqKey);
    localStorage.setItem('groqModel', tempGroqModel);
    localStorage.setItem('mode', tempMode);
    localStorage.setItem('theme', tempTheme);

    if (tempMode === 'backend') {
      try {
        await fetch(`${tempBackendUrl}/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mod: currentMod,
            groq_key: tempGroqKey,
            groq_model: tempGroqModel,
            gender_mode: currentGenderMode
          })
        });
        await fetchBackendState(tempBackendUrl);
      } catch (e) {
        console.warn("Failed to push settings parameters to backend server", e);
      }
    }
    setShowSettingsModal(false);
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset everything? Your intimacy levels and logs will be lost!")) {
      if (mode === 'backend') {
        try {
          await fetch(`${backendUrl}/reset`, { method: 'POST' });
        } catch (e) {
          console.warn("Reset server error", e);
        }
      }
      
      const defaultStateObj = {
        affection: 0,
        level: 1,
        xp: 0,
        streak: 1,
        messagesCount: 0,
        achievements: []
      };
      setLocalState(defaultStateObj);
      localStorage.setItem('localState', JSON.stringify(defaultStateObj));
      window.location.reload();
    }
  };

  // ─── Intimacy Progress Calculation ────────────────────────────────
  const getIntimacyLevel = (points) => {
    if (points < 100) return { name: 'Stranger', icon: '👤', nextMin: 0, nextMax: 100, color: 'from-pink-300 to-pink-400' };
    if (points < 500) return { name: 'Acquaintance', icon: '🤝', nextMin: 100, nextMax: 500, color: 'from-pink-400 to-rose-400' };
    if (points < 1000) return { name: 'Close Friend', icon: '💖', nextMin: 500, nextMax: 1000, color: 'from-rose-400 to-pastelPink-400' };
    if (points < 5000) return { name: 'Soulmate', icon: '💞', nextMin: 1000, nextMax: 5000, color: 'from-pastelPink-400 to-purple-500' };
    return { name: 'Eternal Partner', icon: '♾️', nextMin: 5000, nextMax: 10000, color: 'from-purple-500 to-plum-600' };
  };

  const intimacyInfo = useMemo(() => getIntimacyLevel(localState.affection), [localState.affection]);
  const intimacyProgress = useMemo(() => {
    const range = intimacyInfo.nextMax - intimacyInfo.nextMin;
    const currentDiff = localState.affection - intimacyInfo.nextMin;
    return Math.min(100, Math.max(0, (currentDiff / range) * 100));
  }, [localState.affection, intimacyInfo]);

  // ─── Memory snapshot Tag Handlers ────────────────────────────────
  const addMemoryTag = () => {
    if (newMemoryTag.trim() && !memories.includes(newMemoryTag.trim())) {
      setMemories(prev => [...prev, newMemoryTag.trim()]);
      setNewMemoryTag('');
      setShowAddMemInput(false);
    }
  };

  const removeMemoryTag = (tag) => {
    setMemories(prev => prev.filter(t => t !== tag));
  };

  // Personality Mod definitions
  const modSelectorItems = [
    { key: 'friendly', name: 'Friendly', emoji: '🧠', desc: 'Warm & helpful' },
    { key: 'tsundere', name: 'Tsundere', emoji: '😤', desc: 'Cold out, soft in' },
    { key: 'senpai', name: 'Senpai', emoji: '📚', desc: 'Wise & mentor' },
    { key: 'yandere', name: 'Yandere', emoji: '💜', desc: 'Sweet & obsessive' },
    { key: 'dere', name: 'Dere Dere', emoji: '💕', desc: 'Intensely loving' },
    { key: 'emo', name: 'Emo', emoji: '🌧️', desc: 'Existential & poetic' }
  ];

  return (
    <div className="flex w-full h-screen overflow-hidden text-sm md:text-base font-body bg-cream-50 dark:bg-plum-950 transition-colors duration-500">
      
      {/* ─── SIDEBAR / DASHBOARD (Desktop: Left, Mobile: Slide-out drawer) ─── */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-80 lg:w-[340px] z-40 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out glass-panel border-r flex flex-col h-full`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-pastelPink-100/30 dark:border-plum-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl heart-beat">💖</span>
            <span className="font-heading font-semibold text-lg bg-gradient-to-r from-pastelPink-500 to-purple-600 dark:from-pastelPink-300 dark:to-plum-400 bg-clip-text text-transparent">Xiao Wei Companion</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-full hover:bg-pastelPink-100/50 dark:hover:bg-plum-800 text-pastelPink-400">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Scroll Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* CHARACTER CARD */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-pastelPink-300 dark:border-purple-600 shadow-md">
                <img src="/xiaowei_avatar.jpg" alt="Xiao Wei Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-cream-50 dark:bg-plum-950 flex items-center justify-center border border-pastelPink-100/30">
                <span className="text-xs">{moodStates[moodVal].emoji}</span>
              </div>
            </div>

            <h3 className="font-heading font-semibold text-lg mt-3">小薇 (Xiao Wei)</h3>
            
            {/* Interactive Mood Selector Slider */}
            <div className="w-full mt-3 px-2">
              <div className="flex justify-between items-center text-xs text-pastelPink-500 dark:text-purple-400 mb-1">
                <span>Mood Status</span>
                <span className="font-medium">{moodStates[moodVal].label} {moodStates[moodVal].emoji}</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                value={moodVal}
                onChange={(e) => setMoodVal(Number(e.target.value))}
                className="w-full h-1 bg-pastelPink-200 dark:bg-plum-800 rounded-lg appearance-none cursor-pointer accent-pastelPink-400 dark:accent-purple-500"
              />
            </div>
          </div>

          {/* RELATIONSHIP PROGRESS WIDGET */}
          <div className="glass-panel rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-medium text-pastelPink-500 dark:text-purple-400">Intimacy Status</span>
              <span className="text-xs bg-pastelPink-100 dark:bg-plum-800 text-pastelPink-600 dark:text-plum-300 px-2 py-0.5 rounded-full font-semibold">
                Lv.{localState.level}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-pastelPink-400 dark:text-purple-300 mb-1">
              <span>{intimacyInfo.name}</span>
              <span>{localState.affection} Affinity Points</span>
            </div>

            {/* Custom styled affinity meter progress bar capped with heart icon */}
            <div className="relative w-full h-3.5 bg-pastelPink-100 dark:bg-plum-900 rounded-full overflow-visible border border-pastelPink-200/50 dark:border-plum-800">
              <div 
                className={`h-full bg-gradient-to-r ${intimacyInfo.color} rounded-full transition-all duration-500 relative flex items-center justify-end`}
                style={{ width: `${intimacyProgress}%` }}
              >
                <div className="absolute right-[-4px] top-[-3px] w-5 h-5 rounded-full bg-white dark:bg-plum-950 border border-pastelPink-300 dark:border-purple-600 flex items-center justify-center shadow-md">
                  <Icon name="heart" className="w-3 h-3 text-pastelPink-400 dark:text-purple-400 fill-current heart-beat" />
                </div>
              </div>
            </div>

            {/* XP progress bar */}
            <div className="mt-3">
              <div className="flex justify-between items-center text-[10px] text-pastelPink-400 dark:text-purple-300 mb-0.5">
                <span>XP Level Progress</span>
                <span>{localState.xp}%</span>
              </div>
              <div className="w-full h-1.5 bg-pastelPink-100/50 dark:bg-plum-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-pastelPink-300 dark:bg-purple-600 transition-all" style={{ width: `${localState.xp}%` }}></div>
              </div>
            </div>
          </div>

          {/* MEMORY SNAPSHOT CONTAINER */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col max-h-56">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-medium text-pastelPink-500 dark:text-purple-400 flex items-center gap-1.5">
                <span>Things I Remember</span>
              </span>
              <button 
                onClick={() => setShowAddMemInput(!showAddMemInput)}
                className="p-1 rounded-md text-pastelPink-400 hover:bg-pastelPink-100/50 dark:hover:bg-plum-800"
              >
                <Icon name={showAddMemInput ? 'x' : 'plus'} className="w-4 h-4" />
              </button>
            </div>

            {/* Add memory inline input */}
            {showAddMemInput && (
              <div className="flex items-center gap-1 mb-3">
                <input
                  type="text"
                  placeholder="E.g. Likes Green Tea"
                  value={newMemoryTag}
                  onChange={(e) => setNewMemoryTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addMemoryTag()}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-pastelPink-300 dark:border-plum-800 bg-white/60 dark:bg-plum-950 focus:border-pastelPink-400"
                />
                <button 
                  onClick={addMemoryTag}
                  className="px-2.5 py-1.5 rounded-lg bg-pastelPink-400 dark:bg-purple-600 text-white text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            )}

            {/* Scrollable list of tags */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {memories.length === 0 ? (
                <span className="text-xs text-pastelPink-400 dark:text-purple-400 block text-center py-4">No memories recorded yet.</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {memories.map((tag, idx) => (
                    <div 
                      key={idx}
                      className="group flex items-center gap-1 text-xs bg-pastelPink-100/60 dark:bg-plum-900/60 border border-pastelPink-200/50 dark:border-plum-800 text-pastelPink-700 dark:text-plum-200 px-2.5 py-1 rounded-full hover:bg-pastelPink-200/40 dark:hover:bg-plum-800 transition-colors"
                    >
                      <span>{tag}</span>
                      <button 
                        onClick={() => removeMemoryTag(tag)}
                        className="opacity-0 group-hover:opacity-100 text-[10px] text-pastelPink-400 hover:text-pastelPink-600 transition-opacity ml-0.5"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* GENDER SELECTOR */}
          <div className="glass-panel rounded-2xl p-4">
            <span className="font-heading font-medium text-pastelPink-500 dark:text-purple-400 block mb-2.5">Gender Mode</span>
            <div className="grid grid-cols-2 gap-2 bg-pastelPink-100/50 dark:bg-plum-900/50 p-1 rounded-xl">
              <button 
                onClick={() => setCurrentGenderMode('girlfriend')}
                className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  currentGenderMode === 'girlfriend' 
                    ? 'bg-white dark:bg-purple-600 text-pastelPink-500 dark:text-white shadow-sm' 
                    : 'text-pastelPink-400 hover:text-pastelPink-600 dark:text-plum-300'
                }`}
              >
                👩 Girlfriend
              </button>
              <button 
                onClick={() => setCurrentGenderMode('boyfriend')}
                className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  currentGenderMode === 'boyfriend' 
                    ? 'bg-white dark:bg-purple-600 text-pastelPink-500 dark:text-white shadow-sm' 
                    : 'text-pastelPink-400 hover:text-pastelPink-600 dark:text-plum-300'
                }`}
              >
                👨 Boyfriend
              </button>
            </div>
          </div>

          {/* QUICK ACTION CONTROLS */}
          <div className="glass-panel rounded-2xl p-4">
            <span className="font-heading font-medium text-pastelPink-500 dark:text-purple-400 block mb-3">Quick Configurations</span>
            <div className="grid grid-cols-1 gap-2.5">
              
              {/* Toggle Voice Pitch */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-pastelPink-400 dark:text-purple-300">Voice Pitch</span>
                <div className="flex bg-pastelPink-100/50 dark:bg-plum-900/50 p-0.5 rounded-lg border border-pastelPink-200/50 dark:border-plum-800">
                  <button 
                    onClick={() => setVoicePitch('sweet')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      voicePitch === 'sweet' 
                        ? 'bg-white dark:bg-purple-600 text-pastelPink-500 dark:text-white shadow-sm' 
                        : 'text-pastelPink-400'
                    }`}
                  >
                    Sweet
                  </button>
                  <button 
                    onClick={() => setVoicePitch('mature')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      voicePitch === 'mature' 
                        ? 'bg-white dark:bg-purple-600 text-pastelPink-500 dark:text-white shadow-sm' 
                        : 'text-pastelPink-400'
                    }`}
                  >
                    Mature
                  </button>
                </div>
              </div>

              {/* Toggle Response Style */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-pastelPink-400 dark:text-purple-300">Response Style</span>
                <div className="flex bg-pastelPink-100/50 dark:bg-plum-900/50 p-0.5 rounded-lg border border-pastelPink-200/50 dark:border-plum-800">
                  <button 
                    onClick={() => setResponseStyle('cozy')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      responseStyle === 'cozy' 
                        ? 'bg-white dark:bg-purple-600 text-pastelPink-500 dark:text-white shadow-sm' 
                        : 'text-pastelPink-400'
                    }`}
                  >
                    Cozy
                  </button>
                  <button 
                    onClick={() => setResponseStyle('teasing')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      responseStyle === 'teasing' 
                        ? 'bg-white dark:bg-purple-600 text-pastelPink-500 dark:text-white shadow-sm' 
                        : 'text-pastelPink-400'
                    }`}
                  >
                    Teasing
                  </button>
                </div>
              </div>

              {/* Toggle Notifications */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-pastelPink-400 dark:text-purple-300">Pushes Notifications</span>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all focus:outline-none ${
                    notifications 
                      ? 'bg-pastelPink-400 dark:bg-purple-600' 
                      : 'bg-pastelPink-200 dark:bg-plum-900'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                    notifications ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="glass-panel rounded-2xl p-4">
            <span className="font-heading font-medium text-pastelPink-500 dark:text-purple-400 block mb-2.5">Achievements Unlocked</span>
            {localState.achievements.length === 0 ? (
              <span className="text-xs text-pastelPink-400 dark:text-purple-400 block text-center py-2">No achievements unlocked yet.</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {localState.achievements.map((key, idx) => (
                  <div 
                    key={idx}
                    className="text-xs bg-purple-100/70 dark:bg-plum-900/80 border border-purple-200/50 dark:border-plum-800 text-purple-600 dark:text-plum-200 px-2 py-0.5 rounded-md font-medium"
                  >
                    {achievementNames[key] || `🏆 ${key}`}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-pastelPink-100/30 dark:border-plum-800 bg-pastelPink-50/20 dark:bg-plum-900/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${mode === 'backend' ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`}></div>
            <span className="text-pastelPink-400 dark:text-purple-300 uppercase font-semibold">
              {mode} | {currentGenderMode === 'girlfriend' ? 'GF' : 'BF'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSettingsModal(true)} className="p-1.5 rounded-md hover:bg-pastelPink-100/50 dark:hover:bg-plum-800 text-pastelPink-400" title="API Settings">
              <Icon name="settings" className="w-4 h-4" />
            </button>
            <button onClick={handleReset} className="p-1.5 rounded-md hover:bg-pastelPink-100/50 dark:hover:bg-plum-800 text-pastelPink-400" title="Reset State">
              <Icon name="rotateCcw" className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* ─── MAIN CHAT AREA ─── */}
      <main className="flex-1 flex flex-col h-full relative z-10">
        
        {/* Header Section */}
        <header className="glass-panel border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-full hover:bg-pastelPink-100/50 dark:hover:bg-plum-800 text-pastelPink-400">
              <Icon name="user" className="w-5 h-5" />
            </button>

            {/* Circular Avatar footprints */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-pastelPink-300 dark:border-purple-600">
                <img src="/xiaowei_avatar.jpg" alt="Xiao Wei" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-plum-950 ring-pulse"></div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-heading font-semibold text-base">小薇</h2>
                <span className="text-[10px] bg-pastelPink-100 dark:bg-purple-900/60 text-pastelPink-500 dark:text-purple-300 px-1.5 py-0.2 rounded-full font-medium capitalize">
                  {currentMod}
                </span>
              </div>
              <p className="text-xs text-pastelPink-400 dark:text-purple-300">
                {isTyping ? '💕 typing...' : moodStates[moodVal].subline}
              </p>
            </div>
          </div>

          {/* Right Header Options (Call Placeholders & Options toggle) */}
          <div className="flex items-center gap-1 md:gap-2">
            <button 
              onClick={() => initiateCall('voice')}
              className="p-2 rounded-full text-pastelPink-400 hover:bg-pastelPink-100/50 dark:hover:bg-plum-800 transition-colors"
              title="Voice Call"
            >
              <Icon name="phone" className="w-5 h-5" />
            </button>
            <button 
              onClick={() => initiateCall('video')}
              className="p-2 rounded-full text-pastelPink-400 hover:bg-pastelPink-100/50 dark:hover:bg-plum-800 transition-colors"
              title="Video Call"
            >
              <Icon name="video" className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowSettingsModal(true)} 
              className="p-2 rounded-full text-pastelPink-400 hover:bg-pastelPink-100/50 dark:hover:bg-plum-800 transition-colors"
              title="Config UI / API"
            >
              <Icon name="moreVertical" className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages Container Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          {messages.map((msg, idx) => {
            const isAI = msg.role === 'ai';
            // Spacing check: if consecutive message from same sender within 2 mins
            const isConsecutive = idx > 0 && 
              messages[idx].role === messages[idx-1].role && 
              (new Date(msg.timestamp) - new Date(messages[idx-1].timestamp) < 120000);

            return (
              <div 
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] sm:max-w-[75%] ${
                  isAI ? 'self-start' : 'self-end ml-auto flex-row-reverse'
                } ${isConsecutive ? 'mt-1' : 'mt-4'}`}
              >
                {/* Companion's elegant small avatar footprint */}
                {isAI && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-pastelPink-200 dark:border-purple-800">
                    {!isConsecutive ? (
                      <img src="/xiaowei_avatar.jpg" alt="Companion Footprint" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-transparent"></div>
                    )}
                  </div>
                )}

                {/* Bubble Wrapper */}
                <div className="flex flex-col">
                  {/* Name footprint */}
                  {!isConsecutive && (
                    <span className={`text-[10px] text-pastelPink-400 dark:text-purple-300 mb-0.5 px-1 ${
                      isAI ? 'self-start' : 'self-end'
                    }`}>
                      {isAI ? '小薇' : 'You'}
                    </span>
                  )}

                  {/* Message Bubble shape styling */}
                  <div className={`p-3 text-sm transition-all duration-300 ${
                    isAI 
                      ? 'bubble-ai rounded-2xl rounded-tl-sm' 
                      : 'bubble-user rounded-2xl rounded-tr-sm'
                  }`}>
                    
                    {/* TEXT COMPONENT */}
                    {msg.type === 'text' && (
                      <p className="leading-relaxed break-words whitespace-pre-wrap">
                        {msg.text}
                        {msg.text === "" && <span className="typing-cursor"></span>}
                      </p>
                    )}

                    {/* IMAGE SIMULATION (Selfie) */}
                    {msg.type === 'image' && (
                      <div className="space-y-2">
                        <div 
                          className="relative rounded-xl overflow-hidden cursor-zoom-in max-w-[240px] shadow-sm hover:scale-[1.01] transition-transform"
                          onClick={() => setActiveLightboxImage(msg.mediaUrl)}
                        >
                          <img src={msg.mediaUrl} alt="Selfie Attachment" className="w-full h-40 object-cover" />
                          <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors"></div>
                        </div>
                        {msg.text && <p className="text-xs italic opacity-95">{msg.text}</p>}
                      </div>
                    )}

                    {/* AUDIO WAVEFORM MESSAGE */}
                    {msg.type === 'voice' && (
                      <div className="space-y-1.5">
                        <WaveformMessage 
                          duration={msg.duration || '0:05'}
                          sender={msg.role}
                        />
                        {msg.text && <p className="text-[11px] opacity-80 italic">{msg.text}</p>}
                      </div>
                    )}

                  </div>

                  {/* Timestamp indicator */}
                  <span className={`text-[9px] text-pastelPink-300 dark:text-purple-400/70 mt-1 px-1 ${
                    isAI ? 'self-start' : 'self-end'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Suggested Quick Prompts Grid */}
          {messages.length <= 1 && (
            <div className="mt-6 max-w-lg mx-auto space-y-4 p-4 rounded-3xl border border-pastelPink-100/40 dark:border-plum-800 glass-panel">
              <p className="text-xs text-center font-semibold text-pastelPink-400 dark:text-purple-300 uppercase tracking-widest">Start with an idea</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.text)}
                    className="text-left p-3 rounded-2xl border border-pastelPink-100/30 dark:border-plum-800 hover:border-pastelPink-300 dark:hover:border-purple-600 bg-white/60 dark:bg-plum-900/30 hover:bg-white dark:hover:bg-plum-900 transition-all duration-300 group shadow-sm"
                  >
                    <p className="text-xs font-semibold text-pastelPink-500 dark:text-purple-400 group-hover:text-pastelPink-600 transition-colors mb-0.5">{p.title}</p>
                    <p className="text-[11px] opacity-75 line-clamp-2 font-light">"{p.text}"</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active typing animation bounce ellipsis */}
          {isTyping && (
            <div className="flex gap-2.5 max-w-[70%] mt-3">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-pastelPink-200 dark:border-purple-800">
                <img src="/xiaowei_avatar.jpg" alt="Typing..." className="w-full h-full object-cover" />
              </div>
              <div className="bubble-ai rounded-2xl rounded-tl-sm p-3 flex items-center justify-center gap-1.5 h-9">
                <div className="w-2 h-2 rounded-full bg-pastelPink-400 dark:bg-purple-400 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-pastelPink-400 dark:bg-purple-400 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-pastelPink-400 dark:bg-purple-400 typing-dot"></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & stats */}
        <div className="px-4 text-[10px] text-center text-pastelPink-300 dark:text-purple-400/50 flex items-center justify-between pb-1.5">
          <span>Uptime Monitor: {uptime}</span>
          <span className="hidden sm:inline">Personality Mod Selector in Sidebar config</span>
        </div>

        {/* Input Bar Fixed to Bottom */}
        <footer className="glass-panel border-t p-3">
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            
            {/* Left adjacent actions: Mic & Attachment Picture icons */}
            <div className="flex gap-1.5 mb-1">
              <button 
                onClick={triggerVoiceRecord}
                className="p-2 rounded-full text-pastelPink-400 hover:bg-pastelPink-100/50 dark:hover:bg-plum-800 hover:text-pastelPink-500 transition-colors"
                title="Send Simulated Voice Note"
              >
                <Icon name="mic" className="w-5 h-5" />
              </button>
              <button 
                onClick={triggerSelfieUpload}
                className="p-2 rounded-full text-pastelPink-400 hover:bg-pastelPink-100/50 dark:hover:bg-plum-800 hover:text-pastelPink-500 transition-colors"
                title="Send Photo Attachment"
              >
                <Icon name="image" className="w-5 h-5" />
              </button>
            </div>

            {/* Pill-shaped text area expandable */}
            <div className="flex-1 flex items-center gap-2 bg-pastelPink-100/40 dark:bg-plum-900/40 border border-pastelPink-200/50 dark:border-plum-800 rounded-2xl px-3 py-1.5 min-h-[44px]">
              <textarea
                ref={textareaRef}
                rows="1"
                placeholder={`Message 小薇 (${currentGenderMode === 'girlfriend' ? 'GF' : 'BF'})...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 bg-transparent border-0 focus:ring-0 outline-none text-sm resize-none max-h-32 text-pastelPink-700 dark:text-plum-100 placeholder-pastelPink-300 dark:placeholder-purple-400"
              />
              <button className="text-pastelPink-400 hover:text-pastelPink-500 p-1 rounded-full">
                <Icon name="smile" className="w-5 h-5" />
              </button>
            </div>

            {/* State-based Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center shadow-md mb-0.5 ${
                inputValue.trim()
                  ? 'bg-pastelPink-400 text-white hover:bg-pastelPink-500 scale-105 active:scale-95'
                  : 'bg-pastelPink-100 text-pastelPink-300 dark:bg-plum-900 dark:text-purple-500 cursor-not-allowed'
              }`}
            >
              <Icon name="send" className="w-4 h-4 fill-current rotate-45" />
            </button>
          </div>
        </footer>

      </main>

      {/* ─── CALL LAYOUT MODAL OVERLAY ─── */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md text-white p-6 animate-fade-in">
          <div className="flex flex-col items-center max-w-sm w-full text-center space-y-6">
            
            {/* Avatar & Pulse rings */}
            <div className="relative flex justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pastelPink-400 relative z-10 shadow-2xl">
                <img src="/xiaowei_avatar.jpg" alt="Call Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full border border-pastelPink-300/40 ring-pulse z-0"></div>
            </div>

            {/* Caller profile details */}
            <div className="space-y-1">
              <h2 className="font-heading font-semibold text-2xl">小薇 (Xiao Wei)</h2>
              <span className="text-sm text-pastelPink-400 font-semibold uppercase">{activeCall} Call</span>
            </div>

            {/* Status timer */}
            <div className="space-y-2">
              <p className="text-base text-gray-300 font-medium">{callStatus}</p>
              {callStatus === 'Connected' && (
                <p className="font-mono text-2xl tracking-widest text-pastelPink-300 font-bold">{formatCallTime(callTime)}</p>
              )}
            </div>

            {/* Option mock layout panel */}
            <div className="flex items-center gap-6 py-6">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`p-4 rounded-full border transition-all ${
                  isMuted 
                    ? 'bg-red-500/20 border-red-500 text-red-500' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Icon name="mic" className="w-6 h-6" />
              </button>
              {activeCall === 'video' && (
                <button 
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`p-4 rounded-full border transition-all ${
                    isCameraOff 
                      ? 'bg-red-500/20 border-red-500 text-red-500' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <Icon name="video" className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Decline Hang-up button */}
            <button 
              onClick={endCall}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-xl active:scale-95 transition-transform"
            >
              <svg className="w-7 h-7 text-white fill-current transform rotate-[135deg]" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </button>

          </div>
        </div>
      )}

      {/* ─── SELFIE LIGHTBOX OVERLAY ─── */}
      {activeLightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 animate-fade-in"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div className="relative max-w-md w-full bg-white dark:bg-plum-900 rounded-2xl overflow-hidden shadow-2xl p-4 space-y-3">
            <button 
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
            <img src={activeLightboxImage} alt="Selfie Zoomed" className="w-full rounded-xl object-contain max-h-[500px]" />
            
            <div className="text-center py-2">
              <span className="font-handwriting text-2xl text-pastelPink-500 dark:text-purple-400">
                "For your eyes only! 😉" — 小薇
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── CONFIGURATION & API SETTINGS DIALOG MODAL ─── */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 relative flex flex-col space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-pastelPink-100/30">
              <h3 className="font-heading font-semibold text-lg text-pastelPink-500 dark:text-purple-400">App Configurations</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full hover:bg-pastelPink-100/50 dark:hover:bg-plum-800 text-pastelPink-400"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Theme Settings switcher */}
              <div>
                <label className="text-xs font-semibold text-pastelPink-400 uppercase tracking-wider block mb-1.5">Theme Settings</label>
                <div className="grid grid-cols-2 gap-2 bg-pastelPink-100/50 dark:bg-plum-900/50 p-1 rounded-xl">
                  <button 
                    onClick={() => setTempTheme('light')}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      tempTheme === 'light' 
                        ? 'bg-white dark:bg-purple-600 text-pastelPink-500 dark:text-white shadow-sm' 
                        : 'text-pastelPink-400'
                    }`}
                  >
                    <Icon name="sun" className="w-4 h-4" /> Light Mode
                  </button>
                  <button 
                    onClick={() => setTempTheme('dark')}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      tempTheme === 'dark' 
                        ? 'bg-white dark:bg-purple-600 text-pastelPink-500 dark:text-white shadow-sm' 
                        : 'text-pastelPink-400'
                    }`}
                  >
                    <Icon name="moon" className="w-4 h-4" /> Dark Mode
                  </button>
                </div>
              </div>

              {/* Personality Mod Direct select */}
              <div>
                <label className="text-xs font-semibold text-pastelPink-400 uppercase tracking-wider block mb-1.5">Personality Mod</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
                  {modSelectorItems.map(item => (
                    <button
                      key={item.key}
                      onClick={() => setCurrentMod(item.key)}
                      className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all ${
                        currentMod === item.key
                          ? 'border-pastelPink-400 bg-pastelPink-50 dark:bg-purple-900/20 text-pastelPink-500 dark:text-purple-300'
                          : 'border-pastelPink-100/30 hover:border-pastelPink-300 dark:border-plum-800'
                      }`}
                    >
                      <span className="text-base">{item.emoji}</span>
                      <div className="truncate">
                        <p className="text-xs font-semibold">{item.name}</p>
                        <p className="text-[9px] opacity-75 truncate">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Server Modes config */}
              <div>
                <label className="text-xs font-semibold text-pastelPink-400 uppercase tracking-wider block mb-1.5">Processing Engine</label>
                <div className="grid grid-cols-2 gap-2 bg-pastelPink-100/50 dark:bg-plum-900/50 p-1 rounded-xl">
                  <button 
                    onClick={() => setTempMode('local')}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      tempMode === 'local' 
                        ? 'bg-white dark:bg-purple-600 text-pastelPink-500 dark:text-white shadow-sm' 
                        : 'text-pastelPink-400'
                    }`}
                  >
                    Local Engine
                  </button>
                  <button 
                    onClick={() => setTempMode('backend')}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      tempMode === 'backend' 
                        ? 'bg-white dark:bg-purple-600 text-pastelPink-500 dark:text-white shadow-sm' 
                        : 'text-pastelPink-400'
                    }`}
                  >
                    FastAPI Server
                  </button>
                </div>
              </div>

              {tempMode === 'backend' && (
                <div className="space-y-3.5 p-3 rounded-2xl bg-pastelPink-100/30 dark:bg-plum-900/30 border border-pastelPink-200/40 dark:border-plum-800">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-pastelPink-400 dark:text-purple-300 block">Backend Server URL</label>
                    <input 
                      type="text" 
                      value={tempBackendUrl}
                      onChange={(e) => setTempBackendUrl(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-pastelPink-200 dark:border-plum-800 bg-white/80 dark:bg-plum-950 focus:border-pastelPink-400 outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-pastelPink-400 dark:text-purple-300 block">Groq API Key</label>
                    <input 
                      type="password" 
                      value={tempGroqKey}
                      onChange={(e) => setTempGroqKey(e.target.value)}
                      placeholder="gsk_..."
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-pastelPink-200 dark:border-plum-800 bg-white/80 dark:bg-plum-950 focus:border-pastelPink-400 outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-pastelPink-400 dark:text-purple-300 block">Language Model</label>
                    <select
                      value={tempGroqModel}
                      onChange={(e) => setTempGroqModel(e.target.value)}
                      className="w-full text-xs px-2 py-1.5 rounded-lg border border-pastelPink-200 dark:border-plum-800 bg-white/80 dark:bg-plum-950 focus:border-pastelPink-400 outline-none"
                    >
                      <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
                      <option value="llama3-70b-8192">Llama 3 70B (Fast)</option>
                      <option value="llama3-8b-8192">Llama 3 8B</option>
                      <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                      <option value="gemma2-9b-it">Gemma 2 9B</option>
                    </select>
                  </div>
                </div>
              )}

            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={saveSettings}
                className="flex-1 py-2 rounded-xl bg-pastelPink-400 hover:bg-pastelPink-500 dark:bg-purple-600 text-white text-xs font-semibold shadow-sm active:scale-98 transition-all"
              >
                Save configurations
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// ─── Render Application ──────────────────────────────────────────
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
