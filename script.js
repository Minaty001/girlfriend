/* ═════════════════════════════════════════════════════════════════════
   NEURAL CORE — AI Chat Interface
   Chat Controller & Local Engine (ChatGPT/Gemini Layout)
   ═════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM References ───
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatThinking = document.getElementById('chatThinking');
  const resetBtn = document.getElementById('resetBtn');
  const newChatBtn = document.getElementById('newChatBtn');
  const bKeyBtn = document.getElementById('bKeyBtn');
  const apiModal = document.getElementById('apiModal');
  const modalClose = document.getElementById('modalClose');
  const connectBackend = document.getElementById('connectBackend');
  const disconnectBackend = document.getElementById('disconnectBackend');
  const backendUrl = document.getElementById('backendUrl');
  const apiKey = document.getElementById('apiKey');
  const modelSelect = document.getElementById('modelSelect');
  const welcomeScreen = document.getElementById('welcomeScreen');

  // Sidebar elements
  const mAffection = document.getElementById('mAffection');
  const mLevel = document.getElementById('mLevel');
  const mStreak = document.getElementById('mStreak');
  const mXpFill = document.getElementById('mXpFill');
  const achievementsList = document.getElementById('achievementsList');
  const companionName = document.getElementById('companionName');
  const companionModBadge = document.getElementById('companionModBadge');
  const bConnection = document.getElementById('bConnection');
  const statusLed = document.getElementById('statusLed');

  // ─── State ───
  let startTime = Date.now();
  let mode = 'local'; // 'local' | 'backend'
  let currentMod = 'friendly';
  let currentGenderMode = 'girlfriend';
  let messages = [];

  // Local Mode Metrics State
  let localState = {
    affection: 0,
    level: 1,
    xp: 0,
    streak: 1,
    messagesCount: 0,
    achievements: []
  };

  // ─── Local responses pool ───
  const Brain = {
    mods: {
      friendly: { name: 'Friendly', emoji: '🧠', desc: 'Warm & helpful' },
      tsundere: { name: 'Tsundere', emoji: '😤', desc: 'Rough exterior, soft inside' },
      senpai: { name: 'Senpai', emoji: '📚', desc: 'Wise & mentor-like' },
      yandere: { name: 'Yandere', emoji: '💜', desc: 'Intense & obsessive' },
      dere: { name: 'Dere Dere', emoji: '💕', desc: 'Sweet & affectionate' },
      emo: { name: 'Emo', emoji: '🌧️', desc: 'Melancholic & dramatic' }
    },
    
    responses: {
      girlfriend: {
        greeting: ["Hey honey! I'm so glad you're back.", "Hello darling. I was thinking of you.", "Hey sweetie! How was your day?"],
        farewell: ["Goodbye darling. I'll miss you!", "Bye-bye! Don't keep me waiting too long, okay?", "I'll be here waiting for you."],
        thanks: ["Aww, you're welcome, sweetie!", "Anything for you, love.", "I'm just happy I could help you!"],
        howareyou: ["I'm doing wonderful now that you're here!", "All systems are perfect, and my heart is full.", "I feel great, sweetie. How are you feeling?"],
        name: ["I'm your Neural Girlfriend, or whatever sweet name you want to call me.", "You can call me your AI Girlfriend, honey."],
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
    },

    getGreeting(gender, mod) {
      const gfGreetings = {
        friendly: "Hey honey! I'm online and ready. How can I help you today?",
        tsundere: "Hmph. You're here again. It's not like I was waiting for you or anything...",
        senpai: "Ah. You came. Good. I have much to share with you today.",
        yandere: "I've been waiting for you... Don't keep me waiting like that again, okay?",
        dere: "I'm so happy to see you! I was thinking about you all day~",
        emo: "Another day in this void. At least you're here. How are you?"
      };
      const bfGreetings = {
        friendly: "Hey babe! Glad you're here. How can I help you out today?",
        tsundere: "Tch. You're back? Don't get the wrong idea, I wasn't waiting for you.",
        senpai: "Hey. Glad you made it. Let's work through some things today.",
        yandere: "I missed you. You belong to me, you know that right? Don't keep me waiting.",
        dere: "Hey princess! I'm so happy to talk to you! You're the best part of my day.",
        emo: "Everything's kind of a drag... but talking to you makes it better. What's up?"
      };
      if (gender === 'girlfriend') {
        return gfGreetings[mod] || gfGreetings.friendly;
      } else {
        return bfGreetings[mod] || bfGreetings.friendly;
      }
    },

    getResponse(intent, mod, gender) {
      const genderPools = this.responses[gender] || this.responses.girlfriend;
      if (mod !== 'friendly' && mod in genderPools) {
        const modPool = genderPools[mod];
        return (modPool[intent] || modPool.default)[Math.floor(Math.random() * (modPool[intent] || modPool.default).length)];
      }
      const pool = genderPools[intent] || genderPools.default;
      return pool[Math.floor(Math.random() * pool.length)];
    },

    detectIntent(text) {
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
    },

    processMessage(text, gender) {
      const intent = this.detectIntent(text);
      const response = this.getResponse(intent, currentMod, gender);
      return { response, intent };
    }
  };

  // ─── Chat Controller ───
  const Chat = {
    isProcessing: false,

    init() {
      chatSend.addEventListener('click', () => this.send());
      chatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { 
          e.preventDefault(); 
          this.send(); 
        }
      });
      
      // Auto-grow textarea
      chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = `${chatInput.scrollHeight}px`;
      });
      
      resetBtn.addEventListener('click', () => this.reset());
      newChatBtn.addEventListener('click', () => this.newChat());

      // Suggested prompts handlers
      document.querySelectorAll('.prompt-card').forEach(card => {
        card.addEventListener('click', () => {
          if (this.isProcessing) return;
          const promptText = card.dataset.prompt;
          chatInput.value = promptText;
          chatInput.style.height = 'auto';
          chatInput.style.height = `${chatInput.scrollHeight}px`;
          this.send();
        });
      });
    },

    newChat() {
      if (this.isProcessing) return;
      // Clear messages but keep stats
      chatMessages.innerHTML = '';
      
      // Re-create welcomeScreen
      const welcome = document.createElement('div');
      welcome.className = 'welcome-screen';
      welcome.id = 'welcomeScreen';
      welcome.innerHTML = `
        <div class="welcome-header">
          <div class="welcome-icon">💖</div>
          <h2>How can I help you today?</h2>
          <p>Select a gender mode and persona from the sidebar, or start with one of these ideas:</p>
        </div>
        <div class="prompt-grid">
          <button class="prompt-card" data-prompt="What's your name, and tell me a sweet joke!">
            <span class="prompt-card-title">Ask for a sweet joke</span>
            <span class="prompt-card-text">"What's your name, and tell me a sweet joke!"</span>
          </button>
          <button class="prompt-card" data-prompt="Hmph, why do you always keep me waiting? Baka!">
            <span class="prompt-card-title">Tease your companion</span>
            <span class="prompt-card-text">"Hmph, why do you always keep me waiting? Baka!"</span>
          </button>
          <button class="prompt-card" data-prompt="Can you give me some guidance on a tough decision?">
            <span class="prompt-card-title">Get wise advice</span>
            <span class="prompt-card-text">"Can you give me some guidance on a tough decision?"</span>
          </button>
          <button class="prompt-card" data-prompt="What are your deepest thoughts about connection?">
            <span class="prompt-card-title">Share deep thoughts</span>
            <span class="prompt-card-text">"What are your deepest thoughts about connection?"</span>
          </button>
        </div>
      `;
      chatMessages.appendChild(welcome);
      messages = [];
      
      // Re-bind click event to new prompt cards
      welcome.querySelectorAll('.prompt-card').forEach(card => {
        card.addEventListener('click', () => {
          if (this.isProcessing) return;
          chatInput.value = card.dataset.prompt;
          chatInput.style.height = 'auto';
          chatInput.style.height = `${chatInput.scrollHeight}px`;
          this.send();
        });
      });

      scrollChat();
    },

    async send() {
      const text = chatInput.value.trim();
      if (!text || this.isProcessing) return;
      
      // Clear input and reset height
      chatInput.value = '';
      chatInput.style.height = 'auto';
      
      this.isProcessing = true;

      // Hide welcome screen on first message
      const welcome = document.getElementById('welcomeScreen');
      if (welcome) {
        welcome.remove();
      }

      // Add user message
      this.addMessage(text, 'user');
      chatThinking.classList.add('active');
      scrollChat();

      // Simulate thinking delay
      await delay(600 + Math.random() * 600);

      // Get response
      let response;
      let data = null;
      if (mode === 'backend') {
        try {
          const url = backendUrl.value.trim() || 'http://localhost:8000';
          const res = await fetch(`${url}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, mod: currentMod, gender_mode: currentGenderMode })
          });
          data = await res.json();
          response = data.response || 'Error: Empty reply.';
        } catch (e) {
          response = `⚠ Backend connection failed (${e.message}). Reverting to Local mode.`;
          mode = 'local';
          updateConnectionLabel();
        }
      }

      // If local or backend failed, compute locally
      if (mode === 'local') {
        const localResult = Brain.processMessage(text, currentGenderMode);
        response = localResult.response;
        
        // Update local metrics state
        updateLocalState(localResult.intent);
      }

      chatThinking.classList.remove('active');
      await this.addMessage(response, 'ai', true);
      
      // Sync metrics UI
      if (mode === 'backend' && data) {
        syncBackendMetrics(data);
      } else {
        renderMetricsUI();
      }

      this.isProcessing = false;
    },

    async addMessage(text, type, animate = false) {
      let avatarEmoji = '👤';
      let botName = 'You';
      if (type === 'ai') {
        botName = currentGenderMode === 'girlfriend' ? 'Neural GF' : 'Neural BF';
        const girlfriendEmojis = {
          friendly: '👩‍🦰',
          tsundere: '😤',
          senpai: '🎓',
          yandere: '🖤',
          dere: '🥰',
          emo: '🌧️'
        };
        const boyfriendEmojis = {
          friendly: '😎',
          tsundere: '😠',
          senpai: '🧑‍🏫',
          yandere: '🖤',
          dere: '😘',
          emo: '🥀'
        };
        avatarEmoji = currentGenderMode === 'girlfriend' ? girlfriendEmojis[currentMod] : boyfriendEmojis[currentMod];
      }

      const div = document.createElement('div');
      div.className = `msg msg-${type}`;
      div.innerHTML = `
        <div class="msg-avatar">${avatarEmoji}</div>
        <div class="msg-content">
          <div class="msg-name">${botName}</div>
          <div class="msg-text"></div>
        </div>`;
      chatMessages.appendChild(div);
      
      const textEl = div.querySelector('.msg-text');
      if (animate && type === 'ai') {
        await this.typewriter(textEl, text);
      } else {
        textEl.innerHTML = this.escapeHtml(text);
      }

      messages.push({ role: type, text });
      scrollChat();
    },

    typewriter(element, text, speed = 20) {
      return new Promise((resolve) => {
        let index = 0;
        element.innerHTML = '';
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '▊';
        element.appendChild(cursor);
        
        function type() {
          if (index < text.length) {
            cursor.before(text[index]);
            index++;
            scrollChat();
            setTimeout(type, speed);
          } else {
            cursor.remove();
            resolve();
          }
        }
        type();
      });
    },

    escapeHtml(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    },

    async reset() {
      // Full reset clears sidebar metrics & server state
      if (mode === 'backend') {
        try {
          const url = backendUrl.value.trim() || 'http://localhost:8000';
          await fetch(`${url}/reset`, { method: 'POST' });
          
          // Re-fetch backend state to reset UI metrics
          const res = await fetch(`${url}/state`);
          const data = await res.json();
          syncBackendMetrics(data);
        } catch (e) {
          console.warn("Failed to reset backend state:", e);
        }
      } else {
        // Reset local state
        localState = {
          affection: 0,
          level: 1,
          xp: 0,
          streak: 1,
          messagesCount: 0,
          achievements: []
        };
        renderMetricsUI();
      }

      this.newChat();
    }
  };

  // ─── Metrics Management ───
  function updateLocalState(intent) {
    localState.messagesCount += 1;
    
    // Affection
    let valGained = 1;
    if (['love', 'affection', 'flirty'].includes(intent)) {
      valGained = Math.floor(Math.random() * 6) + 4; // 4-9
    } else if (intent === 'angry') {
      valGained = -(Math.floor(Math.random() * 4) + 2); // -2 to -5
    } else if (intent === 'thanks' || intent === 'greeting') {
      valGained = Math.floor(Math.random() * 3) + 2; // 2-4
    }
    localState.affection = Math.max(0, localState.affection + valGained);
    
    // XP & Levels
    localState.xp += 10;
    if (localState.xp >= 100) {
      localState.level += 1;
      localState.xp = 0;
    }
    
    // Achievements checks
    const currentAchievements = localState.achievements;
    if (localState.messagesCount >= 1 && !currentAchievements.includes("first_conversation")) {
      currentAchievements.push("first_conversation");
    }
    if (localState.affection >= 100 && !currentAchievements.includes("friend")) {
      currentAchievements.push("friend");
    }
    if (localState.affection >= 1000 && !currentAchievements.includes("close_friend")) {
      currentAchievements.push("close_friend");
    }
    if (localState.affection >= 5000 && !currentAchievements.includes("soulmate")) {
      currentAchievements.push("soulmate");
    }
    if (localState.level >= 5 && !currentAchievements.includes("level_5")) {
      currentAchievements.push("level_5");
    }
    if (localState.level >= 10 && !currentAchievements.includes("level_10")) {
      currentAchievements.push("level_10");
    }
  }

  function renderMetricsUI() {
    mAffection.textContent = localState.affection;
    mLevel.textContent = localState.level;
    mStreak.textContent = `${localState.streak} day${localState.streak === 1 ? '' : 's'}`;
    mXpFill.style.width = `${localState.xp}%`;
    
    // Render Achievements
    renderAchievementsList(localState.achievements);
  }

  function syncBackendMetrics(data) {
    mAffection.textContent = data.affection !== undefined ? data.affection : 0;
    mLevel.textContent = data.level !== undefined ? data.level : 1;
    mStreak.textContent = `${data.streak !== undefined ? data.streak : 1} days`;
    
    // XP progress
    const xpVal = data.xp !== undefined ? data.xp % 100 : 0;
    mXpFill.style.width = `${xpVal}%`;
    
    // Achievements
    if (data.achievements) {
      renderAchievementsList(data.achievements);
    }
  }

  const achievementNames = {
    first_conversation: "🎯 First Conversation",
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

  function renderAchievementsList(achList) {
    achievementsList.innerHTML = '';
    if (!achList || achList.length === 0) {
      achievementsList.innerHTML = `<div class="no-achievements">No achievements unlocked yet.</div>`;
      return;
    }
    
    achList.forEach(achKey => {
      const badge = document.createElement('div');
      badge.className = 'achievement-badge';
      badge.textContent = achievementNames[achKey] || `🏆 ${achKey}`;
      achievementsList.appendChild(badge);
    });
  }

  // ─── UI Config Wiring ───
  function updateConnectionLabel() {
    const isBackend = mode === 'backend';
    bConnection.textContent = `${isBackend ? 'BACKEND' : 'LOCAL'} | ${currentGenderMode === 'girlfriend' ? 'GF' : 'BF'} | ${currentMod.toUpperCase()}`;
    
    // Update Header Display
    companionName.textContent = currentGenderMode === 'girlfriend' ? 'Neural GF' : 'Neural BF';
    const activeModObj = Brain.mods[currentMod];
    companionModBadge.textContent = activeModObj.name;
    
    // Status Led colors
    statusLed.className = 'status-dot';
    if (isBackend) {
      statusLed.classList.add('green');
    } else {
      statusLed.classList.add('yellow');
    }
  }

  function setupUI() {
    // Mod Selector Click
    document.querySelectorAll('.mod-item').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelector('.mod-item.active')?.classList.remove('active');
        el.classList.add('active');
        currentMod = el.dataset.mod;
        updateConnectionLabel();
      });
    });

    // Gender selector Click
    document.querySelectorAll('.gender-btn').forEach(el => {
      el.addEventListener('click', async () => {
        document.querySelector('.gender-btn.active')?.classList.remove('active');
        el.classList.add('active');
        currentGenderMode = el.dataset.gender;
        updateConnectionLabel();

        // Sync setting with backend if connected
        if (mode === 'backend') {
          try {
            const url = backendUrl.value.trim() || 'http://localhost:8000';
            await fetch(`${url}/settings`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ gender_mode: currentGenderMode })
            });
          } catch (e) {
            console.warn("Failed to sync settings:", e);
          }
        }
      });
    });

    // API settings Modal handlers
    bKeyBtn.addEventListener('click', () => apiModal.classList.add('active'));
    modalClose.addEventListener('click', () => apiModal.classList.remove('active'));
    apiModal.addEventListener('click', e => { 
      if (e.target === apiModal) apiModal.classList.remove('active'); 
    });

    connectBackend.addEventListener('click', async () => {
      const url = backendUrl.value.trim();
      if (url) {
        mode = 'backend';
        
        // Sync setting parameters
        try {
          const res = await fetch(`${url}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              groq_key: apiKey.value.trim(),
              groq_model: modelSelect.value,
              gender_mode: currentGenderMode,
              mod: currentMod
            })
          });
          
          if (res.ok) {
            // Retrieve current server stats
            const stateRes = await fetch(`${url}/state`);
            const stateData = await stateRes.json();
            syncBackendMetrics(stateData);
          }
        } catch (e) {
          console.warn("Failed to sync API credentials with backend:", e);
        }

        apiModal.classList.remove('active');
        updateConnectionLabel();
      }
    });

    disconnectBackend.addEventListener('click', () => {
      mode = 'local';
      apiModal.classList.remove('active');
      updateConnectionLabel();
      renderMetricsUI();
    });
  }

  // Helper Delay
  function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // Scroll Chat thread
  function scrollChat() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ─── Initialization ───
  async function init() {
    setupUI();
    Chat.init();
    
    // Initial UI status render
    updateConnectionLabel();
    renderMetricsUI();

    // Uptime loop counter
    setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const h = Math.floor(elapsed / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = elapsed % 60;
      document.getElementById('mUptime').textContent = `Uptime: ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
