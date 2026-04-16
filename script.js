/* ═══════════════════════════════════════════════════════════════════
   TARIQ GARDENS · v3 — The Estate
   ═══════════════════════════════════════════════════════════════════ */

document.getElementById('yr').textContent = new Date().getFullYear();

/* ─────────── LOADER ─────────── */
(function loader(){
  const loader = document.getElementById('loader');
  const num    = document.getElementById('loadNum');
  const bar    = document.getElementById('loadBar');
  let p = 0;
  const target = 100;
  const step = () => {
    const inc = Math.max(1, (target - p) * 0.05);
    p = Math.min(target, p + inc);
    num.textContent = Math.round(p);
    bar.style.transform = `scaleX(${p/100})`;
    if (p < target) {
      setTimeout(step, 40);
    } else {
      setTimeout(() => loader.classList.add('done'), 600);
    }
  };
  // Wait for initial paint
  window.addEventListener('load', () => setTimeout(step, 300));
})();

/* ─────────── LENIS SMOOTH SCROLL ─────────── */
let lenis = null;
(function initLenis(){
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const t = document.querySelector(href);
    if (!t) return;
    e.preventDefault();
    closeMenu();
    lenis.scrollTo(t, { offset: -60, duration: 1.4 });
  });
})();

/* ─────────── CUSTOM CURSOR ─────────── */
(function cursorInit(){
  if (matchMedia('(hover:none)').matches) return;
  const cursor = document.getElementById('cursor');
  const label  = cursor.querySelector('.cursor-label');
  let x = 0, y = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
  function raf(){
    cx += (x - cx) * 0.22;
    cy += (y - cy) * 0.22;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(raf);
  }
  raf();

  document.addEventListener('mousedown', () => cursor.classList.add('down'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('down'));

  // Hover handling
  const selectors = 'a, button, .mi-item, .am, .vc, .ld, .sf, .tilt, [data-cursor]';
  document.querySelectorAll(selectors).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      const c = el.dataset.cursor;
      label.textContent = c || '';
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      label.textContent = '';
    });
  });
})();

/* ─────────── NAV SCROLL STATE ─────────── */
const nav = document.getElementById('nav');
const toTop = document.getElementById('toTop');
const rail = document.getElementById('rail');
const railN = document.getElementById('railN');
const railFill = document.getElementById('railFill');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  toTop.classList.toggle('show', y > 400);
  rail.classList.toggle('show', y > 400);

  // Rail progress & chapter tracking
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const p = Math.min(1, Math.max(0, y / total));
  railFill.style.transform = `scaleY(${p})`;

  const chapters = document.querySelectorAll('.ch');
  let activeCh = 1;
  chapters.forEach((ch, i) => {
    const r = ch.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.3) {
      activeCh = i + 1;
    }
  });
  railN.textContent = String(activeCh).padStart(2,'0');
}, { passive:true });

