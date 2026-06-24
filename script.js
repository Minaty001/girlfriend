/* ═════════════════════════════════════════════════════════════════════
   NEURAL CORE — AI Operating System UI
   Visualization Engine
   ═════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Constants ────────────────────────────────────────────────
  const CYAN = '#00FFFF';
  const BLUE = '#0066FF';
  const PURPLE = '#8844FF';
  const BG = '#020617';
  const PI = Math.PI;
  const TAU = PI * 2;

  // ─── DOM References ───────────────────────────────────────────
  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  const bootScreen = document.getElementById('boot-screen');
  const bootFill = document.getElementById('boot-fill');
  const bootPercent = document.getElementById('boot-percent');

  // ─── State ────────────────────────────────────────────────────
  let W, H, CX, CY, scale;
  let time = 0;
  let bootComplete = false;
  let startTime = Date.now();

  // ─── Utilities ────────────────────────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  // ═════════════════════════════════════════════════════════════════
  // PERFORMANCE MANAGER
  // ═════════════════════════════════════════════════════════════════
  const Perf = {
    fps: 60,
    targetParticles: 300,
    currentParticles: 300,
    frameCount: 0,
    lastFpsTime: 0,
    quality: 'high', // high | medium | low

    init() {
      this.lastFpsTime = time;
      this.detectQuality();
    },

    detectQuality() {
      // Detect based on device capabilities
      const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
      const isLowEnd = navigator.hardwareConcurrency <= 4;
      if (isMobile || isLowEnd) {
        this.quality = 'medium';
        this.targetParticles = 150;
      }
      if (isMobile && isLowEnd) {
        this.quality = 'low';
        this.targetParticles = 80;
      }
      this.currentParticles = this.targetParticles;
    },

    update(deltaTime) {
      this.frameCount++;
      const now = performance.now();
      if (now - this.lastFpsTime >= 1000) {
        this.fps = Math.round(this.frameCount * 1000 / (now - this.lastFpsTime));
        this.frameCount = 0;
        this.lastFpsTime = now;
        this.adaptQuality();
        document.getElementById('bFps').textContent = `FPS: ${this.fps}`;
      }
    },

    adaptQuality() {
      if (this.fps < 25 && this.currentParticles > 100) {
        this.currentParticles = Math.max(80, this.currentParticles - 50);
        this.targetParticles = this.currentParticles;
      } else if (this.fps > 55 && this.currentParticles < this.targetParticles) {
        this.currentParticles = Math.min(this.targetParticles, this.currentParticles + 30);
      }
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // CAMERA SYSTEM
  // ═════════════════════════════════════════════════════════════════
  const Camera = {
    x: 0, y: 0,
    targetX: 0, targetY: 0,
    driftAmp: 8,
    breatheAmp: 4,

    update(t) {
      // Slow drift using sine waves
      this.targetX = Math.sin(t * 0.08) * this.driftAmp + Math.sin(t * 0.13) * (this.driftAmp * 0.5);
      this.targetY = Math.cos(t * 0.11) * this.driftAmp + Math.sin(t * 0.07) * (this.driftAmp * 0.5);
      // Breathing motion
      this.targetY += Math.sin(t * 0.5) * this.breatheAmp;

      this.x = lerp(this.x, this.targetX, 0.05);
      this.y = lerp(this.y, this.targetY, 0.05);
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // NEURAL CORE
  // ═════════════════════════════════════════════════════════════════
  const NeuralCore = {
    radius: 0,
    maxRadius: 0,
    pulsePhase: 0,
    rotation: 0,
    glowIntensity: 0,
    shellParticles: [],

    init() {
      this.maxRadius = Math.min(W, H) * 0.1;
      this.radius = this.maxRadius;
      this.shellParticles = [];
      const count = Perf.quality === 'high' ? 60 : 30;
      for (let i = 0; i < count; i++) {
        const theta = rand(0, TAU);
        const phi = Math.acos(rand(-1, 1));
        this.shellParticles.push({ theta, phi, speed: rand(0.2, 0.8), offset: rand(0, TAU) });
      }
    },

    update(t, dt) {
      this.pulsePhase += dt * 0.8;
      this.rotation += dt * 0.15;
      // Breathing
      const breathe = 1 + Math.sin(this.pulsePhase * 0.5) * 0.04;
      this.radius = this.maxRadius * breathe;
      this.glowIntensity = 0.6 + Math.sin(this.pulsePhase * 0.5) * 0.2;
    },

    draw() {
      ctx.save();
      ctx.translate(CX + Camera.x, CY + Camera.y);

      // --- Glow layers ---
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 3);
      gradient.addColorStop(0, `rgba(0, 255, 255, ${0.08 * this.glowIntensity})`);
      gradient.addColorStop(0.3, `rgba(0, 102, 255, ${0.04 * this.glowIntensity})`);
      gradient.addColorStop(0.6, `rgba(136, 68, 255, ${0.02 * this.glowIntensity})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 3, 0, TAU);
      ctx.fill();

      // --- Core shell ---
      const shellGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
      shellGrad.addColorStop(0, `rgba(0, 255, 255, ${0.3 * this.glowIntensity})`);
      shellGrad.addColorStop(0.3, `rgba(0, 102, 255, ${0.2 * this.glowIntensity})`);
      shellGrad.addColorStop(0.6, `rgba(136, 68, 255, ${0.15 * this.glowIntensity})`);
      shellGrad.addColorStop(0.85, `rgba(0, 255, 255, ${0.05 * this.glowIntensity})`);
      shellGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = shellGrad;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, TAU);
      ctx.fill();

      // --- Inner core (bright center) ---
      const innerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 0.5);
      innerGrad.addColorStop(0, `rgba(255, 255, 255, ${0.6 * this.glowIntensity})`);
      innerGrad.addColorStop(0.2, `rgba(0, 255, 255, ${0.4 * this.glowIntensity})`);
      innerGrad.addColorStop(0.6, `rgba(0, 102, 255, ${0.15 * this.glowIntensity})`);
      innerGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.5, 0, TAU);
      ctx.fill();

      // --- Core outline ---
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 * this.glowIntensity})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.8, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- Shell particles (orbiting dots) ---
      for (const p of this.shellParticles) {
        const x = Math.sin(p.theta + this.rotation * p.speed + p.offset) * Math.cos(p.phi) * this.radius * 1.1;
        const y = Math.sin(p.phi) * this.radius * 1.1;
        const size = 2 * scale;
        const alpha = 0.4 + Math.sin(time * p.speed + p.offset) * 0.3;
        ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.shadowColor = CYAN;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // --- Energy halo rings ---
      for (let i = 0; i < 3; i++) {
        const r = this.radius * (0.9 + i * 0.15);
        const alpha = 0.08 + Math.sin(time * 0.6 + i * 1.5) * 0.04;
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // PARTICLE SYSTEM (Neural Network)
  // ═════════════════════════════════════════════════════════════════
  const ParticleSystem = {
    particles: [],
    connectionDistance: 0,
    maxParticles: 300,

    init() {
      this.connectionDistance = Math.min(W, H) * 0.22;
      this.maxParticles = Perf.currentParticles;
      this.particles = [];
      for (let i = 0; i < this.maxParticles; i++) {
        this.particles.push(this.createParticle());
      }
    },

    createParticle() {
      return {
        x: rand(-W * 0.4, W * 0.4),
        y: rand(-H * 0.4, H * 0.4),
        z: rand(0.2, 1), // depth
        vx: rand(-0.3, 0.3),
        vy: rand(-0.3, 0.3),
        size: rand(1, 3),
        phase: rand(0, TAU),
        speed: rand(0.2, 0.8),
        type: Math.random() < 0.3 ? 'data' : 'neural', // data particles are brighter
        life: 0
      };
    },

    update(t, dt, perfParticles) {
      const target = perfParticles || this.maxParticles;
      while (this.particles.length < target) {
        this.particles.push(this.createParticle());
      }
      while (this.particles.length > target) {
        this.particles.pop();
      }

      for (const p of this.particles) {
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        p.life += dt * 0.1;

        // Slow wandering
        p.vx += Math.sin(t * p.speed + p.phase) * 0.002;
        p.vy += Math.cos(t * p.speed * 0.7 + p.phase) * 0.002;
        p.vx = clamp(p.vx, -0.5, 0.5);
        p.vy = clamp(p.vy, -0.5, 0.5);

        // Wrap around edges
        const boundX = W * 0.5;
        const boundY = H * 0.5;
        if (p.x > boundX) p.x = -boundX;
        if (p.x < -boundX) p.x = boundX;
        if (p.y > boundY) p.y = -boundY;
        if (p.y < -boundY) p.y = boundY;

        // Depth pulse
        p.z = 0.2 + Math.sin(t * 0.2 + p.phase) * 0.4 + 0.4;
      }
    },

    draw() {
      const dist2 = this.connectionDistance * this.connectionDistance;
      const particles = this.particles;

      // Draw connections first (behind particles)
      ctx.save();
      ctx.translate(CX + Camera.x, CY + Camera.y);

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const maxConnections = Perf.quality === 'high' ? 3 : 2;
        let connections = 0;

        for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;

          if (d2 < dist2) {
            const alpha = (1 - d2 / dist2) * 0.2 * a.z * b.z;
            if (alpha < 0.01) continue;
            connections++;

            ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const size = p.size * scale * p.z;
        const alpha = (0.3 + 0.5 * p.z) * (0.6 + Math.sin(p.life * 0.5 + p.phase) * 0.2);

        if (p.type === 'data') {
          ctx.fillStyle = `rgba(136, 68, 255, ${alpha})`;
          ctx.shadowColor = PURPLE;
        } else {
          ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
          ctx.shadowColor = CYAN;
        }
        ctx.shadowBlur = size * 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, TAU);
        ctx.fill();
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
      const count = Perf.quality === 'high' ? 4 : 3;
      this.rings = [];
      for (let i = 0; i < count; i++) {
        this.rings.push({
          radius: NeuralCore.maxRadius * (1.8 + i * 0.8),
          speed: rand(0.2, 0.5) * (i % 2 === 0 ? 1 : -1),
          tiltX: rand(-0.3, 0.3),
          tiltY: rand(-0.3, 0.3),
          phase: rand(0, TAU),
          dashOffset: rand(0, 100),
          width: rand(0.5, 1.2),
          alpha: rand(0.06, 0.15),
          segments: 60 + randInt(0, 20)
        });
      }
    },

    update(t, dt) {
      for (const ring of this.rings) {
        ring.dashOffset += dt * ring.speed * 20;
        ring.alpha = 0.06 + Math.sin(t * 0.2 + ring.phase) * 0.04 + 0.04;
      }
    },

    draw() {
      ctx.save();
      ctx.translate(CX + Camera.x, CY + Camera.y);

      for (const ring of this.rings) {
        ctx.save();
        ctx.rotate(ring.tiltX * Math.sin(time * 0.1));
        ctx.transform(1, 0, 0, Math.cos(ring.tiltY), 0, 0);

        const r = ring.radius;
        ctx.strokeStyle = `rgba(0, 255, 255, ${ring.alpha})`;
        ctx.lineWidth = ring.width;
        ctx.setLineDash([3, 8]);
        ctx.lineDashOffset = -ring.dashOffset;

        // Draw as elliptical segments
        ctx.beginPath();
        for (let i = 0; i <= ring.segments; i++) {
          const angle = (i / ring.segments) * TAU;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle) * 0.35; // Flatten for perspective
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.restore();
      }

      ctx.restore();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // SCANNER RINGS
  // ═════════════════════════════════════════════════════════════════
  const ScannerRings = {
    scanners: [],

    init() {
      this.scanners = [];
    },

    trigger() {
      this.scanners.push({
        radius: NeuralCore.maxRadius * 1.2,
        maxRadius: Math.min(W, H) * 0.45,
        speed: rand(60, 120),
        alpha: 0.4,
        width: rand(1.5, 2.5)
      });
    },

    update(t, dt) {
      // Periodic auto-trigger
      if (Math.sin(t * 0.3) > 0.95 && Math.random() < 0.02) {
        this.trigger();
      }

      for (let i = this.scanners.length - 1; i >= 0; i--) {
        const s = this.scanners[i];
        s.radius += s.speed * dt;
        s.alpha = Math.max(0, (1 - (s.radius - NeuralCore.maxRadius * 1.2) / (s.maxRadius - NeuralCore.maxRadius * 1.2))) * 0.4;
        if (s.alpha <= 0 || s.radius > s.maxRadius) {
          this.scanners.splice(i, 1);
        }
      }
    },

    draw() {
      ctx.save();
      ctx.translate(CX + Camera.x, CY + Camera.y);

      for (const s of this.scanners) {
        const gradient = ctx.createRadialGradient(0, 0, s.radius * 0.95, 0, 0, s.radius);
        gradient.addColorStop(0, `rgba(0, 255, 255, 0)`);
        gradient.addColorStop(0.6, `rgba(0, 255, 255, ${s.alpha * 0.1})`);
        gradient.addColorStop(0.85, `rgba(0, 255, 255, ${s.alpha * 0.5})`);
        gradient.addColorStop(0.92, `rgba(0, 102, 255, ${s.alpha})`);
        gradient.addColorStop(0.96, `rgba(0, 255, 255, ${s.alpha * 1.5})`);
        gradient.addColorStop(1, `rgba(0, 102, 255, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = s.width;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(0, 0, s.radius, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // MEMORY HELIX (DNA Double Helix)
  // ═════════════════════════════════════════════════════════════════
  const MemoryHelix = {
    nodes: [],
    helixRadius: 0,
    helixHeight: 0,
    twist: 0,
    count: 0,

    init() {
      this.helixRadius = NeuralCore.maxRadius * 1.6;
      this.helixHeight = NeuralCore.maxRadius * 3;
      this.count = Perf.quality === 'high' ? 40 : 20;
      this.nodes = [];
      for (let i = 0; i < this.count; i++) {
        const t = i / this.count;
        this.nodes.push({
          t,
          phase: rand(0, TAU),
          size: rand(1.5, 3),
          color: Math.random() < 0.5 ? CYAN : PURPLE
        });
      }
    },

    update(t, dt) {
      this.twist += dt * 0.3;
    },

    draw() {
      ctx.save();
      ctx.translate(CX + Camera.x, CY + Camera.y);

      const halfH = this.helixHeight / 2;
      const r = this.helixRadius;

      for (const node of this.nodes) {
        const y = -halfH + node.t * this.helixHeight;
        const angle = node.t * TAU * 3 + this.twist + node.phase;
        const x1 = r * Math.cos(angle);
        const z1 = r * Math.sin(angle) * 0.2; // depth perspective
        const x2 = r * Math.cos(angle + PI);
        const z2 = r * Math.sin(angle + PI) * 0.2;

        const alpha = 0.3 + (1 - Math.abs(z1) / (r * 0.2)) * 0.4;

        ctx.fillStyle = node.color === CYAN
          ? `rgba(0, 255, 255, ${alpha})`
          : `rgba(136, 68, 255, ${alpha})`;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 6;
        const size = node.size * scale * (1 - Math.abs(z1) / (r * 0.2) * 0.3);
        ctx.beginPath();
        ctx.arc(x1, y, size, 0, TAU);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y, size, 0, TAU);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Connect nodes (horizontal rungs and vertical helix lines)
        if (node.t < 0.95) {
          const next = this.nodes[(Math.floor(node.t * this.count) + 1) % this.count];
          const nextY = -halfH + (node.t + 1/this.count) * this.helixHeight;
          const nextAngle = (node.t + 1/this.count) * TAU * 3 + this.twist + node.phase;
          const nx1 = r * Math.cos(nextAngle);
          const nx2 = r * Math.cos(nextAngle + PI);

          ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(nx1, nextY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x2, y);
          ctx.lineTo(nx2, nextY);
          ctx.stroke();
        }

        // Rung between the two strands
        ctx.strokeStyle = `rgba(136, 68, 255, ${alpha * 0.2})`;
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }

      ctx.restore();
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // HUD SYSTEM
  // ═════════════════════════════════════════════════════════════════
  const HUDSystem = {
    metrics: {
      synaptic: 72,
      coherence: 94.2,
      memory: 8547,
      temp: 36.8,
      entropy: 0.23,
      velocity: 1.42,
      nodes: 0,
      synapses: 0
    },
    streamEntries: [],
    streamEl: null,
    streamInterval: 0,
    streamPhrases: [
      'synaptic connection established',
      'quantum state: coherent',
      'memory fragment encoded',
      'neural pathway optimized',
      'quantum entanglement detected',
      'thought pattern recognized',
      'data packet routed',
      'neural node activated',
      'memory consolidation in progress',
      'synaptic pruning complete',
      'quantum coherence verified',
      'neural topology optimized',
      'consciousness state: aware',
      'energy distribution balanced',
      'information entropy normalized',
      'cognitive load: nominal',
      'neural latency reduced',
      'quantum fluctuation detected',
      'memory recall pathway active',
      'synaptic weight adjusted'
    ],

    init() {
      this.streamEl = document.getElementById('neuralStream');
    },

    update(t, dt) {
      const uptime = (Date.now() - startTime) / 1000;
      const hrs = Math.floor(uptime / 3600);
      const mins = Math.floor((uptime % 3600) / 60);
      const secs = Math.floor(uptime % 60);

      // Update all metrics
      this.metrics.synaptic = 65 + Math.sin(t * 0.3) * 12 + Math.sin(t * 0.7) * 5;
      this.metrics.coherence = 92 + Math.sin(t * 0.2) * 3 + Math.random() * 0.5;
      this.metrics.memory = 8500 + Math.floor(t * 0.5);
      this.metrics.temp = 36.5 + Math.sin(t * 0.1) * 0.5;
      this.metrics.entropy = 0.15 + Math.sin(t * 0.4) * 0.1 + 0.05;
      this.metrics.velocity = 1.3 + Math.sin(t * 0.15) * 0.2;
      this.metrics.nodes = Math.floor(200 + t * 0.1);
      this.metrics.synapses = Math.floor(800 + t * 0.3);

      // Update DOM
      document.getElementById('mSynaptic').style.width = `${this.metrics.synaptic}%`;
      document.getElementById('mSynapticVal').textContent = `${Math.round(this.metrics.synaptic)}%`;
      document.getElementById('mCoherence').style.width = `${this.metrics.coherence}%`;
      document.getElementById('mCoherenceVal').textContent = `${this.metrics.coherence.toFixed(1)}%`;
      document.getElementById('mMemory').textContent = Math.round(this.metrics.memory).toLocaleString();
      document.getElementById('mTemp').textContent = `${this.metrics.temp.toFixed(1)}°C`;
      document.getElementById('mUptime').textContent =
        `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      document.getElementById('mEntropy').style.width = `${this.metrics.entropy * 100}%`;
      document.getElementById('mEntropyVal').textContent = this.metrics.entropy.toFixed(2);
      document.getElementById('mVelocity').textContent = `${this.metrics.velocity.toFixed(2)} TFLOPS`;
      document.getElementById('bNodes').textContent = `NODES: ${this.metrics.nodes.toLocaleString()}`;
      document.getElementById('bSynapses').textContent = `SYNAPSES: ${this.metrics.synapses.toLocaleString()}`;
      document.getElementById('fwDensity').textContent = (0.7 + Math.sin(t * 0.2) * 0.15).toFixed(2);

      // Neural stream
      this.streamInterval += dt;
      if (this.streamInterval > 1.5 + Math.random() * 2) {
        this.streamInterval = 0;
        this.addStreamEntry();
      }
    },

    addStreamEntry() {
      const phrase = this.streamPhrases[Math.floor(Math.random() * this.streamPhrases.length)];
      const el = document.createElement('div');
      el.className = 'stream-entry';
      el.textContent = `> ${phrase}`;
      this.streamEl.appendChild(el);

      // Keep max entries
      while (this.streamEl.children.length > 20) {
        this.streamEl.removeChild(this.streamEl.firstChild);
      }
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // CURSOR SYSTEM
  // ═════════════════════════════════════════════════════════════════
  const CursorSystem = {
    x: -100, y: -100,
    targetX: -100, targetY: -100,
    ring: null,
    glow: null,
    trail: [],
    trailEls: [],
    prevX: -100, prevY: -100,
    speed: 0,
    smoothFactor: 0.12,

    init() {
      this.ring = document.getElementById('cursorRing');
      this.glow = document.getElementById('cursorGlow');
      this.trailEl = document.getElementById('cursorTrail');

      // Create trail dots
      for (let i = 0; i < 8; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.opacity = `${(1 - i / 8) * 0.3}`;
        dot.style.width = `${4 - i * 0.3}px`;
        dot.style.height = `${4 - i * 0.3}px`;
        dot.style.position = 'fixed';
        dot.style.zIndex = 'var(--cursor-z)';
        dot.style.pointerEvents = 'none';
        dot.style.borderRadius = '50%';
        dot.style.background = 'rgba(0, 255, 255, 0.15)';
        dot.style.boxShadow = '0 0 8px var(--cyber-cyan)';
        document.body.appendChild(dot);
        this.trailEls.push(dot);
      }

      // Events
      document.addEventListener('mousemove', e => {
        this.targetX = e.clientX;
        this.targetY = e.clientY;
      });

      document.addEventListener('mousedown', () => {
        this.ring.classList.add('click');
        setTimeout(() => this.ring.classList.remove('click'), 200);
        this.createRipple(this.targetX, this.targetY);
      });

      // Hover detection for interactive elements
      document.addEventListener('mouseover', e => {
        const tag = e.target.tagName;
        if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'].includes(tag) ||
            e.target.closest('.hud-panel')) {
          this.ring.classList.add('hover');
          this.glow.classList.add('hover');
        }
      });

      document.addEventListener('mouseout', e => {
        const tag = e.target.tagName;
        if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'].includes(tag) ||
            e.target.closest('.hud-panel')) {
          this.ring.classList.remove('hover');
          this.glow.classList.remove('hover');
        }
      });

      this.hideDefaultCursor();
    },

    hideDefaultCursor() {
      // Already set in CSS via cursor: none
    },

    createRipple(x, y) {
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    },

    update(dt) {
      // Smooth interpolation
      this.x = lerp(this.x, this.targetX, this.smoothFactor);
      this.y = lerp(this.y, this.targetY, this.smoothFactor);

      // Calculate speed
      const dx = this.x - this.prevX;
      const dy = this.y - this.prevY;
      this.speed = Math.sqrt(dx * dx + dy * dy) / (dt || 0.016);
      this.prevX = this.x;
      this.prevY = this.y;

      // Update ring position
      this.ring.style.left = `${this.x}px`;
      this.ring.style.top = `${this.y}px`;

      // Scale ring based on speed
      const scaleRing = 1 + clamp(this.speed * 0.01, 0, 0.5);
      this.ring.style.transform = `translate(-50%, -50%) scale(${scaleRing})`;

      // Update glow position
      this.glow.style.left = `${this.x}px`;
      this.glow.style.top = `${this.y}px`;

      // Update trail
      this.trailEls.forEach((dot, i) => {
        const history = i + 1;
        const tx = lerp(this.prevX, this.x, 1 - history * 0.1);
        const ty = lerp(this.prevY, this.y, 1 - history * 0.1);
        dot.style.left = `${tx}px`;
        dot.style.top = `${ty}px`;
      });
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // BOOT SEQUENCE
  // ═════════════════════════════════════════════════════════════════
  const BootSequence = {
    progress: 0,
    startedAt: 0,
    bootDuration: 3.0, // seconds

    start() {
      this.startedAt = performance.now();
      this.progress = 0;
      bootScreen.classList.remove('hidden');
      return new Promise(resolve => {
        const tick = () => {
          const elapsed = (performance.now() - this.startedAt) / 1000;
          this.progress = Math.min(1, elapsed / this.bootDuration);
          const pct = Math.round(this.progress * 100);
          bootFill.style.width = `${pct}%`;
          bootPercent.textContent = `${pct}%`;

          if (this.progress < 1) {
            requestAnimationFrame(tick);
          } else {
            bootScreen.classList.add('hidden');
            bootComplete = true;
            resolve();
          }
        };
        tick();
      });
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // MAIN LOOP
  // ═════════════════════════════════════════════════════════════════
  let lastTime = 0;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    CX = W / 2;
    CY = H / 2;
    scale = Math.min(W, H) / 1000;
    canvas.width = W;
    canvas.height = H;

    NeuralCore.init();
    ParticleSystem.connectionDistance = Math.min(W, H) * 0.22;
    OrbitRings.init();
    MemoryHelix.init();
    ScannerRings.init();
  }

  async function init() {
    // Run boot sequence
    await BootSequence.start();

    // Initialize systems
    resize();
    Perf.init();
    CursorSystem.init();
    HUDSystem.init();
    ScannerRings.trigger();

    // Initial stream entries
    HUDSystem.addStreamEntry();
    HUDSystem.addStreamEntry();
    HUDSystem.addStreamEntry();

    // Start animation loop
    lastTime = performance.now();
    loop(lastTime);

    // Resize handler
    window.addEventListener('resize', resize);

    // Hex grid parallax
    const hexGrid = document.getElementById('hexGrid');
    document.addEventListener('mousemove', e => {
      const px = (e.clientX / W - 0.5) * 6;
      const py = (e.clientY / H - 0.5) * 6;
      hexGrid.style.transform = `translate(${px}px, ${py}px)`;
    });
  }

  function loop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05); // cap at 50ms
    lastTime = timestamp;
    time += dt;

    // Update performance
    Perf.update(dt);

    // Update systems
    Camera.update(time);
    NeuralCore.update(time, dt);
    ParticleSystem.update(time, dt, Perf.currentParticles);
    OrbitRings.update(time, dt);
    ScannerRings.update(time, dt);
    MemoryHelix.update(time, dt);
    HUDSystem.update(time, dt);
    CursorSystem.update(dt);

    // Render
    render();

    requestAnimationFrame(loop);
  }

  function render() {
    // Clear
    ctx.clearRect(0, 0, W, H);

    // Background gradient (subtle)
    const bgGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, Math.min(W, H) * 0.6);
    bgGrad.addColorStop(0, '#0a1628');
    bgGrad.addColorStop(1, BG);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Draw layers in order
    ParticleSystem.draw();
    NeuralCore.draw();
    MemoryHelix.draw();
    OrbitRings.draw();
    ScannerRings.draw();
  }

  // ═════════════════════════════════════════════════════════════════
  // START
  // ═════════════════════════════════════════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
