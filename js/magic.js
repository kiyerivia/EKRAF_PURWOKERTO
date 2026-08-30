/**
 * EKRAF PURWOKERTO - Magic Effects Engine
 * Partikel kilau (sparkle trail), refleksi 3D tilt, chime sintesis audio, dan efek magis visual.
 */

class MagicEngine {
  constructor() {
    this.sparklesEnabled = true;
    this.audioEnabled = true;
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.audioCtx = null;
    this.mouse = { x: 0, y: 0, prevX: 0, prevY: 0, speed: 0 };
    this.colors = [
      '#F59E0B', // Teratai Gold
      '#FDE68A', // Pale Gold
      '#38BDF8', // Cyan Crystal
      '#60A5FA', // Sky Blue
      '#EC4899', // Lotus Blossom Pink
      '#FFFFFF'  // Pure Light
    ];

    this.init();
  }

  init() {
    this.initCanvas();
    this.initCursorEvents();
    this.initCardTilt();
    this.initAudioContext();
    this.animate();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'magic-particle-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '999999';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initCursorEvents() {
    window.addEventListener('mousemove', (e) => {
      const dx = e.clientX - this.mouse.prevX;
      const dy = e.clientY - this.mouse.prevY;
      this.mouse.speed = Math.sqrt(dx * dx + dy * dy);
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.prevX = e.clientX;
      this.mouse.prevY = e.clientY;

      if (this.sparklesEnabled && this.mouse.speed > 2) {
        this.createSparkle(e.clientX, e.clientY);
        if (this.mouse.speed > 18) {
          this.createSparkle(e.clientX + (Math.random() - 0.5) * 14, e.clientY + (Math.random() - 0.5) * 14);
        }
      }
    });

    window.addEventListener('click', (e) => {
      if (this.sparklesEnabled) {
        this.createBurst(e.clientX, e.clientY, 12);
      }
      this.playMagicChime(580, 0.08);
    });
  }

  createSparkle(x, y) {
    const size = Math.random() * 5 + 2;
    this.particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 1.5 - 0.5,
      size: size,
      alpha: 1,
      decay: Math.random() * 0.03 + 0.02,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.15,
      isStar: Math.random() > 0.4
    });
  }

  createBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5);
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: Math.random() * 6 + 3,
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        isStar: true
      });
    }
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    let rotAngle = Math.PI / 2 * 3;
    let x = 0;
    let y = 0;
    const step = Math.PI / spikes;

    ctx.moveTo(0, -outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = Math.cos(rotAngle) * outerRadius;
      y = Math.sin(rotAngle) * outerRadius;
      ctx.lineTo(x, y);
      rotAngle += step;

      x = Math.cos(rotAngle) * innerRadius;
      y = Math.sin(rotAngle) * innerRadius;
      ctx.lineTo(x, y);
      rotAngle += step;
    }
    ctx.lineTo(0, -outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.restore();
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      p.rotation += p.vRot;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.isStar) {
        this.drawStar(this.ctx, p.x, p.y, 4, p.size, p.size * 0.4, p.color, p.alpha, p.rotation);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = p.color;
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1.0;
    this.ctx.shadowBlur = 0;
    requestAnimationFrame(() => this.animate());
  }

  initCardTilt() {
    const handleMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

      let shine = card.querySelector('.magic-shine-overlay');
      if (!shine) {
        shine = document.createElement('div');
        shine.className = 'magic-shine-overlay';
        card.appendChild(shine);
      }
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)`;
    };

    const handleLeave = (card) => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      const shine = card.querySelector('.magic-shine-overlay');
      if (shine) {
        shine.style.background = 'transparent';
      }
    };

    document.addEventListener('mouseover', (e) => {
      const card = e.target.closest('.magic-tilt, .ekraf-card, .umkm-card, .event-card, .product-card');
      if (card && !card._tiltBound) {
        card._tiltBound = true;
        card.addEventListener('mousemove', (ev) => handleMove(ev, card));
        card.addEventListener('mouseleave', () => handleLeave(card));
      }
    });
  }

  initAudioContext() {
    const initAudio = () => {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      window.removeEventListener('click', initAudio);
    };
    window.addEventListener('click', initAudio);
  }

  playMagicChime(frequency = 720, duration = 0.15) {
    if (!this.audioEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  playSuccessJingle() {
    if (!this.audioEnabled || !this.audioCtx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playMagicChime(freq, 0.18);
        }, idx * 60);
      });
    } catch (e) {}
  }

  toggleSparkles() {
    this.sparklesEnabled = !this.sparklesEnabled;
    return this.sparklesEnabled;
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    return this.audioEnabled;
  }
}

// Global magic engine instance
window.Magic = new MagicEngine();
