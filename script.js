/* script.js · Prajesh Bilash Panta — Portfolio */

/* GREETING — shows based on visitor's local time */
function initGreeting() {
  const hour = new Date().getHours();
  let icon, text;
  if      (hour >= 5  && hour < 12) { icon = '🌅'; text = 'Good Morning,'; }
  else if (hour >= 12 && hour < 17) { icon = '☀️'; text = 'Good Afternoon,'; }
  else if (hour >= 17 && hour < 21) { icon = '🌆'; text = 'Good Evening,'; }
  else                               { icon = '🌙'; text = 'Good Night,'; }
  document.getElementById('greeting-icon').textContent = icon;
  document.getElementById('greeting-text').textContent = text;
}

function closeGreeting() {
  const b = document.getElementById('greeting-banner');
  b.style.transition = 'all 0.3s ease';
  b.style.maxHeight  = '0';
  b.style.padding    = '0';
  b.style.opacity    = '0';
  b.style.overflow   = 'hidden';
}

/* TYPEWRITER */
const phrases = [
  'COMPUTER ENGINEERING STUDENT',
  'AI / ML LEARNER',
  'PHP & WORDPRESS DEVELOPER',
  'DEEP LEARNING RESEARCHER',
  'VOICE SYNTHESIS EXPLORER',
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typeWriter() {
  const el = document.getElementById('tw-text');
  if (!el) return;
  const current = phrases[phraseIndex];
  if (!isDeleting) {
    el.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) { isDeleting = true; setTimeout(typeWriter, 2200); return; }
  } else {
    el.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(typeWriter, 400); return; }
  }
  setTimeout(typeWriter, isDeleting ? 45 : 80);
}

/* NAVBAR */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    let current = 'hero';
    sections.forEach(s => { if (s.getBoundingClientRect().top <= 100) current = s.id; });
    navLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
  }, { passive: true });

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    });
  });
}

/* BOOT */
document.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  setTimeout(typeWriter, 700);
  initNavbar();
});
