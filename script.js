/* ================================================================
   TARIQ GARDENS · v2 — Architectural Edition
   ================================================================ */

/* ---------- Year ---------- */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ---------- Lenis smooth scroll ---------- */
(function initLenis(){
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // In-page anchor links -> smooth scroll via Lenis
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#' || !href) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -60, duration: 1.2 });
  });

  window.__lenis = lenis;
})();

/* ---------- Nav scroll state ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}, { passive: true });

/* ---------- Full-screen menu ---------- */
const menuTrigger = document.getElementById('menuTrigger');
const menuOverlay = document.getElementById('menuOverlay');

let savedScroll = 0;
function lockBody(){
  savedScroll = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScroll}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}
function unlockBody(){
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, savedScroll);
}

function openMenu(){
  lockBody();
  menuOverlay.classList.add('active');
  menuTrigger.classList.add('active');
  document.body.classList.add('menu-open');
  menuOverlay.setAttribute('aria-hidden','false');
}
function closeMenu(){
  menuOverlay.classList.remove('active');
  menuTrigger.classList.remove('active');
  document.body.classList.remove('menu-open');
  menuOverlay.setAttribute('aria-hidden','true');
  setTimeout(unlockBody, 450);
}
menuTrigger.addEventListener('click', () => {
  menuOverlay.classList.contains('active') ? closeMenu() : openMenu();
});
menuOverlay.querySelectorAll('[data-close-menu]').forEach(el => {
  el.addEventListener('click', closeMenu);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOverlay.classList.contains('active')) closeMenu();
});

/* ---------- Estate grid (filterable portfolio) ---------- */

const estateData = [
  { n:'01', src:'01.jpg', title:'Grand Entrance',      cat:'architecture',   loc:'Main Boulevard',  year:'Est. 1992', span:'s-a' },
  { n:'02', src:'04.jpg', title:'Boulevards',          cat:'infrastructure', loc:'100 ft Avenue',   year:'2022',     span:'s-b' },
  { n:'03', src:'08.jpg', title:'Evening Walks',       cat:'community',      loc:'Block B',         year:'2023',     span:'s-c' },
  { n:'04', src:'12.jpg', title:'Block Gardens',       cat:'landscape',      loc:'Park 03',         year:'2021',     span:'s-d' },
  { n:'05', src:'06.jpg', title:'Open Courtyards',     cat:'landscape',      loc:'Central Green',   year:'2022',     span:'s-e' },
  { n:'06', src:'02.jpg', title:'Residential Lines',   cat:'architecture',   loc:'Block C',         year:'2024',     span:'s-f' },
  { n:'07', src:'16.jpg', title:'Signature Roads',     cat:'infrastructure', loc:'60 ft Avenue',    year:'2022',     span:'s-a' },
  { n:'08', src:'18.jpg', title:'Street Lighting',     cat:'infrastructure', loc:'Estate-wide',     year:'2023',     span:'s-b' },
  { n:'09', src:'22.jpg', title:'Park Details',        cat:'landscape',      loc:'Block A',         year:'2023',     span:'s-c' },
  { n:'10', src:'24.jpg', title:'Moments of Rest',     cat:'community',      loc:'Central Green',   year:'2024',     span:'s-d' },
  { n:'11', src:'28.jpg', title:'The Living Grid',     cat:'infrastructure', loc:'Estate Plan',     year:'2022',     span:'s-e' },
  { n:'12', src:'32.jpg', title:'A Family\u2019s Promise', cat:'community', loc:'Block D',         year:'2024',     span:'s-f' },
];

const grid = document.getElementById('estateGrid');

