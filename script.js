/* ═══════════════════════════════════════════════════════════════
   Md. Rashedun Nabi Portfolio — script.js
   Features: AOS, GSAP animations, Typed text, Counter, Navbar,
             Skill bars, Back-to-top, Contact form, Mobile menu
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. Utility ──────────────────────────────────────────── */
const qs  = (s, p = document)  => p.querySelector(s);
const qsa = (s, p = document)  => [...p.querySelectorAll(s)];
const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ── 2. AOS Init ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  initNavbar();
  initMobileMenu();
  initTyped();
  initSkillBars();
  initCounters();
  initScrollToTop();
  initContactForm();
  initFooterYear();
  initNavActiveLinks();
  initHeroGSAP();
  initSmoothScroll();
});

/* ── 3. Navbar scroll behaviour ──────────────────────────── */
function initNavbar() {
  const navbar = qs('#navbar');
  if (!navbar) return;

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ── 4. Mobile Menu ──────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = qs('#hamburger');
  const mobileMenu = qs('#mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const toggle = () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  const close = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  on(hamburger, 'click', toggle);
  qsa('.mobile-link', mobileMenu).forEach(a => on(a, 'click', close));

  // Close on backdrop click
  on(document, 'click', e => {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      close();
    }
  });
}

/* ── 5. Typing Effect ────────────────────────────────────── */
function initTyped() {
  const el = qs('#typed-output');
  if (!el) return;

  const phrases = [
    'Costing & Budgeting Analyst',
    'Power BI Specialist',
    'CMA (Partly Qualified)',
    'Financial Reporting Expert',
    'Variance Analysis Expert',
    'Advanced Excel Specialist',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 100;

  const tick = () => {
    const phrase = phrases[phraseIdx];
    el.textContent = isDeleting
      ? phrase.substring(0, charIdx - 1)
      : phrase.substring(0, charIdx + 1);

    charIdx += isDeleting ? -1 : 1;

    if (!isDeleting && charIdx === phrase.length) {
      delay = 1800; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    } else {
      delay = isDeleting ? 50 : 100;
    }

    setTimeout(tick, delay);
  };

  setTimeout(tick, 700);
}

/* ── 6. Skill Bar Animations (Intersection Observer) ─────── */
function initSkillBars() {
  const fills = qsa('.skill-bar-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width || 0;
        // Brief delay for stagger feel
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 150);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.2 });

  fills.forEach(fill => observer.observe(fill));
}

/* ── 7. Stat Counter Animation ───────────────────────────── */
function initCounters() {
  const counters = qsa('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        animateCounter(el, 0, target, 1400);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el, start, end, duration) {
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    el.textContent = Math.round(start + (end - start) * ease);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = end;
  };
  requestAnimationFrame(step);
}

/* ── 8. Back to Top ──────────────────────────────────────── */
function initScrollToTop() {
  const btn = qs('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  on(btn, 'click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 9. Contact Form ─────────────────────────────────────── */
function initContactForm() {
  const form = qs('#contact-form');
  if (!form) return;

  on(form, 'submit', e => {
    e.preventDefault();
    const name    = qs('#contact-name', form).value.trim();
    const email   = qs('#contact-email', form).value.trim();
    const subject = qs('#contact-subject', form).value.trim();
    const message = qs('#contact-message', form).value.trim();

    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields before sending.');
      return;
    }

    const mailtoUrl = `mailto:rashedunnabi100@gmail.com`
      + `?subject=${encodeURIComponent(subject)}`
      + `&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

    window.location.href = mailtoUrl;
  });
}

/* ── 10. Footer Year ─────────────────────────────────────── */
function initFooterYear() {
  const el = qs('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── 11. Active Nav Links on Scroll ──────────────────────── */
function initNavActiveLinks() {
  const sections  = qsa('section[id]');
  const navLinks  = qsa('.nav-link');

  const activateLink = () => {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) currentId = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });
  activateLink();
}

/* ── 12. GSAP Hero Entrance ─────────────────────────────── */
function initHeroGSAP() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero avatar floating
  gsap.to('.avatar-wrapper', {
    y: -14,
    duration: 3.5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });

  // Parallax on orbs
  gsap.to('.hero-orb-1', {
    y: -80,
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });

  gsap.to('.hero-orb-2', {
    y: -50,
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  // Section title reveal
  qsa('.section-title').forEach(title => {
    gsap.from(title, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Timeline cards slide in from left
  qsa('.timeline-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      x: -40,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      delay: i * 0.15,
    });
  });

  // Education cards scale in
  qsa('.edu-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      delay: i * 0.08,
    });
  });

  // Tool badges bounce in
  qsa('.tool-badge').forEach((badge, i) => {
    gsap.from(badge, {
      opacity: 0,
      y: 30,
      duration: 0.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: badge,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
      delay: i * 0.06,
    });
  });
}

/* ── 13. Smooth Scroll for anchor links ─────────────────── */
function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(link => {
    on(link, 'click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = qs(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}
