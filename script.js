/* ═══════════════════════════════════════════════════════════
   script.js · Prajesh Bilash Panta — Portfolio + Auth
═══════════════════════════════════════════════════════════ */

const EMAILJS_PUBLIC_KEY  = '2--6eYuKPulcnFFrp';
const EMAILJS_SERVICE_ID  = 'service_n5xwxpe';
const EMAILJS_TEMPLATE_ID = 'template_cgm1oqo';


/* ═══════════════════════════════════════════════════════════
   GREETING — shows Good Morning / Afternoon / Evening / Night
   based on the visitor's LOCAL device time (their own country)
═══════════════════════════════════════════════════════════ */
function initGreeting() {
  const hour = new Date().getHours(); // uses visitor's local time

  let icon, greeting;

  if (hour >= 5 && hour < 12) {
    icon = '🌅';
    greeting = 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    icon = '☀️';
    greeting = 'Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    icon = '🌆';
    greeting = 'Good Evening';
  } else {
    icon = '🌙';
    greeting = 'Good Night';
  }

  document.getElementById('greeting-icon').textContent = icon;
  document.getElementById('greeting-text').textContent = greeting + ',';

  /* If user is logged in, show their name in greeting */
  const session = JSON.parse(localStorage.getItem('pbp_session') || 'null');
  const nameEl  = document.getElementById('greeting-name');
  if (session && session.name) {
    nameEl.textContent = session.name.split(' ')[0] + '!';
  } else {
    nameEl.textContent = 'Welcome to my Portfolio!';
  }
}

function closeGreeting() {
  const banner = document.getElementById('greeting-banner');
  banner.style.transition = 'all 0.3s ease';
  banner.style.maxHeight  = '0';
  banner.style.padding    = '0';
  banner.style.opacity    = '0';
  setTimeout(() => { banner.style.display = 'none'; }, 300);
}


/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — Typewriter
═══════════════════════════════════════════════════════════ */
const phrases = [
  'COMPUTER ENGINEERING STUDENT',
  'AI / ML LEARNER',
  'PHP-WORDPRESS DEVELOPER',
  'DEEP LEARNING RESEARCHER',
  'VOICE SYNTHESIS EXPLORER',
];
let phraseIndex = 0, charIndex = 0, isDeleting = false, twTimeout;

function typeWriter() {
  const el = document.getElementById('tw-text');
  if (!el) return;
  const current = phrases[phraseIndex];
  if (!isDeleting) {
    el.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      twTimeout = setTimeout(typeWriter, 2200); return;
    }
  } else {
    el.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      twTimeout = setTimeout(typeWriter, 400); return;
    }
  }
  twTimeout = setTimeout(typeWriter, isDeleting ? 45 : 80);
}


/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — Stats counter
═══════════════════════════════════════════════════════════ */
let statsAnimated = false;
function animateStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const steps  = 1400 / 16;
    const inc    = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { el.textContent = target; clearInterval(t); }
      else el.textContent = Math.floor(cur);
    }, 16);
  });
}


/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — Navbar
═══════════════════════════════════════════════════════════ */
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
    if (!statsAnimated && window.scrollY > 100) { animateStats(); statsAnimated = true; }
  }, { passive: true });

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}


/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — Scroll reveal
═══════════════════════════════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 80 + 'ms';
    obs.observe(el);
  });
}


/* ═══════════════════════════════════════════════════════════
   AUTH — Helpers
═══════════════════════════════════════════════════════════ */
async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function genOTP() { return String(Math.floor(100000 + Math.random() * 900000)); }

function showAlert(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = 'auth-alert show ' + type;
}
function clearAlert(id) {
  const el = document.getElementById(id);
  if (el) { el.textContent = ''; el.className = 'auth-alert'; }
}

function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function updateStrength(val) {
  const fill = document.getElementById('strength-fill');
  if (!fill) return;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  fill.style.width      = (score * 25) + '%';
  fill.style.background = ['#c0392b', '#e67e22', '#d4ac0d', '#1e8449'][score - 1] || '#c0392b';
}

function shakeInput(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('err');
  setTimeout(() => el.classList.remove('err'), 500);
}

