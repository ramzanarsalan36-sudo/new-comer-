/* ==========================================================================
   SHAIKH MUDASSIR - PORTFOLIO INTERACTIVITY SCRIPT
   - Background Particle / Network Canvas
   - Interactive Cloud & VPS Terminal Simulator
   - Clipboard Copy with Animated Toast Notification
   - 3D Avatar Tilt Physics
   - Contact Form Simulation & Live Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNetworkCanvas();
  initTerminal();
  initCopyButtons();
  initAvatarTilt();
  initContactForm();
  initMobileNav();
  initScrollSpy();
});

/* --------------------------------------------------------------------------
   1. Interactive Cloud Network Canvas
   -------------------------------------------------------------------------- */
function initNetworkCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 24), 65);
  const maxDistance = 140;
  let mouse = { x: null, y: null, radius: 160 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.55)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   2. Interactive Terminal Simulator
   -------------------------------------------------------------------------- */
function initTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const chips = document.querySelectorAll('.chip-cmd');

  if (!terminalBody || !terminalInput) return;

  const commands = {
    help: `Available commands:
  • <span class="t-cmd">whoami</span>       : Profile overview
  • <span class="t-cmd">skills</span>       : Technical stack breakdown
  • <span class="t-cmd">vps-status</span>   : Live server telemetry
  • <span class="t-cmd">education</span>    : University & degree credentials
  • <span class="t-cmd">contact</span>      : Phone & direct communication lines
  • <span class="t-cmd">clear</span>        : Clear terminal history`,

    whoami: `Name       : Shaikh Mudassir
Age        : 25 Years Old
Role       : Software Engineer (Full-Stack & Cloud)
Education  : Graduate from Mumbai University (University of Mumbai)
Specialty  : High-throughput Next.js, Node.js, VPS Infrastructure & Supabase
Location   : Mumbai, India`,

    skills: `CORE TECH ARSENAL:
  [Next.js]        : SSR, SSG, App Router, React 19, Server Actions
  [VPS/Linux]      : Ubuntu/Debian, SSH, Nginx, UFW, Systemd, Process Management
  [Cloud]          : Cloud computing, Virtual Servers, Docker, Automated CI/CD
  [Supabase]       : PostgreSQL, Row Level Security (RLS), Realtime Sync, Auth
  [Node.js]        : Asynchronous Microservices, REST APIs, Express/Fastify
  [Tailwind CSS]   : Responsive design systems, Glassmorphism, Modern UI`,

    'vps-status': `[VPS CLOUD NODE: bom-node-01]
  Status      : ● active (running) since 14-Oct-2026
  Kernel      : Linux 6.8.0-cloud-vps-x86_64
  Web Server  : Nginx 1.26.1 (Reverse Proxy + SSL TLS 1.3 Active)
  Node.js     : v22.8.0 (PM2 cluster active - 0 downtime)
  PostgreSQL  : Supabase Cloud Connected (Latency: 14ms)
  Memory Load : 2.4GB / 8GB (30% utilized)
  Uptime      : 99.98% uninterrupted service`,

    education: `Degree      : Graduate in Engineering / Tech
University  : Mumbai University (University of Mumbai)
Focus Areas : Distributed Systems, Cloud Architecture, Algorithms,
              Advanced Database Management, Computer Networks`,

    contact: `DIRECT CONTACT:
  Phone       : +91 9958399157 (Shaikh Mudassir)
  WhatsApp    : https://wa.me/919958399157
  Location    : Mumbai, Maharashtra, India
  Status      : Open for Full-Time, Contract & Cloud Consulting roles`,

    clear: 'CLEAR_SCREEN'
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Append executed line
    const userLine = document.createElement('div');
    userLine.className = 'terminal-log-line';
    userLine.innerHTML = `<span class="t-prompt">mudassir@cloud-vps</span>:<span class="t-path">~</span>$ <span class="t-cmd">${escapeHtml(cmd)}</span>`;
    terminalBody.appendChild(userLine);

    if (cmd === 'clear') {
      terminalBody.innerHTML = '';
      terminalInput.value = '';
      return;
    }

    const outputLine = document.createElement('div');
    outputLine.className = 't-output';

    if (commands[cmd]) {
      outputLine.innerHTML = commands[cmd].replace(/\n/g, '<br>');
    } else {
      outputLine.innerHTML = `command not found: "${escapeHtml(cmd)}". Type <span class="t-cmd">help</span> for a list of commands.`;
    }

    terminalBody.appendChild(outputLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    terminalInput.value = '';
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* --------------------------------------------------------------------------
   3. Copy Phone Number with Toast Notification
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.btn-copy-phone');
  const toast = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-msg');

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = '9958399157';
      navigator.clipboard.writeText(phone).then(() => {
        showToast(`Phone number ${phone} copied to clipboard!`);
      }).catch(() => {
        showToast(`Dial: ${phone}`);
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}

/* --------------------------------------------------------------------------
   4. 3D Avatar Tilt Physics
   -------------------------------------------------------------------------- */
function initAvatarTilt() {
  const card = document.getElementById('avatar-tilt-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 10;
    const rotY = (x / (rect.width / 2)) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Contact Form
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = `<span class="t-cmd">Connecting...</span>`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      form.reset();

      feedback.className = 'form-feedback success';
      feedback.innerHTML = `✓ Thank you! Your message has been sent to <strong>Shaikh Mudassir</strong> (+91 9958399157). He will get in touch with you shortly.`;
      feedback.style.display = 'block';

      setTimeout(() => {
        feedback.style.display = 'none';
      }, 7000);
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   6. Mobile Nav
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}

/* --------------------------------------------------------------------------
   7. Scroll Spy
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}
