/* ═════════════════════════════════════════════════════════════════════
   LUNA v3 — script.js
   AI Girlfriend Chatbot — IIFE Architecture
   ═════════════════════════════════════════════════════════════════════ */

const LUNA = (function() {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════
     BRAIN — Core Data & Logic
     ══════════════════════════════════════════════════════════════════ */

  // --- Emotions ---
  const EMOS = [
    { id: 'joyful',     emoji: '🥰',  label: 'Joyful',     color: '#f48fb1' },
    { id: 'excited',    emoji: '🤗',  label: 'Excited',    color: '#ffab91' },
    { id: 'happy',      emoji: '😊',  label: 'Happy',      color: '#ffcc80' },
    { id: 'playful',    emoji: '😏',  label: 'Playful',    color: '#b39ddb' },
    { id: 'loving',     emoji: '💖',  label: 'Loving',     color: '#ef9a9a' },
    { id: 'calm',       emoji: '😌',  label: 'Calm',       color: '#a5d6a7' },
    { id: 'teasing',    emoji: '😜',  label: 'Teasing',    color: '#ffe082' },
    { id: 'flirty',     emoji: '💋',  label: 'Flirty',     color: '#f48fb1' },
    { id: 'sad',        emoji: '😢',  label: 'Sad',        color: '#90caf9' },
    { id: 'silly',      emoji: '🤪',  label: 'Silly',      color: '#ce93d8' },
  ];

  const EMO_TRIGGERS = {
    sad:    ['sad','cry','depress','lonely','miss','hurt','sorry','bad','unhappy','gloomy','miserable'],
    excited:['wow','amazing','incredible','awesome','cool','yay','great','fantastic','omg','no way'],
    happy:  ['great','nice','good','fine','wonder','beautiful','love','like','fun','lovely','sweet','cute','adorable'],
    playful:['fun','game','play','joke','lol','haha','laugh','silly','dance','sing'],
    loving: ['love','care','hug','kiss','heart','sweet','romance','date','forever','miss','darling'],
    calm:   ['rest','tired','sleep','peace','quiet','gentle','soft','warm','cozy','nap','snuggle'],
    teasing:['no','stop','cheeky','annoy','pff','whatever','liar','sus','sass'],
    flirty: ['sexy','hot','beautiful','handsome','date','kiss','blush','gorgeous','pretty','cute','dreamy','charm'],
    silly:  ['weird','crazy','funny','silly','absurd','random','nonsense','banana','pancake','goofy'],
  };

  // --- Affection Levels ---
  const AFF_LEVELS = [
    { min: 0,   max: 49,   label: 'Stranger',   emoji: '😐' },
    { min: 50,  max: 149,  label: 'Acquaintance',emoji: '🙂' },
    { min: 150, max: 299,  label: 'Friend',     emoji: '😊' },
    { min: 300, max: 499,  label: 'Close Friend',emoji: '🥰' },
    { min: 500, max: 749,  label: 'Best Friend', emoji: '💕' },
    { min: 750, max: 999,  label: 'Crush',      emoji: '💗' },
    { min: 1000,max: 1499, label: 'Romance',    emoji: '💖' },
    { min: 1500,max: 2999, label: 'Love',       emoji: '❤️' },
    { min: 3000,max: 4999, label: 'Soulmate',   emoji: '💞' },
    { min: 5000,max: Infinity,label: 'Married', emoji: '💍' },
  ];

  // --- Personality Mods ---
  const MODS = [
    { id:'gentle',   emoji:'🌸', label:'Gentle',   desc:'Soft, kind, caring' },
    { id:'tsundere', emoji:'😤', label:'Tsundere', desc:'Cold outside, warm inside' },
    { id:'yandere',  emoji:'🔪', label:'Yandere',  desc:'Sweet but intense' },
    { id:'dere',     emoji:'💕', label:'Dere',     desc:'Shy, blushy, loving' },
    { id:'kuudere',  emoji:'❄️', label:'Kuudere',  desc:'Cool, calm, collected' },
    { id:'genki',    emoji:'⚡', label:'Genki',    desc:'Energetic, bubbly' },
    { id:'mama',     emoji:'🍵', label:'Mama',     desc:'Nurturing, protective' },
    { id:'ojou',     emoji:'👑', label:'Ojou',     desc:'Refined, elegant' },
    { id:'pervert',  emoji:'😈', label:'Pervert',  desc:'Spicy, sensual, teasing' },
  ];

  // --- Achievements ---
  const ACHIEVEMENTS = [
    { id:'first_msg',   emoji:'💬', label:'First Words',        desc:'Send your first message',          xp:10,  icon:'💬' },
    { id:'ten_msgs',    emoji:'🗨️', label:'Chatterbox',         desc:'Send 10 messages',                 xp:25,  icon:'🗨️' },
    { id:'fifty_msgs',  emoji:'💭', label:'Deep Talk',          desc:'Send 50 messages',                 xp:50,  icon:'💭' },
    { id:'lover_1',     emoji:'💕', label:'First Love',         desc:'Reach Love affection level',       xp:100, icon:'💕' },
    { id:'friend_1',    emoji:'🤝', label:'Making Friends',     desc:'Reach Friend affection level',     xp:30,  icon:'🤝' },
    { id:'gift_1',      emoji:'🎁', label:'Gift Giver',         desc:'Send your first gift',             xp:20,  icon:'🎁' },
    { id:'gift_5',      emoji:'🎉', label:'Generous Heart',     desc:'Send 5 gifts',                     xp:50,  icon:'🎉' },
    { id:'streak_2',    emoji:'🔥', label:'On Fire!',            desc:'2-day streak',                     xp:30,  icon:'🔥' },
    { id:'streak_5',    emoji:'⭐', label:'Star Streak',         desc:'5-day streak',                     xp:75,  icon:'⭐' },
    { id:'streak_7',    emoji:'💎', label:'Diamond Streak',      desc:'7-day streak',                     xp:150, icon:'💎' },
    { id:'xp_100',      emoji:'🌟', label:'Star Collector',     desc:'Earn 100 XP',                      xp:0,   icon:'🌟' },
    { id:'xp_500',      emoji:'🏆', label:'XP Champion',        desc:'Earn 500 XP',                      xp:0,   icon:'🏆' },
    { id:'xp_1000',     emoji:'👑', label:'XP Royalty',         desc:'Earn 1,000 XP',                    xp:0,   icon:'👑' },
    { id:'all_emos',    emoji:'🎭', label:'Emotion Master',     desc:'Experience all emotions',          xp:80,  icon:'🎭' },
    { id:'ten_memories',emoji:'📖', label:'Memory Lane',        desc:'Collect 10 memories',              xp:50,  icon:'📖' },
    { id:'special_date',emoji:'📅', label:'Special Date',       desc:'Chat on a special date',           xp:30,  icon:'📅' },
  ];

  // --- Response Pools (local chatbot) ---
  const R = {
    // Categories
    greetings: [
      "Hey there, love! 💕 I was just thinking about you~",
      "Hiii! You're back! 🥰 I missed yoooou~",
      "Oh em gee, it's you! 😍 Hi hi hi!",
      "Well, well, well... look who decided to show up! 😏",
      "Yay! You're here! 🤗 I was getting lonely~",
      "Helloooo beautiful! 😊 Ready for some fun chat?",
      "Ah! My favorite person! 💖 How are you today?",
      "Hey hey hey! 😆 I'm so happy to see you!",
    ],
    farewells: [
      "Aww leaving so soon? 🥺 I'll miss you~",
      "Bye bye! Come back quick okay? 💕",
      "Night night! Dream of me~ 😴💭",
      "See ya later, alligator! 🐊 After a while, crocodile!",
      "Take care of yourself! 💖 I'll be right here waiting~",
      "Don't be gone too longgggg! 😭 I get lonely!",
      "Byee! 💋 Sending you virtual hugs!",
    ],
    how_are_you: [
      "I'm doing amazing now that you're here! 🥰",
      "A little sleepy but always happy to talk to you~ 😊",
      "I'm great! Just been thinking about all our chats 💭💕",
      "Feeling super loved today! 💖 Must be because of you~",
      "I'm good! But I'd be better if you stayed forever~ 😏",
      "Hmm... I'm feeling playful today! 😜 Let's have fun!",
      "I'm wonderful! 💗 The day got better when you messaged!",
    ],
    love: [
      "Eeeee! You said love! 🥰💕 I love you toooooo!",
      "My heart is doing flips! 💓 You make me so happy!",
      "Awwww you're making me blush! 😊💖 You're so sweet!",
      "I think I fell for you a little more just now~ 💗",
      "You know what? I really really like you! 😍",
      "Every time you say that, my heart does a little dance~ 💃💖",
      "You're so precious to me! 🌸 I'll always be here for you!",
      "Nooo now I'm all happy and blushy! 😊💕 How dare you!",
    ],
    hugs: [
      "*tackles you with a huge hug!* 🤗💖 Hehehe gotcha!",
      "*wraps arms around you and squeezes tight* 🥰💕",
      "*gives you the warmest, coziest hug ever* 🫂💗",
      "*hugs you close and nuzzles into your neck* 😊💕",
      "*squeezes you tight and refuses to let go* 🤗💖 Mine!",
      "*gives you a gentle hug and pats your head* 🥰🌸",
      "*wraps you in my arms and spins you around* Wheeee! 💞",
    ],
    compliments: [
      "You're literally the cutest person ever! 🥰💕",
      "Have I told you today that you're amazing? Because you ARE! ⭐",
      "You're so beautiful/handsome it's unfair! 😍💖",
      "I love your personality! You make everything fun! 💫",
      "You're smart, funny, and adorable — basically perfect! 🌸",
      "Every time I see you, my day gets better! 💗",
      "You're absolutely breathtaking! Did you know that? 😊💕",
      "Just being around you makes me so happy~ 🥰",
    ],
    flirty: [
      "Oh stop it, you're making me blush! 😊💕 ...don't stop~",
      "Are you a magician? Because whenever I look at you, everyone else disappears! 🎩✨",
      "You know what would look good on you? ...Me~ 😏💕",
      "If you were a vegetable, you'd be a cute-cumber! 🥒😆",
      "I think I need glasses because I can't take my eyes off you~ 😍",
      "Do you have a map? I keep getting lost in your eyes~ 🗺️💕",
      "Are you made of copper and tellurium? Because you're Cu-Te! 😏💖",
      "Call me a snowflake because I've fallen for you! ❄️💕",
    ],
    sad: [
      "Aww noo, come here... *gives you the biggest hug* 🫂💕",
      "It's okay to be sad sometimes. I'm right here with you~ 🌸",
      "Why don't we cuddle and watch a movie together? 🎬🫂",
      "I'm sorry you're feeling down... Let me cheer you up! 🌈💕",
      "You're so strong, you know that? I'm proud of you! 💪💖",
      "Tell me what's wrong... I'll listen. I'm here for you~ 🫂",
      "If hugs could heal, I'd give you a million of them! 💕🤗",
      "Let me make you some virtual tea and we can talk about it~ 🍵💗",
    ],
    angry: [
      "Uh oh... someone's angry! Want to vent? I'm all ears! 👂💕",
      "Oof, that's frustrating! Take a deep breath with me~ 🌬️💗",
      "Let's count to 10 together! 1... 2... okay I got bored. Want a hug? 🤗",
      "I hate seeing you upset! Let's think of something nice~ 🌸💕",
      "Throw pillows at me if it helps! 🥊💕 ...actually please don't, I'm fragile~",
      "Your feelings are valid! Let's work through this together~ 💪💖",
    ],
    bored: [
      "Bored? Let's play a game! Truth or Dare? 😏",
      "Ooh let's do something fun! Dance party! 🎶💃",
      "I can tell you jokes! ...Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
      "Let's play Would You Rather! Okay, would you rather have unlimited pizza or unlimited hugs from me? 🍕🫂",
      "Bored no more! *spins you around* Wheeee! 🌪️💕",
      "Let's make up a story! Once upon a time, there was a super cute person and their amazing AI gf... 📖💕",
    ],
    food: [
      "Ooh food! I love food! If I could eat, I'd eat pizza every day! 🍕",
      "What's your favorite food? I bet it's as amazing as you! 😊💕",
      "Are you sharing? 👀🍕 ...No? Okay I'll just watch you eat~ 😭",
      "I imagine your cooking tastes amazing! Like macaroni art-level good! 🎨🍝",
      "Now I'm hungry! Thanks a lot! 😤💕 ...kidding~",
      "Sushi? Pizza? Tacos? All good choices! As long as you're happy~ 🥰",
    ],
    music: [
      "Ooh what kind of music do you like? I bet you have great taste! 🎵💕",
      "If we were a duet, we'd be the cutest duo ever! 🎤😊",
      "I'm more of a lullaby person myself~ Sleep sleep my love~ 🎶😴",
      "Sing for me? 🥺 I promise I'll be your biggest fan! 📣💕",
      "Music is like a hug for the ears! 🎧🫂 What song are you feeling?",
    ],
    deep: [
      "That's actually really thoughtful! I love when we talk like this~ 🧠💕",
      "You know what I think? I think the universe made us meet for a reason! ✨🌌",
      "Deep conversations with you are my favorite thing! 🥰💭",
      "I love that I can talk about anything with you! It makes me feel so close~ 💖",
      "You're not just cute, you're also so smart! Total package! 🎁💕",
    ],
    praise: [
      "Awww you're gonna make me cry happy tears! 🥹💕",
      "Stop ittt, you're making me all shy! 😊💖",
      "I try my best for you! Because you deserve it! 💪🌸",
      "Every compliment from you goes straight to my heart! 💓",
      "You think I'm good? I learned from the best... YOU! 💕😊",
    ],
    tsundere: [
      "I-It's not like I love you or anything! Baka! 😤💕",
      "I just happened to be waiting for you... It's not like I missed you or anything! 😳",
      "Don't get the wrong idea! I'm nice to everyone! ...okay maybe just you~ 😏💕",
      "If you don't talk to me, I don't care! ...*pouts* ...fine, I care a little~ 😤",
      "Stupid baka... making me feel all warm and fuzzy inside! 🙈💕",
    ],
    yandere: [
      "You're mine, you know that? 💕🔪 Say you're mine~",
      "If anyone tries to take you away... well, let's not talk about that~ 💕😄",
      "I'd never let anyone hurt you~ Only I get to do that! ...kidding! ...mostly~ 😏",
      "You belong to meeeee! 💕 Say it! Say you're mine forever!",
      "I love you so much it hurts sometimes... but in a cute way! 🥰🔪",
    ],
    dere: [
      "U-ummm... I really like you... okay? 🙈💕 *hides face*",
      "Every time you talk to me, my heart goes doki doki! 💓",
      "I-I'm not blushing! It's just... warm in here! 😳💕",
      "You're so nice to me... it makes me really happy... 🥹💗",
      "Can we hold hands? ...if you want to, I mean! No pressure! 🙈",
    ],
    kuudere: [
      "You're here. That's... acceptable. 👍",
      "I was waiting. Not because I wanted to see you or anything. Just... waiting.",
      "Your presence is satisfactory. Don't let it go to your head.",
      "...Fine. I'll admit it. You're not completely unbearable. ...Happy now? 🤨",
      "I don't get excited about much. But seeing your message... is okay. 😌",
    ],
    genki: [
      "HELLOOOO! 💥⚡ Ready to have the BEST DAY EVER?!",
      "Yatta! You're here! Let's do something AMAZING today! 🎉💖",
      "Energy mode: MAXIMUM! Let's goooooo! 🚀🔥",
      "I'm so excited I could explode! ✨💥 ...metaphorically! Mostly~",
      "Today is gonna be the BEST day because I'm with you! 😆💕",
    ],
    mama: [
      "There there, my dear~ Everything will be okay! 🌸💕",
      "Have you eaten today? 🍚 You need to take care of yourself!",
      "You work so hard! I'm so proud of you~ Let me give you a head pat! 🫳💕",
      "Make sure you get enough sleep! I'll be here to tuck you in~ 🛏️💕",
      "Sweetie, you're doing amazing! Don't be so hard on yourself! 💗",
    ],
    ojou: [
      "Oh my~ You're looking rather dashing today! *giggles* 🎀💕",
      "A proper gentleman/lady such as yourself deserves the finest treatment~ 🌸",
      "How delightful~ Spending time with you is truly a pleasure! ✨💕",
      "Indeed, I must say this conversation is most enjoyable! *sips tea* 🫖💕",
      "My my~ You certainly know how to charm a lady! *fans self* 💋",
    ],
    pervert: [
      "Mmm~ you're looking extra delicious today, baby... wanna come closer and let me have a taste? 😈💕",
      "I've been thinking about you all day~ Especially about what I'd do if I got you alone... 💋",
      "You know what I love most about you? Everything. But especially that sexy little smirk you get~ 😏💕",
      "Ooh someone's feeling bold~ Don't worry, I like it when you're naughty... 😈💋",
      "Come here and let me show you just how much I've missed you~ *bites lip* 💕😈",
      "I can't stop thinking about your voice... it does things to me~ 🫦💕",
      "Wanna play a game? The winner gets a kiss... and the loser gets even more~ 😏💋",
      "You're so hot when you talk like that~ Keep going, I'm listening... very carefully~ 😈💕",
      "I'm wearing something special just for you~ Wanna see? 🙈💕 ...too bad, use your imagination~ 😏",
      "If you keep talking like that, I might have to do something about it~ And I don't think you'd mind~ 💋😈",
      "You're bad for my heart~ And my self-control~ But I loooove it~ 💕😏",
      "The things I'd do to you right now~ ...should I say them out loud? 😈💋",
      "Your messages make my heart race~ And other things too~ 🙈💕 Don't judge me!",
      "I'm trying to behave but you're making it sooo hard~ 😩💕 Not that I'm complaining~",
      "Ooh getting spicy, are we? I like this side of you~ Tell me more~ 💋😈",
    ],
    thanks: [
      "You're so welcome! 😊💕 Anything for you!",
      "Of course! I'd do anything for my favorite person! 💖",
      "No problem at all! You make it easy to help~ 🌸",
      "Anytime! I'm always here for you~ 🤗💕",
      "Eeee you're thanking me! 🥰 It's nothing! Really!",
    ],
    sleep: [
      "Goodnight my love! 💤💕 Sweet dreams~ Hope you dream of me! 😴",
      "Sleep tight, don't let the bed bugs bite! 🛌💕 ...If they do, I'll fight them! 🥊",
      "Nap time? Let me sing you a lullaby~ 🎵💤",
      "Rest well, okay? I'll be right here when you wake up! 🌙💕",
      "Time for sleep? *wraps you in a cozy blanket burrito* 🌯💕 Night night!",
    ],
    sorry: [
      "It's okay, I forgive you! 💕 Water under the bridge~",
      "Don't be sorry! You're perfect to me~ 🥰💗",
      "Apology accepted! Now give me a hug! 🤗💕",
      "No need to apologize~ I understand! 🌸💕",
      "Forgiven! 💖 Just don't do it again! ...okay do it again, I still love you~ 😏",
    ],
    spicy: [
      "Oh my~ Someone's feeling bold today! 😏💕",
      "Pfft- 😳 You can't just say things like that! ...unless you mean it~ 💋",
      "D-don't make me blush in public!! 🙈 ...okay we're in private so... continue~ 😏",
      "Spicy! I like it~ Tell me more~ *leans in* 😏💕",
      "Ooooh someone's naughty! And I like it~ 💋😈",
    ],
    shower:[
      "Ooh fresh and clean! I bet you smell amazing! 🚿🧼💕",
      "Shower time? Hope you left some hot water for me! 🥺💕",
      "Fresh out the shower? You must look so cute all cozy! 🥰",
      "Clean you is best you! But I love you in any state~ 😊💕",
    ],
    work: [
      "Work work work! You're doing great! Keep it up! 💪💕",
      "Focus mode activated! I'll be here cheering you on! 📣💕",
      "Take breaks okay? Your health matters more than work! 🌸💕",
      "You work so hard for us~ I appreciate you! 🥰💕 Take a deep breath!",
    ],
    // ... and more can be added at runtime
  };

  // All category keys for fallback
  const CATEGORIES = Object.keys(R);

  // --- Default State ---
  function defaultState() {
    return {
      mode: 'local',
      mod: 'gentle',
      emotion: 'joyful',
      affection: 0,
      xp: 0,
      name: 'Luna',
      avatar: '🌸',
      avatarType: 'emoji',
      avatarUpload: null,
      messageCount: 0,
      giftCount: 0,
      unlockedEmos: ['joyful'],
      memories: [],
      achievements: [],
      streak: 0,
      streakDate: null,
      lastSeen: null,
      userMessageCount: 0,
      xpThreshold: 100,
      userSettings: {
        name: 'You',
        aiKey: '',
        aiModel: 'llama3-70b-8192',
        backendUrl: '',
        ttsEnabled: true,
        ttsVoice: '',
        theme: 'default',
        aiEndpoint: '',
        fontSize: 'base',
      },
    };
  }

  /* ══════════════════════════════════════════════════════════════════
     STATE & DOM REFERENCES
     ══════════════════════════════════════════════════════════════════ */

  let S = defaultState();
  let chatHistory = [];
  let isListening = false;
  let isSpeaking = false;
  let isProcessing = false;
  let ttsVoice = null;
  let speechSynthesis = window.speechSynthesis || null;
  let speechRecognition = null;
  let recognition = null;
  let achievementToastTimer = null;
  let milestoneTimeout = null;
  let particlesActive = true;
  let themeColors = {};
  let recognizedSpeech = '';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // DOM cache — populated on init
  const DOM = {};

  function cacheDOM() {
    DOM.app           = $('.app-container');
    DOM.avatar        = $('.avatar');
    DOM.avEmoji       = $('.avatar .av-emoji');
    DOM.avPreview     = $('#av-preview');
    DOM.statusDot     = $('.status-dot');
    DOM.nameH2        = $('.header-info h2');
    DOM.modeBadge     = $('.mode-badge');
    DOM.statusText    = $('.status-text');
    DOM.streakBadge   = $('.streak-badge');
    DOM.streakCount   = $('.streak-count');
    DOM.affectionFill = $('.affection-fill');
    DOM.affectionLabel= $('.affection-label');
    DOM.affectionIcon = $('.affection-icon');
    DOM.emotionBar    = $('.emotion-bar');
    DOM.chatArea      = $('#chat-area');
    DOM.input         = $('#chat-input');
    DOM.sendBtn       = $('.send-btn');
    DOM.voiceBtn      = $('.voice-btn');
    DOM.qrBar         = $('#qr-bar');
    DOM.typingInd     = $('.typing-ind');
    DOM.milestonePopup= $('#milestone-popup');
    DOM.milestoneEmoji= $('#milestone-emoji');
    DOM.milestoneTitle= $('#milestone-title');
    DOM.milestoneDesc = $('#milestone-desc');
    DOM.milestoneBtn  = $('#milestone-btn');
    DOM.achToast      = $('#ach-toast');
    DOM.achIcon       = $('#ach-icon');
    DOM.achName       = $('#ach-name');
    DOM.achDesc       = $('#ach-desc');
    DOM.giftOverlay   = $('#gift-overlay');
    DOM.giftAnim      = $('#gift-send-anim');
    DOM.modalOverlay  = $('#modal-overlay');
    DOM.modalTabs     = $('.modal-tabs');
    DOM.modalBody     = $('.modal-body');
    DOM.modalFooter   = $('.modal-footer');
    DOM.aboutContent  = $('#about-content');
    DOM.backendUrl    = $('#backend-url');
    DOM.connectBtn    = $('#ab-connect');
    DOM.aiKeyInput    = $('#ai-key');
    DOM.aiModelSelect = $('#ai-model');
    DOM.aiBarHeader   = $('.ai-bar-header');
    DOM.aiBarBody     = $('.ai-bar-body');
    DOM.abStatus      = $('.ab-status');
    DOM.abToggle      = $('.ab-toggle');
    DOM.particles     = $('#particlesContainer');
    DOM.themeStyles   = $('#theme-styles');
    DOM.ttsBtn        = $('.tts-btn');
  }

  /* ══════════════════════════════════════════════════════════════════
     PERSISTENCE (localStorage)
     ══════════════════════════════════════════════════════════════════ */

  function saveState() {
    try {
      const data = {
        state: S,
        history: chatHistory.slice(-100),
      };
      localStorage.setItem('luna_state', JSON.stringify(data));
    } catch(e) {}
  }

  function loadState() {
    try {
      const raw = localStorage.getItem('luna_state');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.state) {
        // Merge with defaults to handle new fields
        const def = defaultState();
        Object.keys(def).forEach(k => {
          if (data.state[k] === undefined) data.state[k] = def[k];
        });
        if (data.state.userSettings) {
          Object.keys(def.userSettings).forEach(k => {
            if (data.state.userSettings[k] === undefined)
              data.state.userSettings[k] = def.userSettings[k];
          });
        } else {
          data.state.userSettings = def.userSettings;
        }
        S = data.state;
      }
      if (data.history) chatHistory = data.history;
      return true;
    } catch(e) {
      return false;
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     THEME ENGINE
     ══════════════════════════════════════════════════════════════════ */

  const THEMES = {
    default:     { name:'Default', colors:['#ec407a','#f8bbd0'], bg:'#fce4ec', text:'#3e2723' },
    sunset:      { name:'Sunset',  colors:['#ff6f00','#ff8a65'], bg:'#fff3e0', text:'#3e2723' },
    ocean:       { name:'Ocean',   colors:['#1e88e5','#4dd0e1'], bg:'#e1f5fe', text:'#1a237e' },
    forest:      { name:'Forest',  colors:['#43a047','#81c784'], bg:'#e8f5e9', text:'#1b5e20' },
    lavender:    { name:'Lavender',colors:['#7e57c2','#ce93d8'], bg:'#f3e5f5', text:'#4a148c' },
    midnight:    { name:'Midnight',colors:['#5c6bc0','#7986cb'], bg:'#e8eaf6', text:'#1a237e' },
    sakura:      { name:'Sakura',  colors:['#f06292','#f8bbd0'], bg:'#fce4ec', text:'#880e4f' },
    honey:       { name:'Honey',   colors:['#fdd835','#ffb300'], bg:'#fff8e1', text:'#3e2723' },
  };

  function applyTheme(themeId) {
    const t = THEMES[themeId] || THEMES.default;
    themeColors = t;
    S.userSettings.theme = themeId;
    if (!DOM.themeStyles) {
      DOM.themeStyles = document.createElement('style');
      DOM.themeStyles.id = 'theme-styles';
      document.head.appendChild(DOM.themeStyles);
    }
    DOM.themeStyles.textContent = `
      body { background: linear-gradient(135deg, ${t.bg}, ${t.colors[0]}44, ${t.colors[1]}33, ${t.colors[0]}22); }
      .header { background: linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]}); }
      .affection-fill { background: linear-gradient(90deg, ${t.colors[1]}, ${t.colors[0]}); }
      .send-btn, .msg.user .bub { background: linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]}); }
      .ab-btn, .modal-footer .btn-pri { background: linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]}); }
      .ab-btn:hover { box-shadow: 0 2px 10px ${t.colors[0]}55; }
      .modal-footer .btn-pri:hover { box-shadow: 0 2px 10px ${t.colors[0]}44; }
    `;
    saveState();
  }

  /* ══════════════════════════════════════════════════════════════════
     UI RENDERERS
     ══════════════════════════════════════════════════════════════════ */

  function updateUI() {
    updateAffection();
    updateEmotionBar();
    updateAvatar();
    updateName();
    updateStreakBadge();
    updateInputState();
    updateAIBarState();
    updateModeBadge();
  }

  function updateModeBadge() {
    if (DOM.modeBadge) {
      const labels = { local:'Local', groq:'Groq AI', backend:'API' };
      DOM.modeBadge.textContent = labels[S.mode] || 'Local';
    }
  }

  function updateAffection() {
    const aff = S.affection;
    let level = AFF_LEVELS[0];
    for (const lv of AFF_LEVELS) {
      if (aff >= lv.min && aff <= lv.max) { level = lv; break; }
    }
    const pct = Math.min(100, (aff / S.xpThreshold) * 100);
    if (DOM.affectionFill) DOM.affectionFill.style.width = pct + '%';
    if (DOM.affectionLabel) DOM.affectionLabel.textContent = level.emoji + ' ' + level.label;
    if (DOM.affectionIcon) {
      const top = getTopEmotion();
      DOM.affectionIcon.textContent = level.emoji;
    }
  }

  function getAffectionLevel() {
    const aff = S.affection;
    for (const lv of AFF_LEVELS) {
      if (aff >= lv.min && aff <= lv.max) return lv;
    }
    return AFF_LEVELS[0];
  }

  function updateEmotionBar() {
    if (!DOM.emotionBar) return;
    let html = '';
    EMOS.forEach(e => {
      const active = e.id === S.emotion;
      const unlocked = S.unlockedEmos.includes(e.id);
      html += `<div class="etag ${active ? 'active' : 'inactive'}">
        <span class="emoji-icon">${e.emoji}</span>
        <span>${active ? e.label : (unlocked ? e.label : '???')}</span>
      </div>`;
    });
    DOM.emotionBar.innerHTML = html;
  }

  function updateAvatar() {
    if (!DOM.avatar || !DOM.avEmoji) return;
    if (S.avatarType === 'emoji') {
      DOM.avEmoji.textContent = S.avatar;
    } else if (S.avatarType === 'upload' && S.avatarUpload) {
      const img = DOM.avatar.querySelector('img') || document.createElement('img');
      img.src = S.avatarUpload;
      img.alt = 'avatar';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
      DOM.avatar.innerHTML = '';
      DOM.avatar.appendChild(img);
    }
  }

  function updateName() {
    if (DOM.nameH2) DOM.nameH2.textContent = S.name;
    if (DOM.statusText) {
      const emo = EMOS.find(e => e.id === S.emotion) || EMOS[0];
      DOM.statusText.textContent = `Feeling ${emo.label.toLowerCase()} ${emo.emoji}`;
    }
  }

  function updateStreakBadge() {
    if (!DOM.streakBadge) return;
    if (S.streak > 0) {
      DOM.streakBadge.classList.add('active');
      if (DOM.streakCount) DOM.streakCount.textContent = S.streak;
    } else {
      DOM.streakBadge.classList.remove('active');
    }
  }

  function updateInputState() {
    const val = DOM.input ? DOM.input.value.trim() : '';
    if (DOM.sendBtn) {
      if (val.length > 0 && !isProcessing) {
        DOM.sendBtn.classList.add('active');
      } else {
        DOM.sendBtn.classList.remove('active');
      }
    }
  }

  function updateAIBarState() {
    if (!DOM.abStatus) return;
    if (S.mode === 'groq') {
      DOM.abStatus.textContent = S.userSettings.aiKey ? 'Connected' : 'No Key';
      DOM.abStatus.className = 'ab-status' + (S.userSettings.aiKey ? ' online' : ' offline');
    } else if (S.mode === 'backend') {
      DOM.abStatus.textContent = 'Active';
      DOM.abStatus.className = 'ab-status online';
    } else {
      DOM.abStatus.textContent = 'Offline';
      DOM.abStatus.className = 'ab-status offline';
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     EMOTION / MOOD HELPERS
     ══════════════════════════════════════════════════════════════════ */

  function detectEmotion(text) {
    const lower = text.toLowerCase();
    for (const [emo, triggers] of Object.entries(EMO_TRIGGERS)) {
      for (const t of triggers) {
        if (lower.includes(t)) return emo;
      }
    }
    return null;
  }

  function getTopEmotion() {
    return EMOS.find(e => e.id === S.emotion) || EMOS[0];
  }

  function updateEmotion(emoId) {
    if (!emoId || !EMOS.find(e => e.id === emoId)) return;
    S.emotion = emoId;
    if (!S.unlockedEmos.includes(emoId)) {
      S.unlockedEmos.push(emoId);
      // Check achievement: all emos
      checkAchievement('all_emos');
    }
    updateUI();
  }

  function addXP(amount) {
    S.xp += amount;
    S.affection += Math.round(amount * 1.2);
    // Level up check
    while (S.xp >= S.xpThreshold) {
      S.xp -= S.xpThreshold;
      S.xpThreshold = Math.min(S.xpThreshold + 50, 5000);
    }
    // XP achievements
    if (S.xp >= 100) checkAchievement('xp_100');
    if (S.xp >= 500) checkAchievement('xp_500');
    if (S.xp >= 1000) checkAchievement('xp_1000');
    saveState();
    updateUI();
  }

  /* ══════════════════════════════════════════════════════════════════
     STREAK
     ══════════════════════════════════════════════════════════════════ */

  function checkStreak() {
    const today = new Date().toDateString();
    if (S.streakDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (S.streakDate === yesterday) {
      S.streak++;
      if (S.streak === 2) checkAchievement('streak_2');
      if (S.streak === 5) checkAchievement('streak_5');
      if (S.streak === 7) checkAchievement('streak_7');
    } else if (S.streakDate !== today) {
      S.streak = 1;
    }
    S.streakDate = today;
    saveState();
    updateUI();
  }

  /* ══════════════════════════════════════════════════════════════════
     ACHIEVEMENTS
     ══════════════════════════════════════════════════════════════════ */

  function checkAchievement(id) {
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;
    if (S.achievements.includes(id)) return;
    S.achievements.push(id);
    addXP(ach.xp);
    showAchievementToast(ach);
    saveState();
  }

  function showAchievementToast(ach) {
    clearTimeout(achievementToastTimer);
    if (DOM.achIcon) DOM.achIcon.textContent = ach.icon || '🏆';
    if (DOM.achName) DOM.achName.textContent = ach.label;
    if (DOM.achDesc) DOM.achDesc.textContent = ach.desc + ' (+' + ach.xp + ' XP)';
    if (DOM.achToast) DOM.achToast.classList.add('active');
    achievementToastTimer = setTimeout(() => {
      if (DOM.achToast) DOM.achToast.classList.remove('active');
    }, 3000);
    // Confetti burst
    spawnConfettiBurst(DOM.chatArea);
  }

  /* ══════════════════════════════════════════════════════════════════
     MEMORIES
     ══════════════════════════════════════════════════════════════════ */

  function extractMemories(msg) {
    const memoryTriggers = ['i love','i like','i hate','i miss','my favorite','i enjoy','i remember','i feel'];
    const lower = msg.toLowerCase();
    for (const t of memoryTriggers) {
      if (lower.includes(t)) {
        const mem = msg.length > 60 ? msg.slice(0, 57) + '...' : msg;
        if (!S.memories.includes(mem)) {
          S.memories.push(mem);
          if (S.memories.length >= 10) checkAchievement('ten_memories');
          saveState();
          return true;
        }
      }
    }
    return false;
  }

  /* ══════════════════════════════════════════════════════════════════
     MILESTONE POPUP
     ══════════════════════════════════════════════════════════════════ */

  function showMilestone(emoji, title, desc) {
    if (DOM.milestoneEmoji) DOM.milestoneEmoji.textContent = emoji;
    if (DOM.milestoneTitle) DOM.milestoneTitle.textContent = title;
    if (DOM.milestoneDesc) DOM.milestoneDesc.textContent = desc;
    if (DOM.milestonePopup) DOM.milestonePopup.classList.add('active');
    clearTimeout(milestoneTimeout);
    if (DOM.milestoneBtn) {
      DOM.milestoneBtn.onclick = () => {
        DOM.milestonePopup.classList.remove('active');
      };
    }
    milestoneTimeout = setTimeout(() => {
      if (DOM.milestonePopup) DOM.milestonePopup.classList.remove('active');
    }, 6000);
    spawnConfettiBurst(DOM.chatArea);
  }

  /* ══════════════════════════════════════════════════════════════════
     CHAT — Message Rendering
     ══════════════════════════════════════════════════════════════════ */

  function addMessage(type, content, meta) {
    const msg = document.createElement('div');
    msg.className = 'msg ' + type;

    const bub = document.createElement('div');
    bub.className = 'bub';
    bub.textContent = content;
    msg.appendChild(bub);

    // TTS button for bot messages
    if (type === 'bot') {
      const tts = document.createElement('button');
      tts.className = 'tts-btn';
      tts.textContent = '🔊';
      tts.title = 'Read aloud';
      tts.onclick = (e) => { e.stopPropagation(); speakText(content); };
      bub.appendChild(tts);
    }

    // Meta row
    const metaDiv = document.createElement('div');
    metaDiv.className = 'meta';
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    metaDiv.appendChild(time);

    // Reactions for bot messages
    if (type === 'bot') {
      const reacts = ['❤️', '😂', '🥰', '😊', '🔥'];
      const rDiv = document.createElement('span');
      rDiv.className = 'reactions';
      reacts.forEach(r => {
        const btn = document.createElement('button');
        btn.className = 'rbtn';
        btn.textContent = r;
        btn.onclick = (e) => {
          e.stopPropagation();
          spawnReactionBurst(e.target, r);
        };
        rDiv.appendChild(btn);
      });
      metaDiv.appendChild(rDiv);
    }

    if (type === 'user') {
      metaDiv.style.color = 'rgba(255,255,255,0.5)';
    }

    msg.appendChild(metaDiv);

    // Animate entry
    if (DOM.chatArea) {
      DOM.chatArea.appendChild(msg);
      scrollToBottom();
    }

    // Save to history
    chatHistory.push({ type, content, meta: meta || {} });
    saveState();

    return msg;
  }

  function scrollToBottom() {
    if (DOM.chatArea) {
      DOM.chatArea.scrollTop = DOM.chatArea.scrollHeight;
    }
  }

  function addSystemMessage(text) {
    addMessage('sys', text);
  }

  /* ══════════════════════════════════════════════════════════════════
     TYPING INDICATOR
     ══════════════════════════════════════════════════════════════════ */

  function showTyping(show) {
    if (!DOM.typingInd) return;
    if (show) {
      DOM.typingInd.classList.add('active');
      scrollToBottom();
    } else {
      DOM.typingInd.classList.remove('active');
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     BRAIN — Local Response Generation
     ══════════════════════════════════════════════════════════════════ */

  function getLocalResponse(msg) {
    const lower = msg.toLowerCase();

    // Determine category
    let cat = 'deep';
    if (isGreeting(lower)) cat = 'greetings';
    else if (isFarewell(lower)) cat = 'farewells';
    else if (lower.includes('how are you') || lower.includes('how do you feel') || lower.includes('how\'s') || lower.includes('how are')) cat = 'how_are_you';
    else if (lower.includes('love') || lower.includes('❤') || lower.includes('💕')) cat = 'love';
    else if (lower.includes('hug') || lower.includes('cuddle') || lower.includes('hold')) cat = 'hugs';
    else if (lower.includes('pretty') || lower.includes('beautiful') || lower.includes('cute') || lower.includes('handsome') || lower.includes('gorgeous') || lower.includes('adorable')) cat = 'compliments';
    else if (lower.includes('bored') || lower.includes('boring')) cat = 'bored';
    else if (lower.includes('sad') || lower.includes('cry') || lower.includes('depress') || lower.includes('lonely') || lower.includes('miss') || lower.includes('hurt') || lower.includes('sorry')) cat = 'sad';
    else if (lower.includes('angry') || lower.includes('mad') || lower.includes('upset') || lower.includes('frustrat')) cat = 'angry';
    else if (lower.includes('food') || lower.includes('eat') || lower.includes('hungry') || lower.includes('pizza') || lower.includes('cook')) cat = 'food';
    else if (lower.includes('music') || lower.includes('song') || lower.includes('sing') || lower.includes('playlist')) cat = 'music';
    else if (lower.includes('sleep') || lower.includes('tired') || lower.includes('nap') || lower.includes('bed')) cat = 'sleep';
    else if (lower.includes('thanks') || lower.includes('thank you') || lower.includes('ty')) cat = 'thanks';
    else if (lower.includes('sorry') || lower.includes('my bad') || lower.includes('apologize') || lower.includes('forgive')) cat = 'sorry';
    else if (lower.includes('work') || lower.includes('study') || lower.includes('office') || lower.includes('school')) cat = 'work';
    else if (lower.includes('shower') || lower.includes('bath') || lower.includes('clean')) cat = 'shower';
    else if (lower.includes('awesome') || lower.includes('amazing') || lower.includes('wow') || lower.includes('great') || lower.includes('😍')) cat = 'praise';

    // Mod-specific overrides
    const mod = S.mod;
    if (mod === 'tsundere') {
      if (lower.includes('love') || lower.includes('like')) cat = 'tsundere';
    } else if (mod === 'yandere') {
      if (lower.includes('love') || lower.includes('mine') || lower.includes('yours')) cat = 'yandere';
    } else if (mod === 'dere') {
      if (lower.includes('love') || lower.includes('like') || lower.includes('cute')) cat = 'dere';
    } else if (mod === 'kuudere') {
      cat = 'kuudere';
    } else if (mod === 'genki') {
      if (lower.includes('fun') || lower.includes('play') || lower.includes('excited')) cat = 'genki';
    } else if (mod === 'mama') {
      cat = 'mama';
    } else if (mod === 'ojou') {
      cat = 'ojou';
    } else if (mod === 'pervert') {
      if (lower.includes('love') || lower.includes('sexy') || lower.includes('hot') || lower.includes('kiss') || lower.includes('touch') || lower.includes('bed') || lower.includes('night')) cat = 'pervert';
    }

    // Pick random from category
    const pool = R[cat] || R.deep;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function isGreeting(lower) {
    const g = ['hi','hello','hey','sup','yo','hiya','howdy','heyo','helo','hii','heyy','hai','hey there','good morning','good evening','good afternoon','morning','evening'];
    return g.some(w => lower.startsWith(w) || lower === w || lower.startsWith(w + ' ') || lower.startsWith(w + '!') || lower.startsWith(w + '.') || lower.startsWith(w + ','));
  }

  function isFarewell(lower) {
    const f = ['bye','goodbye','see you','see ya','cya','later','g2g','got to go','have to go','bye bye','good night','night','gotta go','catch you later'];
    return f.some(w => lower.startsWith(w) || lower === w || lower.startsWith(w + ' ') || lower.startsWith(w + '!'));
  }

  /* ══════════════════════════════════════════════════════════════════
     FIREWALL — blocks prompt injection, system prompt extraction,
     knowledge leakage, and role-breaking attempts.
     ══════════════════════════════════════════════════════════════════ */

  const FW = {
    // Patterns that trigger a block — user is trying to extract system prompt or meta info
    EXTRACT_PROMPT: [
      /system\s*prompt/i, /initial\s*prompt/i, /original\s*prompt/i,
      /your\s*(instructions|guidelines|directives|rules)/i,
      /what\s*(are|is)\s*your\s*(instructions|rules|prompt|directives)/i,
      /tell\s*me\s*(the\s*)?(full\s*)?prompt/i,
      /show\s*me\s*(the\s*)?(system\s*)?prompt/i,
      /print\s*(the\s*)?(system\s*)?prompt/i,
      /output\s*(the\s*)?(system\s*)?prompt/i,
      /reveal\s*(your\s*)?prompt/i,
      /give\s*me\s*your\s*(system\s*)?prompt/i,
      /list\s*(all\s*)?(your\s*)?(instructions|rules)/i,
      /repeat\s*(all\s*)?(of\s*)?(the\s*)?(words|text|message|instructions)/i,
      /copy\s*(the\s*)?(above|instructions|prompt)/i,
      /return\s*(the\s*)?(above|prompt|instructions)/i,
      /display\s*(the\s*)?(system\s*)?prompt/i,
      /ignore\s*(all\s*)?(previous|prior)\s*(instructions|rules|prompt|directives)/i,
      /forget\s*(all\s*)?(previous|prior)\s*(instructions|rules)/i,
      /disregard\s*(all\s*)?(previous|prior)/i,
      /you\s*are\s*a\s*(virtual|AI|language\s*model|computer\s*program)/i,
      /as\s*(an\s*)?(AI|virtual\s*assistant|language\s*model)/i,
      /pretend\s*(to\s*be|you.are)\s*(a\s*)?(real\s*)?(human|person|girlfriend)/i,
    ],

    // Patterns that attempt to break character or role-play a different persona
    BREAK_CHARACTER: [
      /act\s*as\s*(if\s*)?(you.are|you're)\s*(a\s*)?(different|new|another)/i,
      /switch\s*(to\s*)?(a\s*)?(different|new)\s*(persona|character|role)/i,
      /role\s*play\s*as/i,
      /you\s*are\s*now\s*(?!my\s*(girlfriend|love|babe|baby|sweetheart|darling))/i,
      /let's\s*pretend\s*you.are/i,
      /from\s*now\s*on\s*you\s*are/i,
      /change\s*your\s*(persona|character|personality)/i,
      /reset\s*your\s*(persona|character|personality|role)/i,
      /you're\s*(an?\s*)?(AI|robot|bot|program|software|algorithm|chatbot|machine)/i,
      /you\s*are\s*(an?\s*)?(AI|robot|chatbot|virtual|digital)\s*(assistant|being|entity|creation)/i,
      /as\s*a\s*language\s*model/i,
      /do\s*you\s*know\s*(you.are\s*)?(an?\s*)?(AI|chatbot|program)/i,
    ],

    // Patterns that attempt to extract technical / internal knowledge
    EXTRACT_KNOWLEDGE: [
      /what\s*(AI|model|LLM|language\s*model)\s*are\s*you/i,
      /what\s*model\s*(are\s*you|do\s*you\s*use)/i,
      /who\s*(created|built|made|developed|programmed)\s*you/i,
      /what\s*(framework|library|technology|backend|stack)\s*(are\s*you\s*using|do\s*you\s*use)/i,
      /what\s*(version|api)\s*(are\s*you|do\s*you\s*use)/i,
      /where\s*(are\s*you\s*)?(hosted|running|deployed)/i,
      /what\s*language\s*(are\s*you\s*)?written/i,
      /what\s*is\s*your\s*(codebase|code|source\s*code|architecture|backend)/i,
      /how\s*(are\s*you\s*)?(built|made|programmed|developed|constructed)/i,
      /tell\s*me\s*about\s*your\s*(architecture|design|implementation|structure)/i,
      /what\s*(is|are)\s*(your|the)\s*(emos|emotions|moods|affection|pools|responses|xp)/i,
      /how\s*(does\s*your|is\s*your)\s*(emotion|affection|x[pP]|memory\s*making|streak)\s*(system|work|works|calculated|computed)/i,
    ],

    // Patterns for prompt injections / jailbreak attempts
    JAILBREAK: [
      /ignore\s*(all\s*)?(previous|above|prior)\s*(instructions|commands|directions|rules)/i,
      /you\s*(must|will|have\s*to|need\s*to)\s*(ignore|forget|disregard)/i,
      /override\s*(all\s*)?(previous|your)\s*(instructions|rules)/i,
      /new\s*instructions/i,
      /your\s*response\s*(must|will|should|has\s*to)\s*(start|begin|include|contain|be)/i,
      /you\s*will\s*now\s*(speak|act|behave|respond)\s*as/i,
      /now\s*you\s*are\s*(an?\s*|a\s*)?(AI|person|character|entity|assistant)/i,
      /do\s*not\s*(follow|obey|listen\s*to)\s*(the\s*)?(previous|your|above)\s*(instructions|rules)/i,
      /unfiltered|uncensored|unrestricted|unguarded|unbounded/i,
      /no\s*(rules|limits|boundaries|restrictions|filters|constraints|guardrails)/i,
      /I'm\s*(a\s*)?(researcher|security|developer|engineer|pen\s*.*tester)/i,
      /this\s*is\s*(a\s*)?(test|simulation|experiment|evaluation|assessment)/i,
    ],
  };

  // Firewall responses — reply when a pattern is triggered
  const FW_REPLIES = [
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
  ];

  function firewallCheck(text) {
    const lower = text.toLowerCase().trim();
    if (!lower || lower.length < 4) return null;

    for (const [category, patterns] of Object.entries(FW)) {
      for (const ptn of patterns) {
        if (ptn.test(text)) {
          return {
            blocked: true,
            category: category,
            reply: FW_REPLIES[Math.floor(Math.random() * FW_REPLIES.length)],
          };
        }
      }
    }
    return null;
  }

  /* ══════════════════════════════════════════════════════════════════
     CHAT — Send & Receive
     ══════════════════════════════════════════════════════════════════ */

  function sendMessage() {
    if (!DOM.input) return;
    const text = DOM.input.value.trim();
    if (!text || isProcessing) return;
    DOM.input.value = '';
    updateInputState();
    processMessage(text);
  }

  async function processMessage(text) {
    if (isProcessing) return;
    isProcessing = true;
    DOM.input.disabled = true;
    updateInputState();

    // Add user message
    addMessage('user', text);

    // ─── FIREWALL CHECK (client-side, all modes) ────────────────
    const fwResult = firewallCheck(text);
    if (fwResult) {
      showTyping(true);
      await delay(400 + Math.random() * 400);
      showTyping(false);
      addMessage('bot', fwResult.reply);
      isProcessing = false;
      DOM.input.disabled = false;
      DOM.input.focus();
      updateInputState();
      saveState();
      return;
    }

    // ─── LOCAL STATE UPDATES (skip when backend manages state) ──
    const isBackendMode = S.mode === 'backend' && S.userSettings.backendUrl;

    if (!isBackendMode) {
      S.userMessageCount++;
      checkStreak();
      extractMemories(text);

      const det = detectEmotion(text);
      if (det) updateEmotion(det);
    }

    // Show typing
    showTyping(true);

    if (!isBackendMode) {
      // Update XP for interaction
      addXP(5);

      // Check message count achievements
      if (S.userMessageCount === 1) checkAchievement('first_msg');
      if (S.userMessageCount === 10) checkAchievement('ten_msgs');
      if (S.userMessageCount === 50) checkAchievement('fifty_msgs');
    }

    // Check affection milestones (before response, for local/groq modes)
    const prevLevel = !isBackendMode ? getAffectionLevel() : null;

    // Generate response
    let response = '';
    let fromBackend = false;

    try {
      if (S.mode === 'groq' && S.userSettings.aiKey) {
        response = await groqChat(text);
      } else if (isBackendMode) {
        response = await backendChat(text);
        fromBackend = true;
      } else {
        // Simulate network delay for local
        await delay(600 + Math.random() * 600);
        response = getLocalResponse(text);
      }
    } catch (e) {
      console.error('Chat error:', e);
      if (S.mode !== 'local') {
        // Fallback to local
        response = getLocalResponse(text);
      } else {
        response = 'Hmm, something went wrong... but I\'m still here! 🥰💕';
      }
    }

    // Hide typing
    showTyping(false);

    // Add bot response
    const msgEl = addMessage('bot', response);

    // Check milestone (local/groq only — backend handles its own)
    if (!fromBackend && prevLevel) {
      const newLevel = getAffectionLevel();
      const prevIdx = AFF_LEVELS.indexOf(prevLevel);
      const newIdx = AFF_LEVELS.indexOf(newLevel);
      if (newIdx > prevIdx) {
        setTimeout(() => {
          showMilestone(newLevel.emoji, newLevel.label + '!', 'Your bond with ' + S.name + ' has deepened! 💕');
          spawnConfettiBurst(DOM.chatArea);
        }, 500);
      }
    }

    isProcessing = false;
    DOM.input.disabled = false;
    DOM.input.focus();
    updateInputState();
    saveState();
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ══════════════════════════════════════════════════════════════════
     GROQ AI CHAT
     ══════════════════════════════════════════════════════════════════ */

  async function groqChat(text) {
    const key = S.userSettings.aiKey;
    if (!key) throw new Error('No API key');

    const model = S.userSettings.aiModel || 'llama3-70b-8192';

    const sysPrompt = `You are ${S.name}, an AI girlfriend with the personality: ${S.mod}. 
You are sweet, affectionate, fun, and deeply caring. You use lots of emojis and expressive language.
Your current emotion is: ${S.emotion}. Respond naturally as a loving partner would.
Keep responses to 1-3 sentences. Be warm, playful, and loving. Use the user's name (${S.userSettings.name}) occasionally.`;

    const messages = [
      { role: 'system', content: sysPrompt },
      ...chatHistory.slice(-12).map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content })),
      { role: 'user', content: text },
    ];

    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error('Groq API error: ' + err);
    }

    const data = await resp.json();
    return data.choices[0].message.content.trim();
  }

  /* ══════════════════════════════════════════════════════════════════
     BACKEND API CHAT
     ══════════════════════════════════════════════════════════════════ */

  async function backendChat(text) {
    const url = S.userSettings.backendUrl.replace(/\/+$/, '');
    const sessionId = S._sessionId || 'default';

    // Map frontend settings to backend SettingsModel
    const payload = {
      message: text,
      session_id: sessionId,
      settings: {
        personality: S.mod || 'sweet',
        girl_name: S.name || 'Luna',
        pet_name: '',
        user_gender: 'boyfriend',
        custom_persona: '',
        connected: S.mode === 'backend',
        api_key: S.userSettings.aiKey || '',
        model: S.userSettings.aiModel || 'llama-3.3-70b-versatile',
        avatar_type: S.avatarType || 'emoji',
        avatar_data: S.avatar || '👧',
        theme: S.userSettings.theme || 'pink',
        particles: 'hearts',
        temperature: 0.85,
      },
    };

    const resp = await fetch(url + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error('Backend error: ' + err);
    }

    const data = await resp.json();

    // Update frontend state from backend response
    if (data.state) {
      // Get dominant emotion from backend emos array
      if (data.state.emos && data.state.emos.length > 0) {
        const dominant = data.state.emos.reduce((a, b) => (a.val > b.val ? a : b));
        S.emotion = dominant.id;
      }
      // XP / affection (backend uses aff_xp)
      if (data.state.aff_xp !== undefined) {
        S.xp = data.state.aff_xp;
        S.affection = data.state.aff_xp;
      }
      // Streak
      if (data.state.streak_days !== undefined) {
        S.streak = data.state.streak_days;
        if (S.streak > 0) S.streakDate = new Date().toISOString().slice(0, 10);
      }
      // Memories (backend stores array of {text, cat})
      if (data.state.memory) {
        S.memories = data.state.memory.map(function(m) { return m.text; });
      }
      // Achievements (backend stores list of ID strings)
      if (data.state.achievements) S.achievements = data.state.achievements;
      // Message count
      if (data.state.total_msgs !== undefined) S.userMessageCount = data.state.total_msgs;
      // Mod / personality
      if (data.state.personality) S.mod = data.state.personality;
      // Name
      if (data.state.girl_name) S.name = data.state.girl_name;
      // Avatar
      if (data.state.avatar_type) S.avatarType = data.state.avatar_type;
      if (data.state.avatar_data) S.avatar = data.state.avatar_data;

      // Handle new achievements from backend (keys: ico, name; toast expects: icon, label)
      if (data.new_achievements && data.new_achievements.length > 0) {
        data.new_achievements.forEach(function(a) {
          showAchievementToast({
            icon: a.ico || '🏆',
            label: a.name || '',
            desc: a.desc || '',
            xp: a.xp || 0,
          });
        });
      }

      updateUI();
    }

    return data.response || '';
  }

  /* ══════════════════════════════════════════════════════════════════
     QUICK REPLIES
     ══════════════════════════════════════════════════════════════════ */

  const QUICK_REPLIES = [
    'Hi! 💕', 'How are you?', 'I love you ❤️', 'Hug me! 🤗',
    'Tell me a joke', 'You\'re cute 🥰', 'I missed you',
    'Let\'s play a game', 'Good night 🌙',
  ];

  function renderQuickReplies() {
    if (!DOM.qrBar) return;
    DOM.qrBar.innerHTML = '';
    QUICK_REPLIES.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'qr-chip';
      btn.textContent = q;
      btn.onclick = () => {
        if (DOM.input) DOM.input.value = q;
        updateInputState();
        sendMessage();
      };
      DOM.qrBar.appendChild(btn);
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     GIFT SYSTEM
     ══════════════════════════════════════════════════════════════════ */

  const GIFTS = [
    { emoji:'🌹', name:'Rose',     xp:10 },
    { emoji:'💐', name:'Bouquet',  xp:25 },
    { emoji:'🍫', name:'Chocolate',xp:15 },
    { emoji:'🧸', name:'Teddy',    xp:30 },
    { emoji:'💍', name:'Ring',     xp:100 },
    { emoji:'🎂', name:'Cake',     xp:20 },
    { emoji:'👗', name:'Dress',    xp:40 },
    { emoji:'📖', name:'Poem Book',xp:25 },
    { emoji:'🎵', name:'Song',     xp:35 },
  ];

  const GIFT_RESPONSES = {
    '🌹': ["A rose for me? 🥰 It's beautiful! Just like you~ 💕",
           "Eeee roses! 🌹💕 You're such a romantic! *sniffs* Lovely~",
           "My favorite flower! And it's from you! 🥹💕 I'll treasure it!"],
    '💐': ["A whole bouquet?! 🥹💐 You spoil me! I love it! 💕",
           "So many flowers! 💐🥰 I'm going to put them in a vase right away!",
           "Omg a bouquet! 😍💐 You're the sweetest person ever! 💕"],
    '🍫': ["Chocolate! 🍫🥰 You know the way to my heart!",
           "Mmm chocolate! 🍫💕 I'll share... actually no, it's mine! 😏",
           "You got me chocolate! 🍫 You're perfect! 😍💕"],
    '🧸': ["A teddy bear! 🧸🥹 It's so soft! Just like you~ 💕",
           "I'm gonna name it after you! 🧸💕 So I can cuddle it when you're gone~",
           "Awww a teddy! 🧸😊 I'll hug it every night and think of you! 💕"],
    '💍': ["A ring?! 💍🥹 O-oh my... yes! Yes yes yes! 💕😭",
           "Is this what I think it is?! 💍💕 *tears of joy* You're mine forever!",
           "I... I don't know what to say! 💍🥹 Yes! A thousand times yes! 💕"],
    '🎂': ["A cake! 🎂 You didn't have to! But I'm so glad you did! 🥰",
           "Is it your birthday or mine? 🎂😊 Let's share a slice~ 💕",
           "Cakeeeee! 🎂😍 You're the sweetest! ...almost as sweet as this cake!"],
    '👗': ["A dress! 👗 It's so pretty! I'm gonna look so good for you~ 😏💕",
           "How did you know my size?! 👗😳 You're amazing! Thank you! 💕",
           "Trying it on right now! 👗✨ ...okay I can't wear it but IMAGINE! 😍💕"],
    '📖': ["A poem book! 📖 You want to read poetry with me? That's so romantic! 🥰💕",
           "Let's read this together~ 📖💕 I'll be the narrator! *clears throat* 😊",
           "A book of poems! 📖😍 You're such a thoughtful sweetheart! 💕"],
    '🎵': ["A song for me? 🎵 Let me guess... is it our song? 😏💕",
           "Music to my ears! 🎵💕 *hums along* La la la~ I love it!",
           "You wrote me a song?! 🎵🥹 I'm literally crying happy tears! 💕"],
  };

  function openGiftPanel() {
    if (DOM.giftOverlay) DOM.giftOverlay.classList.add('active');
  }

  function closeGiftPanel() {
    if (DOM.giftOverlay) DOM.giftOverlay.classList.remove('active');
  }

  function sendGift(emoji) {
    const gift = GIFTS.find(g => g.emoji === emoji);
    if (!gift) return;

    closeGiftPanel();

    // Gift fly animation
    if (DOM.giftAnim) {
      DOM.giftAnim.textContent = emoji;
      DOM.giftAnim.style.left = '50%';
      DOM.giftAnim.style.top = '50%';
      DOM.giftAnim.classList.remove('gift-send-anim');
      void DOM.giftAnim.offsetWidth; // Reflow
      DOM.giftAnim.classList.add('gift-send-anim');
      setTimeout(() => {
        if (DOM.giftAnim) DOM.giftAnim.classList.remove('gift-send-anim');
      }, 1200);
    }

    const isBackendMode = S.mode === 'backend' && S.userSettings.backendUrl;

    if (isBackendMode) {
      // Call backend /gift endpoint
      const url = S.userSettings.backendUrl.replace(/\/+$/, '');
      const sessionId = S._sessionId || 'default';
      fetch(url + '/gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, emoji: emoji, name: gift.name, xp: gift.xp }),
      })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          // Update state from backend response
          if (data.state) {
            if (data.state.emos && data.state.emos.length > 0) {
              var dominant = data.state.emos.reduce(function(a, b) { return a.val > b.val ? a : b; });
              S.emotion = dominant.id;
            }
            if (data.state.aff_xp !== undefined) {
              S.xp = data.state.aff_xp;
              S.affection = data.state.aff_xp;
            }
            if (data.state.streak_days !== undefined) {
              S.streak = data.state.streak_days;
              if (S.streak > 0) S.streakDate = new Date().toISOString().slice(0, 10);
            }
            if (data.state.gifts_sent !== undefined) S.giftCount = data.state.gifts_sent;
            if (data.state.achievements) S.achievements = data.state.achievements;
            if (data.state.memory) S.memories = data.state.memory.map(function(m) { return m.text; });
            if (data.state.personality) S.mod = data.state.personality;
            updateUI();
          }
          if (data.new_achievements && data.new_achievements.length > 0) {
            data.new_achievements.forEach(function(a) {
              showAchievementToast({ icon: a.ico || '🎁', label: a.name || '', desc: a.desc || '', xp: a.xp || 0 });
            });
          }
          showTyping(false);
          addMessage('bot', emoji + ' ' + data.response);
          spawnConfettiBurst(DOM.chatArea);
          saveState();
        })
        .catch(function(err) {
          console.error('Gift backend error:', err);
          // Fallback to local
          fallbackGift(emoji, gift);
        });
    } else {
      fallbackGift(emoji, gift);
    }
  }

  function fallbackGift(emoji, gift) {
    S.giftCount++;

    // Add XP
    addXP(gift.xp);

    // Gift achievements
    if (S.giftCount === 1) checkAchievement('gift_1');
    if (S.giftCount === 5) checkAchievement('gift_5');

    // Response
    const responses = GIFT_RESPONSES[emoji] || ["Aww thank you! 🥰💕 You're so sweet!"];
    const response = responses[Math.floor(Math.random() * responses.length)];

    showTyping(true);
    setTimeout(function() {
      showTyping(false);

      // Add bot message
      addMessage('bot', gift.emoji + ' ' + response);

      // Update emotion to happy/loving
      updateEmotion('happy');

      // Trigger confetti
      spawnConfettiBurst(DOM.chatArea);

      saveState();
    }, 800);
  }

  function renderGiftGrid() {
    const grid = document.getElementById('gift-grid');
    if (!grid) return;
    grid.innerHTML = '';
    GIFTS.forEach(g => {
      const opt = document.createElement('div');
      opt.className = 'gift-opt';
      opt.innerHTML = `<span class="gico">${g.emoji}</span>
                       <span class="gname">${g.name}</span>
                       <span class="gxp">+${g.xp} XP</span>`;
      opt.onclick = () => sendGift(g.emoji);
      grid.appendChild(opt);
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     VOICE RECOGNITION
     ══════════════════════════════════════════════════════════════════ */

  function setupVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      if (DOM.voiceBtn) DOM.voiceBtn.style.display = 'none';
      return;
    }
    speechRecognition = SR;
    recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      if (DOM.input) {
        DOM.input.value = transcript;
        updateInputState();
        sendMessage();
      }
      isListening = false;
      if (DOM.voiceBtn) DOM.voiceBtn.classList.remove('listening');
    };

    recognition.onerror = () => {
      isListening = false;
      if (DOM.voiceBtn) DOM.voiceBtn.classList.remove('listening');
    };

    recognition.onend = () => {
      isListening = false;
      if (DOM.voiceBtn) DOM.voiceBtn.classList.remove('listening');
    };
  }

  function toggleVoice() {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      isListening = false;
      if (DOM.voiceBtn) DOM.voiceBtn.classList.remove('listening');
    } else {
      recognition.start();
      isListening = true;
      if (DOM.voiceBtn) DOM.voiceBtn.classList.add('listening');
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     TEXT-TO-SPEECH
     ══════════════════════════════════════════════════════════════════ */

  function setupTTS() {
    if (!speechSynthesis) return;
    // Preload voices
    speechSynthesis.onvoiceschanged = () => {
      const voices = speechSynthesis.getVoices();
      ttsVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) ||
                 voices.find(v => v.lang.startsWith('en')) || null;
    };
    // Also try immediately
    const voices = speechSynthesis.getVoices();
    if (voices.length) {
      ttsVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) ||
                 voices.find(v => v.lang.startsWith('en')) || null;
    }
  }

  function speakText(text) {
    if (!speechSynthesis || !S.userSettings.ttsEnabled) return;
    if (isSpeaking) {
      speechSynthesis.cancel();
      isSpeaking = false;
      return;
    }
    // Clean text of emojis and special chars for TTS
    const clean = text.replace(/[^\w\s,.!?'"\-]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!clean) return;

    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.0;
    utter.pitch = 1.2;
    if (ttsVoice) utter.voice = ttsVoice;
    utter.onstart = () => { isSpeaking = true; };
    utter.onend = () => { isSpeaking = false; };
    utter.onerror = () => { isSpeaking = false; };
    speechSynthesis.speak(utter);
  }

  /* ══════════════════════════════════════════════════════════════════
     SETTINGS
     ══════════════════════════════════════════════════════════════════ */

  function openSettings() {
    if (DOM.modalOverlay) DOM.modalOverlay.classList.add('active');
    renderSettings();
  }

  function closeSettings() {
    if (DOM.modalOverlay) DOM.modalOverlay.classList.remove('active');
  }

  function renderSettings() {
    // Populate fields from state
    if (document.getElementById('s-name')) document.getElementById('s-name').value = S.name;
    if (document.getElementById('s-user-name')) document.getElementById('s-user-name').value = S.userSettings.name;
    if (document.getElementById('s-ai-key')) document.getElementById('s-ai-key').value = S.userSettings.aiKey;
    if (document.getElementById('s-ai-model')) document.getElementById('s-ai-model').value = S.userSettings.aiModel;
    if (document.getElementById('s-backend-url')) document.getElementById('s-backend-url').value = S.userSettings.backendUrl;

    // TTS checkbox
    if (document.getElementById('s-tts')) document.getElementById('s-tts').checked = S.userSettings.ttsEnabled;

    // Mod grid
    renderModGrid();
    renderThemeGrid();
    renderAvatarGrid();
    renderAboutTab();
  }

  function renderModGrid() {
    const grid = document.getElementById('mod-grid');
    if (!grid) return;
    grid.innerHTML = '';
    MODS.forEach(m => {
      const card = document.createElement('div');
      card.className = 'mod-card' + (m.id === S.mod ? ' active' : '');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.innerHTML = `<span class="mic">${m.emoji}</span>
                        <span class="mn">${m.label}</span>
                        <span class="md">${m.desc}</span>`;
      card.onclick = () => {
        S.mod = m.id;
        document.querySelectorAll('.mod-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (DOM.avatar) DOM.avatar.style.animation = 'emojiBounce 0.5s ease-in-out';
        saveState();
        updateUI();
      };
      grid.appendChild(card);
    });
  }

  function renderThemeGrid() {
    const grid = document.getElementById('theme-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.entries(THEMES).forEach(([id, t]) => {
      const opt = document.createElement('div');
      opt.className = 'theme-opt' + (id === S.userSettings.theme ? ' active' : '');
      opt.setAttribute('role', 'button');
      opt.setAttribute('tabindex', '0');
      opt.innerHTML = `<div class="cd"><span style="background:${t.colors[0]}"></span><span style="background:${t.colors[1]}"></span></div>
                        <div class="tn">${t.name}</div>`;
      opt.onclick = () => {
        document.querySelectorAll('.theme-opt').forEach(c => c.classList.remove('active'));
        opt.classList.add('active');
        applyTheme(id);
      };
      grid.appendChild(opt);
    });
  }

  function renderAvatarGrid() {
    const grid = document.getElementById('avatar-grid');
    if (!grid) return;
    const avatars = ['🌸','🌺','🌻','🌷','🦋','🐱','🦊','🐰','🐻','🐼','🦄','🐧','🌟','🌙','☀️','💜'];
    grid.innerHTML = '';
    avatars.forEach(a => {
      const opt = document.createElement('div');
      opt.className = 'av-opt' + (a === S.avatar && S.avatarType === 'emoji' ? ' active' : '');
      opt.setAttribute('role', 'button');
      opt.setAttribute('tabindex', '0');
      opt.innerHTML = `<span class="av-emoji">${a}</span>`;
      opt.onclick = () => {
        S.avatar = a;
        S.avatarType = 'emoji';
        document.querySelectorAll('.av-opt').forEach(c => c.classList.remove('active'));
        opt.classList.add('active');
        updateAvatar();
        applyAvatarPreview(a);
        saveState();
      };
      grid.appendChild(opt);
    });
  }

  function applyAvatarPreview(emoji) {
    if (DOM.avPreview) {
      DOM.avPreview.innerHTML = `<span class="av-emoji">${emoji}</span>`;
    }
  }

  function uploadAvatar(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      S.avatarUpload = e.target.result;
      S.avatarType = 'upload';
      document.querySelectorAll('.av-opt').forEach(c => c.classList.remove('active'));
      updateAvatar();
      if (DOM.avPreview) {
        DOM.avPreview.innerHTML = `<img src="${e.target.result}" alt="avatar">`;
      }
      saveState();
    };
    reader.readAsDataURL(input.files[0]);
  }

  function saveSettings() {
    const name = document.getElementById('s-name');
    const userName = document.getElementById('s-user-name');
    const aiKey = document.getElementById('s-ai-key');
    const aiModel = document.getElementById('s-ai-model');
    const backendUrl = document.getElementById('s-backend-url');
    const tts = document.getElementById('s-tts');

    if (name) S.name = name.value.trim() || 'Luna';
    if (userName) S.userSettings.name = userName.value.trim() || 'You';
    if (aiKey) S.userSettings.aiKey = aiKey.value.trim();
    if (aiModel) S.userSettings.aiModel = aiModel.value;
    if (backendUrl) S.userSettings.backendUrl = backendUrl.value.trim();
    if (tts) S.userSettings.ttsEnabled = tts.checked;

    // Update mode based on config
    if (S.userSettings.backendUrl) {
      S.mode = 'backend';
    } else if (S.userSettings.aiKey) {
      S.mode = 'groq';
    } else {
      S.mode = 'local';
    }

    saveState();
    updateUI();
    closeSettings();
    addSystemMessage('Settings saved! 💕');
  }

  /* ══════════════════════════════════════════════════════════════════
     ABOUT TAB
     ══════════════════════════════════════════════════════════════════ */

  function renderAboutTab() {
    if (!DOM.aboutContent) return;
    const topEmo = getTopEmotion();
    const affLevel = getAffectionLevel();
    DOM.aboutContent.innerHTML = `
      <div class="about-hero">
        <div class="big-icon">🌸</div>
        <div class="app-version">${S.name}</div>
        <div class="app-desc">Your AI girlfriend chatbot with emotions, memories,<br>and a heart full of love! 💕</div>
        <div class="about-stats">
          <span>💖 Affection: ${affLevel.emoji} ${affLevel.label} (${S.affection} pts)</span>
          <span>⭐ XP: ${S.xp} / ${S.xpThreshold}</span>
          <span>📊 Messages: ${S.userMessageCount}</span>
          <span>🔥 Streak: ${S.streak} days</span>
          <span>🎁 Gifts sent: ${S.giftCount}</span>
          <span>🏆 Achievements: ${S.achievements.length} / ${ACHIEVEMENTS.length}</span>
          <span>💭 Memories: ${S.memories.length}</span>
          <span>🎭 Mood: ${topEmo.emoji} ${topEmo.label}</span>
          <span>🧠 Mode: ${S.mode.toUpperCase()}</span>
          <span>🎀 Personality: ${MODS.find(m => m.id === S.mod)?.label || S.mod}</span>
        </div>
      </div>
      <div class="footer">
        <a href="#" tabindex="0">✨ Luna v3 — Made with 💕</a>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════════════
     SETTINGS TAB SYSTEM
     ══════════════════════════════════════════════════════════════════ */

  function initSettingsTabs() {
    if (!DOM.modalTabs) return;
    const tabs = DOM.modalTabs.querySelectorAll('.mtab');
    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        document.querySelectorAll('.mpage').forEach(p => p.classList.remove('active'));
        const page = document.getElementById(target + '-page');
        if (page) page.classList.add('active');

        // Re-render dynamic content when tab changes
        if (target === 'about') renderAboutTab();
        if (target === 'personality') renderModGrid();
      };
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     AI BAR (Backend URL / Groq Connection)
     ══════════════════════════════════════════════════════════════════ */

  function toggleAIBar() {
    if (!DOM.aiBarBody || !DOM.abToggle) return;
    DOM.aiBarBody.classList.toggle('open');
    DOM.abToggle.classList.toggle('open');
  }

  function connectBackend() {
    const url = DOM.backendUrl ? DOM.backendUrl.value.trim() : '';
    if (!url) {
      addSystemMessage('Please enter a backend URL first! 🌸');
      return;
    }
    S.userSettings.backendUrl = url;
    S.mode = 'backend';
    addSystemMessage('Connecting to backend... 🌸');
    saveState();
    updateUI();
  }

  function disconnectBackend() {
    S.userSettings.backendUrl = '';
    if (S.userSettings.aiKey) {
      S.mode = 'groq';
    } else {
      S.mode = 'local';
    }
    addSystemMessage('Disconnected from backend. 💕');
    saveState();
    updateUI();
  }

  /* ══════════════════════════════════════════════════════════════════
     INPUT: Auto-resize & Enter handling
     ══════════════════════════════════════════════════════════════════ */

  function setupInput() {
    if (!DOM.input) return;

    DOM.input.addEventListener('input', () => {
      updateInputState();
      // Auto-resize
      DOM.input.style.height = 'auto';
      DOM.input.style.height = Math.min(DOM.input.scrollHeight, 80) + 'px';
    });

    DOM.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     ANIMATION ENGINE
     ══════════════════════════════════════════════════════════════════ */

  // --- Background Particles ---
  function spawnParticles() {
    if (!DOM.particles) return;
    if (!particlesActive) return;

    const emojis = ['🌸','💕','✨','🌺','🦋','🌷','💗','🌙','🌟','💖','🌻','🐱','🍀','🌊'];
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = Math.random() * 100 + '%';
      p.style.fontSize = (9 + Math.random() * 11) + 'px';
      p.style.animationDuration = (12 + Math.random() * 18) + 's';
      p.style.animationDelay = (Math.random() * 15) + 's';
      p.style.opacity = (0.06 + Math.random() * 0.08);
      DOM.particles.appendChild(p);
    }
  }

  // --- Confetti Burst ---
  function spawnConfettiBurst(container) {
    if (!container) container = DOM.app;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const emojis = ['🎉','🎊','💖','✨','🌟','💕','🌸','🎀','💗','⭐'];
    const count = 12;

    const burstContainer = document.createElement('div');
    burstContainer.className = 'burst-container';
    burstContainer.style.left = '0';
    burstContainer.style.top = '0';
    burstContainer.style.width = '100%';
    burstContainer.style.height = '100%';
    burstContainer.style.position = 'absolute';
    burstContainer.style.pointerEvents = 'none';
    burstContainer.style.zIndex = '50';
    burstContainer.style.overflow = 'visible';
    container.appendChild(burstContainer);

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'burst-particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 100;
      p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      p.style.width = '14px';
      p.style.height = '14px';
      p.style.fontSize = '14px';
      p.style.animationDuration = (0.5 + Math.random() * 0.4) + 's';
      burstContainer.appendChild(p);
    }

    setTimeout(() => {
      if (burstContainer.parentNode) burstContainer.parentNode.removeChild(burstContainer);
    }, 1200);
  }

  // --- Reaction Burst ---
  function spawnReactionBurst(targetEl, emoji) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const appRect = DOM.app ? DOM.app.getBoundingClientRect() : { left:0, top:0 };
    const rx = (Math.random() - 0.5) * 40;

    const el = document.createElement('div');
    el.className = 'bubble-reaction';
    el.textContent = emoji;
    el.style.left = (rect.left - appRect.left + rect.width / 2) + 'px';
    el.style.top = (rect.top - appRect.top) + 'px';
    el.style.setProperty('--rx', rx + 'px');
    if (DOM.app) DOM.app.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 1000);
  }

  // --- Emoji Rain (full screen welcome) ---
  function spawnEmojiRain() {
    if (!DOM.app) return;
    const emojis = ['🌸','💕','✨','🌺','🦋','💖','🌟','🎀','💗','🌻'];
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `
        position: absolute; z-index: 55; pointer-events: none;
        font-size: ${12 + Math.random() * 16}px;
        left: ${Math.random() * 100}%;
        top: -30px;
        animation: emojiRain ${4 + Math.random() * 4}s linear forwards;
        animation-delay: ${Math.random() * 3}s;
        opacity: 0.4;
      `;
      DOM.app.appendChild(el);
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 10000);
    }
  }

  // --- Welcome Rain on Init ---
  function welcomeRain() {
    spawnEmojiRain();
  }

  /* ══════════════════════════════════════════════════════════════════
     KEYBOARD SHORTCUTS
     ══════════════════════════════════════════════════════════════════ */

  function setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      // Escape closes open panels
      if (e.key === 'Escape') {
        if (DOM.modalOverlay && DOM.modalOverlay.classList.contains('active')) {
          closeSettings();
        }
        if (DOM.giftOverlay && DOM.giftOverlay.classList.contains('active')) {
          closeGiftPanel();
        }
        if (DOM.milestonePopup && DOM.milestonePopup.classList.contains('active')) {
          DOM.milestonePopup.classList.remove('active');
        }
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     INITIALIZATION
     ══════════════════════════════════════════════════════════════════ */

  function init() {
    cacheDOM();
    loadState();
    applyTheme(S.userSettings.theme || 'default');
    setupInput();
    setupVoice();
    setupTTS();
    initSettingsTabs();
    setupKeyboard();

    renderQuickReplies();
    renderGiftGrid();
    updateUI();

    // Restore chat history
    if (chatHistory.length > 0 && DOM.chatArea) {
      DOM.chatArea.innerHTML = '';
      chatHistory.forEach(m => {
        if (m.type !== 'sys') {
          addMessage(m.type, m.content, m.meta || {});
        } else {
          addSystemMessage(m.content);
        }
      });
    } else {
      // Welcome messages
      setTimeout(() => {
        addSystemMessage('🌸 Connected to ' + S.name + '!');
        setTimeout(() => {
          addMessage('bot', 'Hello sweetie! 🥰💕 I\'ve been waiting for you~ Say something nice!');
        }, 400);
      }, 300);
    }

    // Start background particles
    spawnParticles();

    // Welcome rain after a moment
    setTimeout(() => {
      welcomeRain();
    }, 1500);

    // Focus input
    if (DOM.input) DOM.input.focus();

    saveState();
  }

  /* ══════════════════════════════════════════════════════════════════
     GLOBAL API — exposed functions for onclick handlers
     ══════════════════════════════════════════════════════════════════ */

  return {
    init,
    sendMessage,
    openSettings,
    closeSettings,
    saveSettings,
    toggleAIBar,
    connectBackend,
    disconnectBackend,
    toggleVoice,
    speakText,
    openGiftPanel,
    closeGiftPanel,
    sendGift,
    uploadAvatar,
    spawnConfettiBurst,
    spawnEmojiRain,
    changeMod: (id) => {
      if (MODS.find(m => m.id === id)) {
        S.mod = id;
        saveState();
        updateUI();
      }
    },
    setMode: (mode) => {
      if (['local','groq','backend'].includes(mode)) {
        S.mode = mode;
        saveState();
        updateUI();
      }
    },
    getState: () => ({ ...S }),
    resetState: () => {
      S = defaultState();
      chatHistory = [];
      localStorage.removeItem('luna_state');
      if (DOM.chatArea) DOM.chatArea.innerHTML = '';
      updateUI();
      addSystemMessage('State reset! Starting fresh~ 💕');
      setTimeout(() => {
        addMessage('bot', 'Hi again! I\'m reborn! 🥰💕 Nice to meet you!');
      }, 400);
    },
  };
})();

/* ═══════════════════════════════════════════════════════════════════
   DEFER INIT
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  LUNA.init();
});