toTop.addEventListener('click', () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.8 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─────────── MENU OVERLAY ─────────── */
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');

let savedScroll = 0;
function lockBody(){
  savedScroll = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScroll}px`;
  document.body.style.width = '100%';
}
function unlockBody(){
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, savedScroll);
}
function openMenu(){
  lockBody();
  menu.classList.add('active');
  menuBtn.classList.add('active');
  document.body.classList.add('menu-open');
  menu.setAttribute('aria-hidden','false');
}
function closeMenu(){
  if (!menu.classList.contains('active')) return;
  menu.classList.remove('active');
  menuBtn.classList.remove('active');
  document.body.classList.remove('menu-open');
  menu.setAttribute('aria-hidden','true');
  setTimeout(unlockBody, 450);
}
menuBtn.addEventListener('click', () => {
  menu.classList.contains('active') ? closeMenu() : openMenu();
});
menu.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
});

/* ─────────── LANGUAGE TOGGLE ─────────── */
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
try { if (localStorage.getItem('tg-lang') === 'ur') setLang('ur'); } catch(e){}

/* ─────────── HERO CAROUSEL ─────────── */
(function heroCarousel(){
  const slides = document.querySelectorAll('.hs-slide');
  const progress = document.querySelector('#hsProgress span');
  const captN = document.querySelector('.hsc-n');
  const title = document.getElementById('hsTitle');
  if (!slides.length) return;

  const titles = [
    'Main Boulevard · Entrance',
    'Community Gardens · Dusk',
    'Block Lighting · 2am',
    'Central Park · Spring'
  ];
  let idx = 0;
  const DURATION = 5500;

  function tick(){
    slides.forEach(s => s.classList.remove('active'));
    slides[idx].classList.add('active');
    captN.textContent = String(idx + 1).padStart(2, '0');
    title.textContent = titles[idx] || '';
    progress.style.transition = 'none';
    progress.style.transform = 'scaleX(0)';
    requestAnimationFrame(() => {
      progress.style.transition = `transform ${DURATION}ms linear`;
      progress.style.transform = 'scaleX(1)';
    });
    idx = (idx + 1) % slides.length;
  }
  tick();
  setInterval(tick, DURATION);
})();

/* ─────────── SPLIT TEXT REVEALS ─────────── */
const splitObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      splitObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.split').forEach(el => splitObs.observe(el));

/* ─────────── REVEAL ON SCROLL ─────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.sf, .ld, .am, .vc, .feature-strip, .plan-list, .plan-live, .visit-form, .visit-dl, .pl-conn, .mosaic, .amen-extras, .hero-marks').forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

/* ─────────── MOUSE TILT ─────────── */
(function tiltInit(){
  if (matchMedia('(hover:none)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${-my * 4}deg) rotateY(${mx * 4}deg)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
})();

/* ─────────── MAGNETIC BUTTONS ─────────── */
(function magneticInit(){
  if (matchMedia('(hover:none)').matches) return;
  document.querySelectorAll('.magnet').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = (e.clientX - r.left) - r.width / 2;
      const my = (e.clientY - r.top) - r.height / 2;
      el.style.transform = `translate(${mx * 0.2}px, ${my * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
})();

/* ─────────── GALLERY DATA ─────────── */
const galleryData = [
  { n:'01', src:'01.jpg', title:'Grand Entrance',    cat:'architecture',   span:'mi-a' },
  { n:'02', src:'04.jpg', title:'Main Boulevard',    cat:'infrastructure', span:'mi-b' },
  { n:'03', src:'08.jpg', title:'Evening Walk',      cat:'community',      span:'mi-c' },
  { n:'04', src:'12.jpg', title:'Block Gardens',     cat:'landscape',      span:'mi-d' },
  { n:'05', src:'06.jpg', title:'Open Courtyards',   cat:'landscape',      span:'mi-e' },
  { n:'06', src:'02.jpg', title:'Residential Lines', cat:'architecture',   span:'mi-f' },
  { n:'07', src:'16.jpg', title:'Signature Roads',   cat:'infrastructure', span:'mi-b' },
  { n:'08', src:'18.jpg', title:'Street Lighting',   cat:'infrastructure', span:'mi-a' },
  { n:'09', src:'22.jpg', title:'Park Details',      cat:'landscape',      span:'mi-d' },
  { n:'10', src:'24.jpg', title:'Moments of Rest',   cat:'community',      span:'mi-c' },
  { n:'11', src:'28.jpg', title:'The Living Grid',   cat:'infrastructure', span:'mi-f' },
  { n:'12', src:'32.jpg', title:'Our Promise',       cat:'community',      span:'mi-e' },
  { n:'13', src:'05.jpg', title:'Green Avenue',      cat:'landscape',      span:'mi-a' },
  { n:'14', src:'09.jpg', title:'Architectural Detail', cat:'architecture',span:'mi-d' },
  { n:'15', src:'14.jpg', title:'Wide Approach',     cat:'architecture',   span:'mi-c' },
  { n:'16', src:'19.jpg', title:'Community Life',    cat:'community',      span:'mi-b' },
  { n:'17', src:'21.jpg', title:'Evening Light',     cat:'landscape',      span:'mi-f' },
  { n:'18', src:'23.jpg', title:'Streetscape',       cat:'infrastructure', span:'mi-e' },
  { n:'19', src:'25.jpg', title:'Garden Pathways',   cat:'landscape',      span:'mi-a' },
  { n:'20', src:'26.jpg', title:'Signature Corner',  cat:'architecture',   span:'mi-d' },
  { n:'21', src:'27.jpg', title:'Block Living',      cat:'community',      span:'mi-c' },
  { n:'22', src:'29.jpg', title:'Neighbourhood',     cat:'community',      span:'mi-b' },
  { n:'23', src:'30.jpg', title:'Gardens',           cat:'landscape',      span:'mi-f' },
  { n:'24', src:'31.jpg', title:'The View',          cat:'architecture',   span:'mi-e' },
];

/* ─────────── HORIZONTAL SCROLL GALLERY ─────────── */
(function horizontalGallery(){
  const track = document.getElementById('hscrollTrack');
  const frame = document.getElementById('hscroll');
  const bar   = document.getElementById('hscrollBar');
  const numN  = document.getElementById('hscrollN');
  const numT  = document.getElementById('hscrollT');
  if (!track) return;

  // Pick a curated 12 for the horizontal strip
  const strip = galleryData.slice(0, 12);
  numT.textContent = strip.length;

  strip.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'hs';

    const img = document.createElement('img');
    img.src = `public/gallery/${item.src}`;
    img.alt = item.title;
    img.loading = 'lazy';
    el.appendChild(img);

    const lbl = document.createElement('div');
    lbl.className = 'hs-lbl';
    lbl.textContent = item.title;
    el.appendChild(lbl);

    const n = document.createElement('div');
    n.className = 'hs-n';
    n.textContent = String(i + 1).padStart(2, '0');
    el.appendChild(n);

    el.addEventListener('click', () => openLightbox(i));
    track.appendChild(el);
  });

  // Convert vertical scroll over the frame into horizontal translate
  function onScroll(){
    const r = frame.getBoundingClientRect();
    const h = frame.offsetHeight;
    if (r.bottom < 0 || r.top > window.innerHeight) return;

    const trackW = track.scrollWidth;
    const travel = trackW - window.innerWidth;
    if (travel <= 0) return;

    // progress through the pinned viewport
    const start = r.top;
    const end = r.bottom - window.innerHeight;
    // how much of the section is scrolled past
    const passed = Math.min(1, Math.max(0, (-start) / h));
    const x = -travel * passed;
    track.style.transform = `translateX(${x}px)`;
    bar.style.transform = `scaleX(${passed})`;

    const activeIdx = Math.round(passed * (strip.length - 1));
    numN.textContent = String(activeIdx + 1).padStart(2, '0');
  }
  // Make the frame tall enough to allow scrubbing
  frame.style.height = `${Math.max(100, galleryData.length * 5)}vh`;
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────── MOSAIC (below horizontal) ─────────── */
(function mosaic(){
  const grid = document.getElementById('mosaic');
  if (!grid) return;

  let shown = 12;
  function render(){
    grid.textContent = '';
    galleryData.slice(0, shown).forEach((it, i) => {
      const div = document.createElement('div');
      div.className = `mi-item ${it.span}`;
      div.dataset.cat = it.cat;
      div.dataset.idx = i;
      const img = document.createElement('img');
      img.src = `public/gallery/${it.src}`;
      img.alt = it.title;
      img.loading = 'lazy';
      div.appendChild(img);
      const cap = document.createElement('div');
      cap.className = 'mi-cap';
      cap.textContent = `${it.n} · ${it.title}`;
      div.appendChild(cap);
      div.addEventListener('click', () => openLightbox(i));
      grid.appendChild(div);
    });
  }
  render();

  const btn = document.getElementById('mosaicMore');
  btn.addEventListener('click', () => {
    if (shown >= galleryData.length) { shown = 12; btn.querySelector('span').textContent = 'Reveal all 32 frames'; btn.querySelector('i').textContent = '↓'; }
    else { shown = galleryData.length; btn.querySelector('span').textContent = 'Show less'; btn.querySelector('i').textContent = '↑'; }
    render();
  });
})();

/* ─────────── LIGHTBOX ─────────── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbTitle  = document.getElementById('lbTitle');
const lbIdx    = document.getElementById('lbIdx');
let lbI = 0;
function openLightbox(i){
  lbI = i;
  updateLb();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden','false');
  if (lenis) lenis.stop();
}
function closeLightbox(){
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden','true');
  if (lenis) lenis.start();
}
function updateLb(){
  const it = galleryData[lbI];
  lbImg.src = `public/gallery/${it.src}`;
  lbImg.alt = it.title;
  lbTitle.textContent = it.title;
  lbIdx.textContent = `${String(lbI + 1).padStart(2,'0')} / ${galleryData.length}`;
}
document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => { lbI = (lbI - 1 + galleryData.length) % galleryData.length; updateLb(); });
document.getElementById('lbNext').addEventListener('click', () => { lbI = (lbI + 1) % galleryData.length; updateLb(); });
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  document.getElementById('lbPrev').click();
  if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
});

/* ─────────── VISIT FORM ─────────── */
window.handleVisit = function(form){
  const ok = form.querySelector('#vfOk');
  ok.classList.add('show');
  setTimeout(() => {
    form.reset();
    setTimeout(() => ok.classList.remove('show'), 4500);
  }, 300);
};

/* ─────────── PL-CONN BAR REVEAL ─────────── */
const plConn = document.querySelector('.pl-conn');
if (plConn) {
  const plObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        plConn.classList.add('in');
        plObs.unobserve(plConn);
      }
    });
  }, { threshold: 0.3 });
  plObs.observe(plConn);
}
