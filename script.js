/* ═══════════════════════════════════════════════════════════
   script.js · Prajesh Bilash Panta — Portfolio
   ═══════════════════════════════════════════════════════════ */

/* ── Typewriter ── */
const phrases = [
  'COMPUTER ENGINEERING STUDENT',
  'AI / ML LEARNER',
  'PHP and Wordpress Developer',
  ,
  ,
];

let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
let twTimeout;

function typeWriter() {
  const el = document.getElementById('tw-text');
  if (!el) return;

  const current = phrases[phraseIndex];

  if (!isDeleting) {
    el.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      twTimeout = setTimeout(typeWriter, 2200);
      return;
    }
  } else {
    el.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting   = false;
      phraseIndex  = (phraseIndex + 1) % phrases.length;
      twTimeout = setTimeout(typeWriter, 400);
      return;
    }
  }

  twTimeout = setTimeout(typeWriter, isDeleting ? 45 : 80);
}


/* ── Stats counter (counts up when hero is visible) ── */
function animateStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const step     = 16;
    const steps    = duration / step;
    const increment = target / steps;
    let current    = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  });
}

let statsAnimated = false;


/* ── Navbar scroll effects + active link highlighting ── */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id], section.section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    /* Shrink navbar on scroll */
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* Highlight active nav link based on scroll position */
    let current = 'hero';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    /* Trigger stats counter once hero passes */
    if (!statsAnimated && window.scrollY > 100) {
      animateStats();
      statsAnimated = true;
    }
  }, { passive: true });

  /* Smooth scroll for nav clicks */
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}


/* ── Scroll reveal (Intersection Observer) ── */
function initReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          /* Once visible — trigger skill bar fill if inside skill-group */
          const fills = entry.target.querySelectorAll('.sk-fill');
          fills.forEach(fill => {
            fill.style.width = fill.dataset.w + '%';
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
}


/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  /* Start typewriter after a brief delay */
  twTimeout = setTimeout(typeWriter, 700);

  /* Start stats immediately (they're in the hero viewport) */
  setTimeout(() => {
    if (!statsAnimated) {
      animateStats();
      statsAnimated = true;
    }
  }, 900);

  initNavbar();
  initReveal();
});