let timerInterval = null;
function startTimer(displayId, minutes, cb) {
  clearInterval(timerInterval);
  let secs = minutes * 60;
  const el = document.getElementById(displayId);
  function tick() {
    const m = String(Math.floor(secs / 60)).padStart(1, '0');
    const s = String(secs % 60).padStart(2, '0');
    if (el) el.textContent = m + ':' + s;
    if (secs <= 0) { clearInterval(timerInterval); if (el) el.classList.add('expired'); cb(); }
    secs--;
  }
  tick();
  timerInterval = setInterval(tick, 1000);
}


/* ═══════════════════════════════════════════════════════════
   AUTH — EmailJS sender
═══════════════════════════════════════════════════════════ */
async function sendOTPEmail(toEmail, toName, otp) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
  await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email          : toEmail,
    to_name           : toName || toEmail.split('@')[0],
    verification_code : otp,
  });
}


/* ═══════════════════════════════════════════════════════════
   AUTH — State
═══════════════════════════════════════════════════════════ */
let pendingReg   = null;
let pendingReset = null;


/* ═══════════════════════════════════════════════════════════
   AUTH — Open / Close
═══════════════════════════════════════════════════════════ */
function openAuth() {
  document.getElementById('auth-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  switchTab('login');
}
function closeAuth() {
  document.getElementById('auth-overlay').classList.remove('open');
  document.body.style.overflow = '';
  clearInterval(timerInterval);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('auth-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('auth-overlay')) closeAuth();
  });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAuth(); });


/* ═══════════════════════════════════════════════════════════
   AUTH — Tab switching
═══════════════════════════════════════════════════════════ */
function switchTab(tab) {
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  if (tab === 'login') {
    document.getElementById('panel-login').classList.add('active');
    document.getElementById('tab-login').classList.add('active');
    clearAlert('login-alert');
  } else {
    document.getElementById('panel-register').classList.add('active');
    document.getElementById('tab-register').classList.add('active');
    clearAlert('reg-alert');
    document.getElementById('reg-step1').style.display = '';
    document.getElementById('verify-step').classList.remove('show');
  }
  document.getElementById('panel-forgot').classList.remove('active');
}


/* ═══════════════════════════════════════════════════════════
   AUTH — LOGIN
═══════════════════════════════════════════════════════════ */
async function doLogin() {
  clearAlert('login-alert');
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pw    = document.getElementById('login-pw').value;
  if (!email) { shakeInput('login-email'); showAlert('login-alert', 'Enter your email address.', 'error'); return; }
  if (!pw)    { shakeInput('login-pw');    showAlert('login-alert', 'Enter your password.', 'error'); return; }

  const btn = document.getElementById('login-cta');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span>CONNECTING...';
  await new Promise(r => setTimeout(r, 600));

  const users = JSON.parse(localStorage.getItem('pbp_users') || '{}');
  const user  = users[email];
  if (!user) {
    showAlert('login-alert', 'No account found. Please register first.', 'error');
    shakeInput('login-email');
    btn.disabled = false; btn.textContent = 'LOGIN'; return;
  }
  const hash = await sha256(pw);
  if (hash !== user.pwHash) {
    showAlert('login-alert', 'Incorrect password. Please try again.', 'error');
    shakeInput('login-pw');
    btn.disabled = false; btn.textContent = 'LOGIN'; return;
  }

  localStorage.setItem('pbp_session', JSON.stringify({ email, name: user.name }));
  renderAuthState();
  initGreeting(); /* update greeting with user name */
  showAlert('login-alert', '✔ Welcome back, ' + user.name + '! Redirecting...', 'success');
  setTimeout(closeAuth, 1400);
  btn.disabled = false; btn.textContent = 'LOGIN';
}