function buildEstateCard(p, i){
  const a = document.createElement('a');
  a.className = `ep ${p.span} reveal`;
  a.href = '#visit';
  a.dataset.cat = p.cat;
  a.style.transitionDelay = `${(i % 3) * 0.08}s`;

  const frame = document.createElement('div');
  frame.className = 'ep-frame';

  const img = document.createElement('img');
  img.src = `public/gallery/${p.src}`;
  img.alt = p.title;
  img.loading = 'lazy';
  img.className = 'img-warm';
  frame.appendChild(img);

  const num = document.createElement('div');
  num.className = 'ep-num';
  num.textContent = p.n;
  frame.appendChild(num);

  // Set aspect based on span
  if (p.span === 's-a' || p.span === 's-e') frame.style.aspectRatio = '16 / 10';
  else if (p.span === 's-b' || p.span === 's-f') frame.style.aspectRatio = '3 / 4';
  else if (p.span === 's-c') frame.style.aspectRatio = '4 / 5';
  else if (p.span === 's-d') frame.style.aspectRatio = '5 / 3';

  a.appendChild(frame);

  const info = document.createElement('div');
  info.className = 'ep-info';

  const left = document.createElement('div');
  const cat = document.createElement('div');
  cat.className = 'eyebrow';
  cat.textContent = p.cat;
  const h3 = document.createElement('h3');
  h3.textContent = p.title;
  const loc = document.createElement('div');
  loc.className = 'loc';
  loc.textContent = p.loc;
  left.appendChild(cat);
  left.appendChild(h3);
  left.appendChild(loc);

  const right = document.createElement('div');
  right.style.textAlign = 'right';
  const yr = document.createElement('div');
  yr.className = 'yr';
  yr.textContent = p.year;
  const arrow = document.createElement('div');
  arrow.className = 'dot-arrow';
  arrow.textContent = '→';
  right.appendChild(yr);
  right.appendChild(arrow);

  info.appendChild(left);
  info.appendChild(right);
  a.appendChild(info);

  return a;
}

function renderEstate(){
  grid.textContent = '';
  estateData.forEach((p, i) => grid.appendChild(buildEstateCard(p, i)));
  // Attach reveal observer to newly added
  grid.querySelectorAll('.ep').forEach(el => revealObserver.observe(el));
}

/* ---------- Filters ---------- */
document.getElementById('filters').addEventListener('click', (e) => {
  const btn = e.target.closest('.f');
  if (!btn) return;
  document.querySelectorAll('.f').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  document.querySelectorAll('.ep').forEach(el => {
    if (filter === 'all' || el.dataset.cat === filter) el.classList.remove('hide');
    else el.classList.add('hide');
  });
});

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

/* Auto-tag candidate elements */
[
  '.numbered-head', '.stats', '.img-grid figure', '.pull',
  '.principle', '.am-row', '.tm', '.vq', '.visit-form', '.visit-meta',
  '.visit-coords', '.estate-head', '.estate-cta',
  '.community .display', '.approach .display', '.amenities .display',
  '.leadership .display', '.voices .display', '.visit-l .display'
].forEach(sel => document.querySelectorAll(sel).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
}));

renderEstate();

/* ---------- Hero parallax ---------- */
const heroImg = document.querySelector('.hero-bg img');
const heroSection = document.querySelector('.hero');
let heroRaf = null;
window.addEventListener('scroll', () => {
  if (heroRaf) return;
  heroRaf = requestAnimationFrame(() => {
    const rect = heroSection.getBoundingClientRect();
    if (rect.bottom > 0) {
      const p = Math.min(1, Math.max(0, -rect.top / rect.height));
      const y = p * 30;
      const scale = 1 + p * 0.15;
      heroImg.style.transform = `translateY(${y}%) scale(${scale})`;
    }
    heroRaf = null;
  });
}, { passive: true });

/* ---------- Language toggle ---------- */
function setLang(lang){
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('.lang-opt').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  try { localStorage.setItem('tg-lang', lang); } catch(e){}
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.lang-opt');
  if (!btn) return;
  setLang(btn.dataset.lang);
});
try {
  const saved = localStorage.getItem('tg-lang');
  if (saved === 'ur') setLang('ur');
} catch(e){}

/* ---------- Form submit ---------- */
function handleVisit(form){
  const ok = form.querySelector('#vfOk');
  ok.classList.add('show');
  setTimeout(() => {
    form.reset();
    setTimeout(() => ok.classList.remove('show'), 4000);
  }, 300);
}
window.handleVisit = handleVisit;
