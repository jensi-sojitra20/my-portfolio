/* ══════════════════════════════════════════════
   script.js — Jensi Sojitra Portfolio
   Fixed: form validation, mailto send, resume download
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initThemeToggle();
  initTypedText();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initSmoothScroll();
  initActiveNav();
});

/* ══════════════════════════════════════════════
   NAVBAR — sticky shadow on scroll
══════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   ACTIVE NAV
══════════════════════════════════════════════ */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current    = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  links.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + current) l.classList.add('active');
  });
}

function initActiveNav() { updateActiveNav(); }

/* ══════════════════════════════════════════════
   HAMBURGER / MOBILE NAV
══════════════════════════════════════════════ */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('mobileNav');
  const links = menu.querySelectorAll('[data-close]');

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
    }
  });
}

/* ══════════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════════ */
function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const root = document.documentElement;

  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

/* ══════════════════════════════════════════════
   TYPED TEXT
══════════════════════════════════════════════ */
function initTypedText() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Learning Python step by step',
    'Building useful projects',
    'Exploring Machine Learning',
    'Automating boring things with code',
    
  ];

  let pIdx = 0, cIdx = 0, deleting = false, paused = false;

  function type() {
    if (paused) return;
    const cur = phrases[pIdx];
    if (!deleting) {
      el.textContent = cur.slice(0, ++cIdx);
      if (cIdx === cur.length) {
        deleting = paused = true;
        setTimeout(() => { paused = false; type(); }, 2200);
        return;
      }
    } else {
      el.textContent = cur.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 42 : 82);
  }
  setTimeout(type, 900);
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   SKILL BARS
══════════════════════════════════════════════ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.getAttribute('data-w') + '%';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  fills.forEach(f => observer.observe(f));
}

/* ══════════════════════════════════════════════
   CONTACT FORM — validate + mailto fallback
══════════════════════════════════════════════ */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const success   = document.getElementById('formSuccess');
  const sendBtn   = document.getElementById('sendBtn');
  const sendAgain = document.getElementById('sendAgainBtn');
  if (!form) return;

  // "Send another" resets view
  if (sendAgain) {
    sendAgain.addEventListener('click', () => {
      success.style.display = 'none';
      form.style.display    = 'block';
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameEl  = document.getElementById('fname');
    const emailEl = document.getElementById('femail');
    const msgEl   = document.getElementById('fmsg');

    const errName  = document.getElementById('err-name');
    const errEmail = document.getElementById('err-email');
    const errMsg   = document.getElementById('err-msg');

    // Clear previous errors
    [nameEl, emailEl, msgEl].forEach(el => el.classList.remove('error'));
    [errName, errEmail, errMsg].forEach(el => el.textContent = '');

    const name  = nameEl.value.trim();
    const email = emailEl.value.trim();
    const msg   = msgEl.value.trim();

    let valid = true;

    if (!name) {
      nameEl.classList.add('error');
      errName.textContent = 'Please enter your name.';
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailEl.classList.add('error');
      errEmail.textContent = 'Please enter a valid email.';
      valid = false;
    }
    if (!msg || msg.length < 10) {
      msgEl.classList.add('error');
      errMsg.textContent = 'Message must be at least 10 characters.';
      valid = false;
    }
    if (!valid) return;

    // ── Simulate sending + open mailto ──
    sendBtn.disabled = true;
    document.getElementById('sendBtnTxt').textContent = 'Sending…';
    document.getElementById('sendBtnIcon').className  = 'fa-solid fa-spinner fa-spin';

    // Build mailto link so the message actually goes somewhere
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
    const mailto  = `mailto:sojitrajensi20@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      // Open email client
      window.location.href = mailto;

      // Show success state
      form.style.display    = 'none';
      success.style.display = 'block';

      // Reset button
      sendBtn.disabled = false;
      document.getElementById('sendBtnTxt').textContent = 'Send Message';
      document.getElementById('sendBtnIcon').className  = 'fa-solid fa-paper-plane';
      form.reset();
    }, 1200);
  });
}

/* ══════════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
      const offset = document.getElementById('navbar').offsetHeight;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}