/* ═══════════════════════════════════════════════════════════
   AUTH — REGISTER Step 1
═══════════════════════════════════════════════════════════ */
async function doRegister() {
  clearAlert('reg-alert');
  const name    = document.getElementById('reg-name').value.trim();
  const email   = document.getElementById('reg-email').value.trim().toLowerCase();
  const pw      = document.getElementById('reg-pw').value;
  const confirm = document.getElementById('reg-confirm').value;

  if (!name)  { shakeInput('reg-name');    showAlert('reg-alert', 'Please enter your full name.', 'error'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    shakeInput('reg-email'); showAlert('reg-alert', 'Please enter a valid email address.', 'error'); return;
  }
  if (pw.length < 8) { shakeInput('reg-pw'); showAlert('reg-alert', 'Password must be at least 8 characters.', 'error'); return; }
  if (pw !== confirm) { shakeInput('reg-confirm'); showAlert('reg-alert', 'Passwords do not match.', 'error'); return; }

  const users = JSON.parse(localStorage.getItem('pbp_users') || '{}');
  if (users[email]) { shakeInput('reg-email'); showAlert('reg-alert', 'This email is already registered. Please log in.', 'error'); return; }

  const btn = document.getElementById('reg-cta');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span>SENDING EMAIL...';
  showAlert('reg-alert', 'Sending verification code to your email…', 'sending');

  const otp = genOTP();
  try {
    await sendOTPEmail(email, name, otp);
  } catch (err) {
    showAlert('reg-alert', 'Failed to send email. ' + err.message, 'error');
    btn.disabled = false; btn.textContent = 'SEND VERIFICATION EMAIL'; return;
  }

  const pwHash = await sha256(pw);
  pendingReg = { name, email, pwHash, otp, exp: Date.now() + 5 * 60 * 1000 };
  clearAlert('reg-alert');
  document.getElementById('verify-email-display').textContent = email;
  document.getElementById('reg-step1').style.display = 'none';
  document.getElementById('verify-step').classList.add('show');
  document.getElementById('otp-input').value = '';
  document.getElementById('otp-input').focus();
  startTimer('reg-timer', 5, () => {
    showAlert('reg-alert', 'Code expired. Please go back and try again.', 'error');
  });
  btn.disabled = false; btn.textContent = 'SEND VERIFICATION EMAIL';
}


/* ═══════════════════════════════════════════════════════════
   AUTH — REGISTER Step 2 (verify OTP → go to login)
═══════════════════════════════════════════════════════════ */
function doVerify() {
  clearAlert('reg-alert');
  const entered = document.getElementById('otp-input').value.trim();
  if (!pendingReg) { showAlert('reg-alert', 'Session expired. Please restart.', 'error'); return; }
  if (Date.now() > pendingReg.exp) { showAlert('reg-alert', 'Code expired. Please go back.', 'error'); return; }
  if (entered !== pendingReg.otp) { shakeInput('otp-input'); showAlert('reg-alert', 'Incorrect code. Please try again.', 'error'); return; }

  const users = JSON.parse(localStorage.getItem('pbp_users') || '{}');
  users[pendingReg.email] = { name: pendingReg.name, pwHash: pendingReg.pwHash };
  localStorage.setItem('pbp_users', JSON.stringify(users));

  const savedEmail = pendingReg.email;
  const savedName  = pendingReg.name;
  pendingReg = null;
  clearInterval(timerInterval);

  switchTab('login');
  setTimeout(() => {
    const emailInput = document.getElementById('login-email');
    if (emailInput) emailInput.value = savedEmail;
    const pwInput = document.getElementById('login-pw');
    if (pwInput) pwInput.focus();
    showAlert('login-alert', '✔ Account verified for ' + savedName + '! Enter your password to log in.', 'success');
  }, 60);
}


/* ═══════════════════════════════════════════════════════════
   AUTH — Back to step 1
═══════════════════════════════════════════════════════════ */
function backToStep1() {
  clearInterval(timerInterval);
  pendingReg = null;
  document.getElementById('verify-step').classList.remove('show');
  document.getElementById('reg-step1').style.display = '';
  clearAlert('reg-alert');
}


/* ═══════════════════════════════════════════════════════════
   AUTH — Forgot password
═══════════════════════════════════════════════════════════ */
function openForgot() {
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-forgot').classList.add('active');
  clearAlert('forgot-alert');
  document.getElementById('forgot-step-b').classList.remove('show');
}
function closeForgot() { switchTab('login'); }

async function doForgotSend() {
  clearAlert('forgot-alert');
  const email = document.getElementById('forgot-email').value.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    shakeInput('forgot-email'); showAlert('forgot-alert', 'Please enter a valid email.', 'error'); return;
  }
  const users = JSON.parse(localStorage.getItem('pbp_users') || '{}');
  if (!users[email]) { shakeInput('forgot-email'); showAlert('forgot-alert', 'No account found with this email.', 'error'); return; }

  const btn = document.getElementById('forgot-cta');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span>SENDING...';
  showAlert('forgot-alert', 'Sending reset code…', 'sending');
  const otp = genOTP();
  try {
    await sendOTPEmail(email, users[email].name, otp);
  } catch (err) {
    showAlert('forgot-alert', 'Failed to send email. ' + err.message, 'error');
    btn.disabled = false; btn.textContent = 'SEND RESET CODE'; return;
  }

  pendingReset = { email, otp, exp: Date.now() + 5 * 60 * 1000 };
  clearAlert('forgot-alert');
  document.getElementById('forgot-step-b').classList.add('show');
  document.getElementById('reset-otp').value = '';
  document.getElementById('reset-otp').focus();
  startTimer('reset-timer', 5, () => { showAlert('forgot-alert', 'Reset code expired.', 'error'); });
  btn.disabled = false; btn.textContent = 'SEND RESET CODE';
}

