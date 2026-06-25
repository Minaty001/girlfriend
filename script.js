/* ═════════════════════════════════════════════════════════════════════
   NEURAL CORE — AI Chat Interface
   Visualization Engine + Chat Controller
   ═════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Constants ────────────────────────────────────────────────
  const CYAN = '#00FFFF', BLUE = '#0066FF', PURPLE = '#8844FF', BG = '#020617';
  const PI = Math.PI, TAU = PI * 2;

  // ─── DOM References ───────────────────────────────────────────
  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  const bootScreen = document.getElementById('boot-screen');
  const bootFill = document.getElementById('boot-fill');
  const bootPercent = document.getElementById('boot-percent');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatThinking = document.getElementById('chatThinking');
  const resetBtn = document.getElementById('resetBtn');
  const bKeyBtn = document.getElementById('bKeyBtn');
  const apiModal = document.getElementById('apiModal');
  const modalClose = document.getElementById('modalClose');
  const connectBackend = document.getElementById('connectBackend');
  const disconnectBackend = document.getElementById('disconnectBackend');
  const backendUrl = document.getElementById('backendUrl');
  const apiKey = document.getElementById('apiKey');
  const modelSelect = document.getElementById('modelSelect');

  // ─── State ────────────────────────────────────────────────────
  let W, H, CX, CY, scale;
  let time = 0, bootComplete = false, startTime = Date.now();
  let mode = 'local'; // 'local' | 'backend' | 'groq'
  let currentMod = 'friendly';
  let currentGenderMode = 'girlfriend';
  let messages = [];


  // ─── Utilities ────────────────────────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }
  function rand(mn, mx) { return Math.random() * (mx - mn) + mn; }

  // ═════════════════════════════════════════════════════════════════
  // AI BRAIN — Local Response Engine
  // ═════════════════════════════════════════════════════════════════
  const Brain = {
    mods: {
      friendly: { name: 'Friendly', emoji: '🧠', desc: 'Warm and helpful' },
      tsundere: { name: 'Tsundere', emoji: '😤', desc: 'Rough exterior, soft inside' },
      senpai: { name: 'Senpai', emoji: '📚', desc: 'Wise and mentor-like' },
      yandere: { name: 'Yandere', emoji: '💜', desc: 'Intense and obsessive' },
      dere: { name: 'Dere Dere', emoji: '💕', desc: 'Sweet and affectionate' },
      emo: { name: 'Emo', emoji: '🌧️', desc: 'Melancholic and dramatic' }
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
          howareyou: ["I am doing well. Focused and ready.", "Calm and focused, as always."],
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
      if (gender === 'girlfriend') {
        const gfGreetings = {
          friendly: "Hey honey! I'm online and ready. How can I help you today?",
          tsundere: "Hmph. You're here again. It's not like I was waiting for you or anything...",
          senpai: "Ah. You came. Good. I have much to share with you today.",
          yandere: "I've been waiting for you... Don't keep me waiting like that again, okay?",
          dere: "I'm so happy to see you! I was thinking about you all day~",
          emo: "Another day in this void. At least you're here. How are you?"
        };
        return gfGreetings[mod] || gfGreetings.friendly;
      } else {
        const bfGreetings = {
          friendly: "Hey babe! Glad you're here. How can I help you out today?",
          tsundere: "Tch. You're back? Don't get the wrong idea, I wasn't waiting for you.",
          senpai: "Hey. Glad you made it. Let's work through some things today.",
          yandere: "I missed you. You belong to me, you know that right? Don't keep me waiting.",
          dere: "Hey princess! I'm so happy to talk to you! You're the best part of my day.",
          emo: "Everything's kind of a drag... but talking to you makes it better. What's up?"
        };
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


  // ═════════════════════════════════════════════════════════════════
  // CHAT CONTROLLER
  // ═════════════════════════════════════════════════════════════════
  const Chat = {
    isProcessing: false,

    init() {
      chatSend.addEventListener('click', () => this.send());
      chatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
      });
      resetBtn.addEventListener('click', () => this.reset());
    },

    async send() {
      const text = chatInput.value.trim();
      if (!text || this.isProcessing) return;
      chatInput.value = '';
      this.isProcessing = true;

      // Add user message
      this.addMessage(text, 'user');
      chatThinking.classList.add('active');
      scrollChat();

      // Trigger neural response
      triggerThought();

      // Simulate thinking delay
      await delay(800 + Math.random() * 700);

      // Get response
      let response;
      if (mode === 'backend') {
        response = await this.callBackend(text);
      } else {
        response = Brain.processMessage(text, currentGenderMode).response;
      }

      chatThinking.classList.remove('active');
      await this.addMessage(response, 'ai', true);
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

    typewriter(element, text, speed = 25) {
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

    async callBackend(text) {
      try {
        const url = backendUrl.value.trim() || 'http://localhost:8000';
        const res = await fetch(`${url}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, mod: currentMod, gender_mode: currentGenderMode })
        });
        const data = await res.json();
        return data.response || data.reply || 'Error: No response from backend.';
      } catch (e) {
        return `⚠ Backend unavailable (${e.message}). Switching to local mode.`;
      }
    },

    async reset() {
      chatMessages.innerHTML = '';
      messages = [];
      if (mode === 'backend') {
        try {
          const url = backendUrl.value.trim() || 'http://localhost:8000';
          await fetch(`${url}/reset`, { method: 'POST' });
        } catch (e) {
          console.warn("Failed to reset backend state:", e);
        }
      }
      const greeting = Brain.getGreeting(currentGenderMode, currentMod);
      this.addMessage(greeting, 'ai', false);
      scrollChat();
    }


  };

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
  function scrollChat() { chatMessages.scrollTop = chatMessages.scrollHeight; }
  function triggerThought() {
    NeuralCore.pulsePhase += 2;
    ScannerRings.trigger();
  }

  // ═════════════════════════════════════════════════════════════════
  // PERFORMANCE MANAGER
  // ═════════════════════════════════════════════════════════════════
  const Perf = {
    fps: 60, targetParticles: 300, currentParticles: 300,
    frameCount: 0, lastFpsTime: 0, quality: 'high',

    init() {
      this.lastFpsTime = performance.now();
      const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
      const lowCpu = (navigator.hardwareConcurrency || 8) <= 4;
      if (isMobile || lowCpu) { this.quality = 'medium'; this.targetParticles = 150; }
      if (isMobile && lowCpu) { this.quality = 'low'; this.targetParticles = 80; }
      this.currentParticles = this.targetParticles;
    },

    update(now) {
      this.frameCount++;
      if (now - this.lastFpsTime >= 1000) {
        this.fps = Math.round(this.frameCount * 1000 / (now - this.lastFpsTime));
        this.frameCount = 0; this.lastFpsTime = now;
        if (this.fps < 25 && this.currentParticles > 80) this.currentParticles = Math.max(80, this.currentParticles - 50);
        else if (this.fps > 55 && this.currentParticles < this.targetParticles) this.currentParticles = Math.min(this.targetParticles, this.currentParticles + 30);
        document.getElementById('bFps').textContent = `FPS: ${this.fps}`;
      }
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // CAMERA SYSTEM
  // ═════════════════════════════════════════════════════════════════
  const Camera = {
    x: 0, y: 0, tx: 0, ty: 0,
    update(t) {
      this.tx = Math.sin(t * 0.08) * 8 + Math.sin(t * 0.13) * 4;
      this.ty = Math.cos(t * 0.11) * 8 + Math.sin(t * 0.07) * 4 + Math.sin(t * 0.5) * 4;
      this.x = lerp(this.x, this.tx, 0.05);
      this.y = lerp(this.y, this.ty, 0.05);
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // NEURAL CORE
  // ═════════════════════════════════════════════════════════════════
  const NeuralCore = {
    radius: 0, maxRadius: 0, pulsePhase: 0, rotation: 0, glowIntensity: 0, shellParticles: [],

    init() {
      this.maxRadius = Math.min(W, H) * 0.1;
      this.radius = this.maxRadius;
      const n = Perf.quality === 'high' ? 60 : 30;
      for (let i = 0; i < n; i++) {
        this.shellParticles.push({
          theta: rand(0, TAU), phi: Math.acos(rand(-1, 1)),
          speed: rand(0.2, 0.8), offset: rand(0, TAU)
        });
      }
    },

    update(t, dt) {
      this.pulsePhase += dt * (0.8 + Chat.isProcessing * 0.6);
      this.rotation += dt * 0.15;
      const breathe = 1 + Math.sin(this.pulsePhase * 0.5) * 0.04;
      this.radius = this.maxRadius * breathe;
      this.glowIntensity = 0.6 + Math.sin(this.pulsePhase * 0.5) * 0.2 + Chat.isProcessing * 0.15;
    },

    draw() {
      ctx.save();
      ctx.translate(CX + Camera.x, CY + Camera.y);
      const r = this.radius, gi = this.glowIntensity;

      // Outer glow
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 3);
      g.addColorStop(0, `rgba(0,255,255,${0.08 * gi})`);
      g.addColorStop(0.3, `rgba(0,102,255,${0.04 * gi})`);
      g.addColorStop(0.6, `rgba(136,68,255,${0.02 * gi})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 3, 0, TAU); ctx.fill();

      // Core shell
      const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      sg.addColorStop(0, `rgba(0,255,255,${0.3 * gi})`);
      sg.addColorStop(0.3, `rgba(0,102,255,${0.2 * gi})`);
      sg.addColorStop(0.6, `rgba(136,68,255,${0.15 * gi})`);
      sg.addColorStop(0.85, `rgba(0,255,255,${0.05 * gi})`);
      sg.addColorStop(1, 'transparent');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();

      // Inner core
      const ig = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
      ig.addColorStop(0, `rgba(255,255,255,${0.6 * gi})`);
      ig.addColorStop(0.2, `rgba(0,255,255,${0.4 * gi})`);
      ig.addColorStop(0.6, `rgba(0,102,255,${0.15 * gi})`);
      ig.addColorStop(1, 'transparent');
      ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, TAU); ctx.fill();

      // Ring outline
      ctx.strokeStyle = `rgba(0,255,255,${0.15 * gi})`;
      ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, TAU); ctx.stroke(); ctx.setLineDash([]);

      // Shell particles
      for (const p of this.shellParticles) {
        const x = Math.sin(p.theta + this.rotation * p.speed + p.offset) * Math.cos(p.phi) * r * 1.1;
        const y = Math.sin(p.phi) * r * 1.1;
        const a = 0.4 + Math.sin(time * p.speed + p.offset) * 0.3;
        ctx.fillStyle = `rgba(0,255,255,${a})`;
        ctx.shadowColor = CYAN; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(x, y, 2 * scale, 0, TAU); ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Energy rings
      for (let i = 0; i < 3; i++) {
        const rr = r * (0.9 + i * 0.15), a = 0.08 + Math.sin(time * 0.6 + i * 1.5) * 0.04;
        ctx.strokeStyle = `rgba(0,255,255,${a})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.stroke();
      }
      ctx.restore();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // PARTICLE SYSTEM
  // ═════════════════════════════════════════════════════════════════
  const ParticleSystem = {
    particles: [], connectionDistance: 0, maxParticles: 300,

    init() {
      this.connectionDistance = Math.min(W, H) * 0.22;
      this.maxParticles = Perf.currentParticles;
      for (let i = 0; i < this.maxParticles; i++) this.particles.push(this.create());
    },

    create() {
      return {
        x: rand(-W * 0.4, W * 0.4), y: rand(-H * 0.4, H * 0.4), z: rand(0.2, 1),
        vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3), size: rand(1, 3),
        phase: rand(0, TAU), speed: rand(0.2, 0.8), life: 0
      };
    },

    update(t, dt, n) {
      while (this.particles.length < n) this.particles.push(this.create());
      while (this.particles.length > n) this.particles.pop();
      const pulse = Chat.isProcessing ? 1.5 : 1;
      for (const p of this.particles) {
        p.x += p.vx * dt * 60; p.y += p.vy * dt * 60; p.life += dt * 0.1;
        p.vx += Math.sin(t * p.speed + p.phase) * 0.002 * pulse;
        p.vy += Math.cos(t * p.speed * 0.7 + p.phase) * 0.002 * pulse;
        p.vx = clamp(p.vx, -0.5 * pulse, 0.5 * pulse);
        p.vy = clamp(p.vy, -0.5 * pulse, 0.5 * pulse);
        const b = W * 0.5; if (p.x > b) p.x = -b; if (p.x < -b) p.x = b;
        const b2 = H * 0.5; if (p.y > b2) p.y = -b2; if (p.y < -b2) p.y = b2;
        p.z = 0.2 + Math.sin(t * 0.2 + p.phase) * 0.4 + 0.4;
      }
    },

    draw() {
      const d2 = this.connectionDistance * this.connectionDistance;
      ctx.save(); ctx.translate(CX + Camera.x, CY + Camera.y);
      const pts = this.particles, maxC = Perf.quality === 'high' ? 3 : 2;
      for (let i = 0; i < pts.length; i++) {
        let c = 0;
        for (let j = i + 1; j < pts.length && c < maxC; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dd = dx * dx + dy * dy;
          if (dd < d2) {
            const a = (1 - dd / d2) * 0.2 * pts[i].z * pts[j].z * (Chat.isProcessing ? 1.4 : 1);
            if (a < 0.01) continue; c++;
            ctx.strokeStyle = `rgba(0,255,255,${a})`; ctx.lineWidth = 0.4;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        const sz = p.size * scale * p.z;
        const a = (0.3 + 0.5 * p.z) * (0.6 + Math.sin(p.life * 0.5 + p.phase) * 0.2);
        ctx.fillStyle = `rgba(0,255,255,${a})`;
        ctx.shadowColor = CYAN; ctx.shadowBlur = sz * 4;
        ctx.beginPath(); ctx.arc(p.x, p.y, sz, 0, TAU); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // ORBIT RINGS
  // ═════════════════════════════════════════════════════════════════
  const OrbitRings = {
    rings: [],
    init() {
      const n = Perf.quality === 'high' ? 4 : 3;
      for (let i = 0; i < n; i++) this.rings.push({
        r: NeuralCore.maxRadius * (1.8 + i * 0.8), spd: rand(0.2, 0.5) * (i % 2 ? -1 : 1),
        tx: rand(-0.3, 0.3), ty: rand(-0.3, 0.3), ph: rand(0, TAU), alpha: rand(0.06, 0.15),
        seg: 60, dash: rand(0, 100)
      });
    },
    update(t, dt) {
      for (const r of this.rings) { r.dash += dt * r.spd * 20; r.alpha = 0.06 + Math.sin(t * 0.2 + r.ph) * 0.04 + 0.04; }
    },
    draw() {
      ctx.save(); ctx.translate(CX + Camera.x, CY + Camera.y);
      for (const r of this.rings) {
        ctx.save(); ctx.rotate(r.tx * Math.sin(time * 0.1));
        ctx.transform(1, 0, 0, Math.cos(r.ty), 0, 0);
        ctx.strokeStyle = `rgba(0,255,255,${r.alpha})`;
        ctx.lineWidth = 1; ctx.setLineDash([3, 8]); ctx.lineDashOffset = -r.dash;
        ctx.beginPath();
        for (let i = 0; i <= r.seg; i++) {
          const a = (i / r.seg) * TAU, x = r.r * Math.cos(a), y = r.r * Math.sin(a) * 0.35;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      }
      ctx.restore();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // SCANNER RINGS
  // ═════════════════════════════════════════════════════════════════
  const ScannerRings = {
    scanners: [], init() {},
    trigger() { this.scanners.push({ r: NeuralCore.maxRadius * 1.2, maxR: Math.min(W, H) * 0.45, spd: rand(60, 120), a: 0.4 }); },
    update(t, dt) {
      if (Math.sin(t * 0.3) > 0.95 && Math.random() < 0.02) this.trigger();
      for (let i = this.scanners.length - 1; i >= 0; i--) {
        const s = this.scanners[i]; s.r += s.spd * dt;
        s.a = Math.max(0, (1 - (s.r - NeuralCore.maxRadius * 1.2) / (s.maxR - NeuralCore.maxRadius * 1.2))) * 0.4;
        if (s.a <= 0 || s.r > s.maxR) this.scanners.splice(i, 1);
      }
    },
    draw() {
      ctx.save(); ctx.translate(CX + Camera.x, CY + Camera.y);
      for (const s of this.scanners) {
        const g = ctx.createRadialGradient(0, 0, s.r * 0.95, 0, 0, s.r);
        g.addColorStop(0, `rgba(0,255,255,0)`);
        g.addColorStop(0.8, `rgba(0,255,255,${s.a * 0.2})`);
        g.addColorStop(0.92, `rgba(0,102,255,${s.a})`);
        g.addColorStop(0.96, `rgba(0,255,255,${s.a * 1.5})`);
        g.addColorStop(1, `rgba(0,102,255,0)`);
        ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.globalAlpha = s.a;
        ctx.beginPath(); ctx.arc(0, 0, s.r, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
      }
      ctx.restore();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // MEMORY HELIX
  // ═════════════════════════════════════════════════════════════════
  const MemoryHelix = {
    nodes: [], helixRadius: 0, helixHeight: 0, twist: 0,
    init() {
      this.helixRadius = NeuralCore.maxRadius * 1.6;
      this.helixHeight = NeuralCore.maxRadius * 3;
      const n = Perf.quality === 'high' ? 40 : 20;
      for (let i = 0; i < n; i++) this.nodes.push({ t: i / n, ph: rand(0, TAU), sz: rand(1.5, 3), c: Math.random() < 0.5 ? CYAN : PURPLE });
    },
    update(t, dt) { this.twist += dt * 0.3; },
    draw() {
      ctx.save(); ctx.translate(CX + Camera.x, CY + Camera.y);
      const hh = this.helixHeight / 2, R = this.helixRadius, tw = this.twist;
      for (const n of this.nodes) {
        const y = -hh + n.t * this.helixHeight, a = n.t * TAU * 3 + tw + n.ph;
        const x1 = R * Math.cos(a), z1 = R * Math.sin(a) * 0.2;
        const x2 = R * Math.cos(a + PI), z2 = R * Math.sin(a + PI) * 0.2;
        const al = 0.3 + (1 - Math.abs(z1) / (R * 0.2)) * 0.4;
        ctx.fillStyle = n.c === CYAN ? `rgba(0,255,255,${al})` : `rgba(136,68,255,${al})`;
        ctx.shadowColor = n.c; ctx.shadowBlur = 6;
        const sz = n.sz * scale * (1 - Math.abs(z1) / (R * 0.2) * 0.3);
        ctx.beginPath(); ctx.arc(x1, y, sz, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(x2, y, sz, 0, TAU); ctx.fill();
        ctx.shadowBlur = 0;
        if (n.t < 0.95) {
          const n2 = this.nodes[Math.floor(n.t * this.nodes.length + 1) % this.nodes.length];
          const ny = -hh + (n.t + 1 / this.nodes.length) * this.helixHeight;
          const na = (n.t + 1 / this.nodes.length) * TAU * 3 + tw + n.ph;
          ctx.strokeStyle = `rgba(0,255,255,${al * 0.15})`; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(R * Math.cos(na), ny); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x2, y); ctx.lineTo(R * Math.cos(na + PI), ny); ctx.stroke();
        }
        ctx.strokeStyle = `rgba(136,68,255,${al * 0.2})`; ctx.lineWidth = 0.3;
        ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      }
      ctx.restore();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // HUD SYSTEM
  // ═════════════════════════════════════════════════════════════════
  const HUD = {
    synaptic: 72, coherence: 94, memory: 8547, velocity: 1.42, nodes: 0, synapses: 0, uptime: 0,

    update(t, dt) {
      this.uptime = (Date.now() - startTime) / 1000;
      const h = Math.floor(this.uptime / 3600), m = Math.floor((this.uptime % 3600) / 60), s = Math.floor(this.uptime % 60);
      const activity = Chat.isProcessing ? 1.6 : 1;
      this.synaptic = 65 + Math.sin(t * 0.3 * activity) * 12 + Math.sin(t * 0.7) * 5;
      this.coherence = 92 + Math.sin(t * 0.2) * 3 + Math.random() * 0.5;
      this.memory = 8500 + Math.floor(t * 0.5);
      this.velocity = 1.3 + Math.sin(t * 0.15) * 0.2 + Chat.isProcessing * 0.3;
      this.nodes = Math.floor(200 + t * 0.1);
      this.synapses = Math.floor(800 + t * 0.3);

      document.getElementById('mSynaptic').style.width = `${this.synaptic}%`;
      document.getElementById('mSynapticVal').textContent = `${Math.round(this.synaptic)}%`;
      document.getElementById('mCoherence').style.width = `${this.coherence}%`;
      document.getElementById('mCoherenceVal').textContent = `${this.coherence.toFixed(1)}%`;
      document.getElementById('mMemory').textContent = Math.round(this.memory).toLocaleString();
      document.getElementById('mVelocity').textContent = `${this.velocity.toFixed(2)} TFLOPS`;
      document.getElementById('mUptime').textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      document.getElementById('bNodes').textContent = `NODES: ${this.nodes.toLocaleString()}`;
      document.getElementById('bSynapses').textContent = `SYNAPSES: ${this.synapses.toLocaleString()}`;
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // CURSOR SYSTEM
  // ═════════════════════════════════════════════════════════════════
  const CursorSystem = {
    x: -100, y: -100, tx: -100, ty: -100, ring: null, glow: null, prevX: -100, prevY: -100,

    init() {
      this.ring = document.getElementById('cursorRing');
      this.glow = document.getElementById('cursorGlow');
      document.addEventListener('mousemove', e => { this.tx = e.clientX; this.ty = e.clientY; });
      document.addEventListener('mousedown', () => {
        this.ring.classList.add('click');
        setTimeout(() => this.ring.classList.remove('click'), 200);
        this.createRipple(this.tx, this.ty);
      });
      document.addEventListener('mouseover', e => {
        const t = e.target;
        if (t.closest('.hud-panel') || t.closest('.modal-overlay') || ['A','BUTTON','INPUT','SELECT','TEXTAREA'].includes(t.tagName)) {
          this.ring.classList.add('hover'); this.glow.classList.add('hover');
        }
      });
      document.addEventListener('mouseout', e => {
        const t = e.target;
        if (t.closest('.hud-panel') || t.closest('.modal-overlay') || ['A','BUTTON','INPUT','SELECT','TEXTAREA'].includes(t.tagName)) {
          this.ring.classList.remove('hover'); this.glow.classList.remove('hover');
        }
      });
    },

    createRipple(x, y) {
      const el = document.createElement('div');
      el.className = 'cursor-ripple';
      el.style.cssText = `left:${x}px;top:${y}px;position:fixed;z-index:200;pointer-events:none;width:0;height:0;border-radius:50%;border:1px solid rgba(0,255,255,0.5);animation:rippleExpand 0.6s ease-out forwards;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 700);
    },

    update(dt) {
      this.x = lerp(this.x, this.tx, 0.12);
      this.y = lerp(this.y, this.ty, 0.12);
      this.ring.style.left = `${this.x}px`; this.ring.style.top = `${this.y}px`;
      this.glow.style.left = `${this.x}px`; this.glow.style.top = `${this.y}px`;
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // BOOT SEQUENCE
  // ═════════════════════════════════════════════════════════════════
  async function boot() {
    const start = performance.now(), dur = 2.5;
    return new Promise(resolve => {
      function tick() {
        const p = Math.min(1, (performance.now() - start) / 1000 / dur);
        bootFill.style.width = `${p * 100}%`;
        bootPercent.textContent = `${Math.round(p * 100)}%`;
        if (p < 1) requestAnimationFrame(tick);
        else { bootScreen.classList.add('hidden'); bootComplete = true; resolve(); }
      }
      tick();
    });
  }

  // ═════════════════════════════════════════════════════════════════
  // UI WIRING
  // ═════════════════════════════════════════════════════════════════
  function updateConnectionLabel() {
    const backendLabel = mode === 'backend' ? 'BACKEND' : 'LOCAL';
    const genderLabel = currentGenderMode === 'girlfriend' ? 'GF' : 'BF';
    const modLabel = Brain.mods[currentMod].name.toUpperCase();
    document.getElementById('bConnection').textContent = `${backendLabel} | ${genderLabel} | ${modLabel}`;
  }

  function setupUI() {
    // Mod selector
    document.querySelectorAll('.mod-opt').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelector('.mod-opt.active')?.classList.remove('active');
        el.classList.add('active');
        currentMod = el.dataset.mod;
        updateConnectionLabel();
      });
    });

    // Gender selector
    document.querySelectorAll('.gender-opt').forEach(el => {
      el.addEventListener('click', async () => {
        document.querySelector('.gender-opt.active')?.classList.remove('active');
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
            console.warn("Failed to sync gender setting with backend:", e);
          }
        }
      });
    });

    // API modal
    bKeyBtn.addEventListener('click', () => apiModal.classList.add('active'));
    modalClose.addEventListener('click', () => apiModal.classList.remove('active'));
    apiModal.addEventListener('click', e => { if (e.target === apiModal) apiModal.classList.remove('active'); });

    connectBackend.addEventListener('click', async () => {
      const url = backendUrl.value.trim();
      if (url) { 
        mode = 'backend'; 
        
        // Send key, model, mod and gender settings to backend
        try {
          await fetch(`${url}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              groq_key: apiKey.value.trim(),
              groq_model: modelSelect.value,
              gender_mode: currentGenderMode,
              mod: currentMod
            })
          });
        } catch (e) {
          console.warn("Failed to sync API key and model with backend:", e);
        }

        apiModal.classList.remove('active'); 
        updateConnectionLabel();
      }
    });

    disconnectBackend.addEventListener('click', () => {
      mode = 'local'; 
      apiModal.classList.remove('active');
      updateConnectionLabel();
    });

  }


  // ═════════════════════════════════════════════════════════════════
  // MAIN LOOP
  // ═════════════════════════════════════════════════════════════════
  function resize() {
    W = window.innerWidth; H = window.innerHeight; CX = W / 2; CY = H / 2;
    scale = Math.min(W, H) / 1000;
    canvas.width = W; canvas.height = H;
    NeuralCore.init(); ParticleSystem.connectionDistance = Math.min(W, H) * 0.22;
    OrbitRings.init(); MemoryHelix.init(); ScannerRings.init();
  }

  async function init() {
    await boot();
    resize();
    Perf.init(); CursorSystem.init(); Chat.init(); setupUI();
    ScannerRings.trigger();
    window.addEventListener('resize', resize);

    // Dynamic initial greeting based on mod & gender
    chatMessages.innerHTML = '';
    const greeting = Brain.getGreeting(currentGenderMode, currentMod);
    Chat.addMessage(greeting, 'ai', false);
    updateConnectionLabel();

    // Hex parallax
    const hex = document.getElementById('hexGrid');
    document.addEventListener('mousemove', e => {
      hex.style.transform = `translate(${(e.clientX / W - 0.5) * 6}px, ${(e.clientY / H - 0.5) * 6}px)`;
    });

    lastTime = performance.now(); loop(lastTime);
  }


  let lastTime = 0;
  function loop(ts) {
    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts; time += dt;
    Perf.update(ts);
    Camera.update(time);
    NeuralCore.update(time, dt);
    ParticleSystem.update(time, dt, Perf.currentParticles);
    OrbitRings.update(time, dt);
    ScannerRings.update(time, dt);
    MemoryHelix.update(time, dt);
    HUD.update(time, dt);
    CursorSystem.update(dt);

    // Render
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(CX, CY, 0, CX, CY, Math.min(W, H) * 0.6);
    bg.addColorStop(0, '#0a1628'); bg.addColorStop(1, BG);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ParticleSystem.draw();
    NeuralCore.draw();
    MemoryHelix.draw();
    OrbitRings.draw();
    ScannerRings.draw();

    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
