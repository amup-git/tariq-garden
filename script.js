/* =========================================================
   TARIQ GARDENS — Interactive Experience
   ========================================================= */

/* ---------- Preloader ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1400);
});

/* ---------- Current Year ---------- */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ---------- Navbar scroll state ---------- */
const nav = document.getElementById('nav');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
    toTop.classList.add('show');
  } else {
    nav.classList.remove('scrolled');
    toTop.classList.remove('show');
  }
});

/* ---------- Full-screen Overlay Menu ---------- */
const menuTrigger = document.getElementById('menuTrigger');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');

let savedScroll = 0;
function lockBodyScroll() {
  savedScroll = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScroll}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}
function unlockBodyScroll() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, savedScroll);
}

function openMenu() {
  lockBodyScroll();
  menuOverlay.classList.add('active');
  menuTrigger.classList.add('active');
  document.body.classList.add('menu-open');
  menuOverlay.setAttribute('aria-hidden', 'false');
}
function closeMenu() {
  menuOverlay.classList.remove('active');
  menuTrigger.classList.remove('active');
  document.body.classList.remove('menu-open');
  menuOverlay.setAttribute('aria-hidden', 'true');
  // Delay unlocking so the closing animation can play cleanly
  setTimeout(unlockBodyScroll, 420);
}

menuTrigger.addEventListener('click', () => {
  if (menuOverlay.classList.contains('active')) closeMenu();
  else openMenu();
});
menuClose.addEventListener('click', closeMenu);
menuOverlay.querySelectorAll('[data-close-menu]').forEach(el => {
  el.addEventListener('click', closeMenu);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOverlay.classList.contains('active')) closeMenu();
});

/* ---------- Language Toggle (EN / UR) ---------- */
function setLang(lang) {
  document.documentElement.setAttribute('lang', lang);
  // Truly flip direction: RTL for Urdu, LTR for English
  document.documentElement.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');

  // Sync all toggle buttons
  document.querySelectorAll('.lang-opt').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });

  // Swap text content based on data-en / data-ur
  document.querySelectorAll('[data-en], [data-ur]').forEach(el => {
    const val = el.dataset[lang];
    if (val !== undefined) el.textContent = val;
  });

  // Swap HTML blocks based on data-en-html / data-ur-html
  document.querySelectorAll('[data-ur-html], [data-en-html]').forEach(el => {
    const key = lang + 'Html';
    if (el.dataset[key]) {
      // Trusted content — authored by us, not user input
      el.innerHTML = el.dataset[key];
    }
  });

  // Swap placeholders on inputs / textareas
  document.querySelectorAll('[data-en-placeholder], [data-ur-placeholder]').forEach(el => {
    const val = el.dataset[lang + 'Placeholder'];
    if (val !== undefined) el.setAttribute('placeholder', val);
  });

  // Re-populate dynamic year span (may have been replaced by HTML swap)
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  try { localStorage.setItem('tg-lang', lang); } catch(e) {}
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.lang-opt');
  if (!btn) return;
  setLang(btn.dataset.lang);
});

/* On load — capture original English HTML for any [data-en-html] elements */
document.querySelectorAll('[data-en-html]').forEach(el => {
  if (!el.dataset.enHtml) el.dataset.enHtml = el.innerHTML;
});

/* Restore preferred language */
try {
  const saved = localStorage.getItem('tg-lang');
  if (saved === 'ur') setLang('ur');
} catch(e) {}

/* ---------- Hero slideshow ---------- */
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-slide-nav .dot');
let currentSlide = 0;
function showSlide(i) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[i].classList.add('active');
  dots[i].classList.add('active');
  currentSlide = i;
}
dots.forEach(d => {
  d.addEventListener('click', () => {
    showSlide(parseInt(d.dataset.slide));
    resetSlideTimer();
  });
});
let slideTimer = setInterval(() => showSlide((currentSlide + 1) % slides.length), 6000);
function resetSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide((currentSlide + 1) % slides.length), 6000);
}

/* ---------- Gallery data ---------- */
const galleryData = [
  { src: '01.jpg', title: 'Grand Entrance',        cat: 'architecture',   size: 'wide' },
  { src: '04.jpg', title: 'Lined Boulevards',      cat: 'infrastructure', size: '' },
  { src: '08.jpg', title: 'Evening Walk',          cat: 'community',      size: 'tall' },
  { src: '02.jpg', title: 'Resident Sanctuary',    cat: 'architecture',   size: '' },
  { src: '05.jpg', title: 'Green Avenue',          cat: 'landscape',      size: '' },
  { src: '12.jpg', title: 'Block Gardens',         cat: 'landscape',      size: 'wide' },
  { src: '03.jpg', title: 'Signature Roads',       cat: 'infrastructure', size: '' },
  { src: '06.jpg', title: 'Community Park',        cat: 'landscape',      size: '' },
  { src: '09.jpg', title: 'Architectural Detail',  cat: 'architecture',   size: 'tall' },
  { src: '07.jpg', title: 'Tree-Lined Walks',      cat: 'landscape',      size: '' },
  { src: '10.jpg', title: 'Lighting Infrastructure', cat: 'infrastructure', size: '' },
  { src: '11.jpg', title: 'Peaceful Corners',      cat: 'community',      size: '' },
  { src: '13.jpg', title: 'Water Supply',          cat: 'infrastructure', size: '' },
  { src: '14.jpg', title: 'Wide Approach',         cat: 'architecture',   size: '' },
  { src: '15.jpg', title: 'Morning Serenity',      cat: 'landscape',      size: 'wide' },
  { src: '16.jpg', title: 'Residential Views',     cat: 'architecture',   size: '' },
  { src: '17.jpg', title: 'Walkways',              cat: 'community',      size: '' },
  { src: '18.jpg', title: 'Infrastructure',        cat: 'infrastructure', size: 'tall' },
  { src: '19.jpg', title: 'Community Life',        cat: 'community',      size: '' },
  { src: '20.jpg', title: 'Estate Views',          cat: 'architecture',   size: '' },
  { src: '21.jpg', title: 'Evening Light',         cat: 'landscape',      size: '' },
  { src: '22.jpg', title: 'Park Details',          cat: 'landscape',      size: '' },
  { src: '23.jpg', title: 'Streetscape',           cat: 'infrastructure', size: 'wide' },
  { src: '24.jpg', title: "Residents' Moments",    cat: 'community',      size: '' },
  { src: '25.jpg', title: 'Garden Pathways',       cat: 'landscape',      size: '' },
  { src: '26.jpg', title: 'Signature Corner',      cat: 'architecture',   size: 'tall' },
  { src: '27.jpg', title: 'Block Living',          cat: 'community',      size: '' },
  { src: '28.jpg', title: 'Urban Design',          cat: 'infrastructure', size: '' },
  { src: '29.jpg', title: 'Neighbourhood',         cat: 'community',      size: '' },
  { src: '30.jpg', title: 'Gardens',               cat: 'landscape',      size: '' },
  { src: '31.jpg', title: 'The View',              cat: 'architecture',   size: '' },
  { src: '32.jpg', title: 'Our Promise',           cat: 'community',      size: '' },
];