async function doResetPassword() {
  clearAlert('forgot-alert');
  const entered   = document.getElementById('reset-otp').value.trim();
  const newPw     = document.getElementById('new-pw').value;
  const newPwConf = document.getElementById('new-pw-confirm').value;

  if (!pendingReset || Date.now() > pendingReset.exp) { showAlert('forgot-alert', 'Reset code expired.', 'error'); return; }
  if (entered !== pendingReset.otp) { shakeInput('reset-otp'); showAlert('forgot-alert', 'Incorrect reset code.', 'error'); return; }
  if (newPw.length < 8) { shakeInput('new-pw'); showAlert('forgot-alert', 'Password must be at least 8 characters.', 'error'); return; }
  if (newPw !== newPwConf) { shakeInput('new-pw-confirm'); showAlert('forgot-alert', 'Passwords do not match.', 'error'); return; }

  const users = JSON.parse(localStorage.getItem('pbp_users') || '{}');
  users[pendingReset.email].pwHash = await sha256(newPw);
  localStorage.setItem('pbp_users', JSON.stringify(users));

  const resetEmail = pendingReset.email;
  pendingReset = null;
  clearInterval(timerInterval);

  switchTab('login');
  setTimeout(() => {
    const emailInput = document.getElementById('login-email');
    if (emailInput) emailInput.value = resetEmail;
    const pwInput = document.getElementById('login-pw');
    if (pwInput) pwInput.focus();
    showAlert('login-alert', '✔ Password reset! Enter your new password to log in.', 'success');
  }, 60);
}


/* ═══════════════════════════════════════════════════════════
   AUTH — Logout
═══════════════════════════════════════════════════════════ */
function doLogout() {
  localStorage.removeItem('pbp_session');
  renderAuthState();
  initGreeting(); /* reset greeting to visitor mode */
}


/* ═══════════════════════════════════════════════════════════
   AUTH — Render navbar
═══════════════════════════════════════════════════════════ */
function renderAuthState() {
  const area    = document.getElementById('nav-auth-area');
  const session = JSON.parse(localStorage.getItem('pbp_session') || 'null');
  if (session) {
    area.innerHTML =
      '<div class="nav-user-badge">' +
        '<span class="nav-user-dot"></span>' +
        '<span>' + session.name.split(' ')[0] + '</span>' +
        '<button class="nav-logout-btn" onclick="doLogout()">Logout</button>' +
      '</div>';
  } else {
    area.innerHTML = '<button class="nav-auth-btn" onclick="openAuth()">LOGIN / REGISTER</button>';
  }
}


/* ═══════════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* Portfolio */
  setTimeout(typeWriter, 700);
  setTimeout(() => { if (!statsAnimated) { animateStats(); statsAnimated = true; } }, 900);
  initNavbar();
  initReveal();

  /* Auth */
  renderAuthState();

  /* Greeting — reads visitor's local time automatically */
  initGreeting();

  /* Auto-open login modal if URL hash is #login */
  if (window.location.hash === '#login') {
    setTimeout(() => { openAuth(); switchTab('login'); }, 500);
  }
});