const galleryGrid = document.getElementById('galleryGrid');
let visibleCount = 12;
let currentFilter = 'all';

function buildGalleryItem(item, idx) {
  const div = document.createElement('div');
  div.className = `g-item ${item.size}`.trim();
  div.dataset.cat = item.cat;
  div.dataset.idx = idx;

  const img = document.createElement('img');
  img.src = `public/gallery/${item.src}`;
  img.alt = item.title;
  img.loading = 'lazy';

  const overlay = document.createElement('div');
  overlay.className = 'g-overlay';

  const meta = document.createElement('div');
  const cat = document.createElement('span');
  cat.textContent = item.cat;
  const title = document.createElement('strong');
  title.textContent = item.title;
  meta.appendChild(cat);
  meta.appendChild(title);

  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-expand';

  overlay.appendChild(meta);
  overlay.appendChild(icon);

  div.appendChild(img);
  div.appendChild(overlay);

  div.addEventListener('click', () => openLightbox(idx));
  return div;
}

function renderGallery() {
  galleryGrid.textContent = '';
  galleryData.slice(0, visibleCount).forEach((item, idx) => {
    galleryGrid.appendChild(buildGalleryItem(item, idx));
  });
  applyFilter(currentFilter);
  if (typeof revealObserver !== 'undefined' && revealObserver) {
    document.querySelectorAll('.g-item').forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }
}

function applyFilter(cat) {
  currentFilter = cat;
  document.querySelectorAll('.g-item').forEach(el => {
    if (cat === 'all' || el.dataset.cat === cat) el.classList.remove('hide');
    else el.classList.add('hide');
  });
}

document.querySelectorAll('.gf').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gf').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});

document.getElementById('loadMore').addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const span = btn.querySelector('span');
  const icon = btn.querySelector('i');
  if (visibleCount >= galleryData.length) {
    visibleCount = 12;
    span.textContent = 'Reveal More Moments';
    icon.className = 'fa-solid fa-plus';
  } else {
    visibleCount = galleryData.length;
    span.textContent = 'Show Less';
    icon.className = 'fa-solid fa-minus';
  }
  renderGallery();
  const gSection = document.getElementById('gallery');
  window.scrollTo({ top: gSection.offsetTop - 80, behavior: 'smooth' });
});

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
let lbIndex = 0;

function openLightbox(idx) {
  lbIndex = idx;
  updateLb();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
function updateLb() {
  const item = galleryData[lbIndex];
  lbImg.src = `public/gallery/${item.src}`;
  lbCaption.textContent = `${item.title}  ·  ${String(lbIndex + 1).padStart(2, '0')} / ${galleryData.length}`;
}
document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => {
  lbIndex = (lbIndex - 1 + galleryData.length) % galleryData.length;
  updateLb();
});
document.getElementById('lbNext').addEventListener('click', () => {
  lbIndex = (lbIndex + 1) % galleryData.length;
  updateLb();
});
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
  if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
});

/* ---------- Counter animation ---------- */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 2200;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- Reveal on scroll ---------- */
const revealTargets = [
  '.story-copy', '.story-media',
  '.life-card',
  '.amenity',
  '.map-card',
  '.mp-live',
  '.testi',
  '.leader',
  '.section-head',
  '.cta-content',
  '.contact-info', '.contact-form'
];
revealTargets.forEach(sel => document.querySelectorAll(sel).forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('delay-1');
  if (i % 3 === 2) el.classList.add('delay-2');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Initial gallery render */
renderGallery();

/* ---------- Counter trigger ---------- */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.counter .num').forEach(el => counterObserver.observe(el));

/* ---------- Back to top ---------- */
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Contact form ---------- */
function handleSubmit(form) {
  const success = form.querySelector('#formSuccess');
  success.classList.add('show');
  setTimeout(() => {
    form.reset();
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 300);
}

/* ---------- Parallax gentle movement on hero slides ---------- */
let rafId;
window.addEventListener('scroll', () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    const sc = window.scrollY;
    if (sc < window.innerHeight) {
      const active = document.querySelector('.hero-slide.active');
      if (active) active.style.transform = `scale(${1 + sc * 0.0004}) translateY(${sc * 0.15}px)`;
    }
    rafId = null;
  });
});
