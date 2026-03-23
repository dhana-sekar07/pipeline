/* ═══════════════════════════════════════════════════════
   STICKY HEADER — shows after scrolling past main nav
═══════════════════════════════════════════════════════ */
const stickyHeader = document.getElementById('sticky-header');
const mainNav      = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  const threshold = mainNav.offsetTop + mainNav.offsetHeight + 40;
  if (window.scrollY > threshold) {
    stickyHeader.classList.add('visible');
  } else {
    stickyHeader.classList.remove('visible');
  }
}, { passive: true });


/* ═══════════════════════════════════════════════════════
   SMOOTH SCROLL HELPER
═══════════════════════════════════════════════════════ */
function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = stickyHeader.offsetHeight + 16;
  window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) { e.preventDefault(); smoothScrollTo(id); }
  });
});


/* ═══════════════════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════════════════ */
function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const burger = document.getElementById('hamburger');
  menu.classList.toggle('open');
  burger.classList.toggle('open');
}


// product image cursol
const slides = [
  'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', 
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
];
const AUTO_DELAY = 3000; // 3 seconds

let currentSlide  = 0;
let autoTimer     = null;
let progressTimer = null;
let progressStart = null;

const mainImg        = document.getElementById('mainImg');
const slideCurrentEl = document.getElementById('slideCurrentNum');
const slideTotalEl   = document.getElementById('slideTotalNum');
const progressBar    = document.getElementById('slideProgressBar');

// Set total count
slideTotalEl.textContent = slides.length;

/* ── Core update function ── */
function updateCarousel() {
  // Fade out → swap src → fade in
  mainImg.style.opacity = '0';
  setTimeout(() => {
    mainImg.src           = slides[currentSlide];
    mainImg.style.opacity = '1';
  }, 220);

  // Update counter
  slideCurrentEl.textContent = currentSlide + 1;

  // Update thumbs
  document.querySelectorAll('.carousel-thumbs img').forEach((t, i) => {
    t.classList.toggle('active', i === currentSlide);
  });

  // Update dots
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

/* ── Progress bar animation ── */
function startProgressBar() {
  // Reset bar
  progressBar.style.transition = 'none';
  progressBar.style.width      = '0%';

  // Force reflow so transition reset takes effect
  void progressBar.offsetWidth;

  // Animate to 100% over AUTO_DELAY ms
  progressBar.style.transition = `width ${AUTO_DELAY}ms linear`;
  progressBar.style.width      = '100%';
}

/* ── Start auto-play ── */
function startAutoPlay() {
  stopAutoPlay(); // clear any existing
  startProgressBar();
  autoTimer = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
    startProgressBar();
  }, AUTO_DELAY);
}

/* ── Stop auto-play ── */
function stopAutoPlay() {
  clearInterval(autoTimer);
  autoTimer = null;
}

/* ── Manual navigation (also resets timer) ── */
function goToSlide(idx) {
  currentSlide = (idx + slides.length) % slides.length;
  updateCarousel();
  startAutoPlay(); // restart timer from 0
}

/* ── Arrow buttons ── */
document.getElementById('prevBtn').addEventListener('click', e => {
  e.stopPropagation();
  goToSlide(currentSlide - 1);
});

document.getElementById('nextBtn').addEventListener('click', e => {
  e.stopPropagation();
  goToSlide(currentSlide + 1);
});

/* ── Thumbnail clicks ── */
function setSlide(idx) {
  goToSlide(idx);
}

/* ── Build dot indicators dynamically ── */
const dotsContainer = document.createElement('div');
dotsContainer.className = 'carousel-dots';
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});
// Insert dots between main image and thumbs
const carouselWrap = document.querySelector('.carousel-wrap');
const thumbsEl     = document.getElementById('thumbs');
carouselWrap.insertBefore(dotsContainer, thumbsEl);

/* ── Pause on hover, resume on leave ── */
const carouselMain = document.getElementById('carouselMain');
carouselMain.addEventListener('mouseenter', () => {
  stopAutoPlay();
  // Pause progress bar visually
  progressBar.style.transition = 'none';
});
carouselMain.addEventListener('mouseleave', () => {
  startAutoPlay();
});

/* ── Keyboard navigation ── */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  goToSlide(currentSlide - 1);
  if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
});

/* ── Touch / swipe support ── */
let touchStartX = 0;
carouselMain.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
carouselMain.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  }
}, { passive: true });

/* ── Kick off auto-play on page load ── */
startAutoPlay();


/* ═══════════════════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════════════════ */
function toggleFaq(btn) {
  const item   = btn.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}


/* ═══════════════════════════════════════════════════════
   APPLICATIONS CAROUSEL
═══════════════════════════════════════════════════════ */
let appsPos = 0;

function getVisibleApps() {
  return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
}

document.getElementById('appsLeft').addEventListener('click', () => appsSlide(-1));
document.getElementById('appsRight').addEventListener('click', () => appsSlide(1));

function appsSlide(dir) {
  const track  = document.getElementById('appsTrack');
  const cards  = track.querySelectorAll('.app-card');
  const cardW  = cards[0].offsetWidth + 20;
  const maxPos = Math.max(0, cards.length - getVisibleApps());
  appsPos = Math.max(0, Math.min(maxPos, appsPos + dir));
  track.style.transform = `translateX(-${appsPos * cardW}px)`;
}

window.addEventListener('resize', () => {
  appsPos = 0;
  document.getElementById('appsTrack').style.transform = 'translateX(0)';
}, { passive: true });


/* ═══════════════════════════════════════════════════════
   PROCESS TABS
═══════════════════════════════════════════════════════ */
const processData = [
  { title: 'High-Grade Raw Material Selection',   desc: 'PE100 grade virgin resin is carefully selected for optimal melt flow index and molecular weight distribution, ensuring maximum pipe performance.',   bullets: ['PE100 grade virgin resin', 'Optimal molecular weight distribution', 'UV stabilizer added for outdoor use'],   img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=700&q=80' },
  { title: 'Precision Extrusion Process',          desc: 'Advanced single-screw extruder with precise temperature control zones ensures homogeneous melt and consistent pipe wall thickness.',              bullets: ['Precise barrel temperature zones', 'Consistent melt pressure control', 'High-output screw design'],                 img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80' },
  { title: 'Controlled Cooling System',            desc: 'Multi-stage spray and immersion cooling stabilizes pipe dimensions while forming an optimal crystalline microstructure.',                         bullets: ['Vacuum calibration sleeve', 'Multi-zone spray cooling', 'Temperature gradient management'],                        img: 'https://images.unsplash.com/photo-1565636249-aefe4e0ade93?w=700&q=80' },
  { title: 'Precision Sizing & Calibration',       desc: 'Vacuum sizing tanks ensure exact outer diameter and wall thickness tolerance to within ±0.1mm across the full pipe length.',                    bullets: ['±0.1mm OD tolerance', 'Automated haul-off speed control', 'Real-time wall thickness monitoring'],                   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80' },
  { title: 'Rigorous Quality Control',             desc: 'Every pipe undergoes 100% hydrostatic pressure testing, dimensional inspection, and surface quality checks before leaving the line.',            bullets: ['100% hydrostatic testing', 'Dimensional laser scanning', 'Material certification per batch'],                       img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=700&q=80' },
  { title: 'Automated Marking & Coding',           desc: 'High-resolution inkjet systems apply permanent product data, certification marks, and full traceability codes along the pipe length.',            bullets: ['Permanent UV-resistant ink', 'Full certification markings', 'Batch traceability QR codes'],                          img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=700&q=80' },
  { title: 'Precision Cutting',                    desc: 'CNC planetary cutting saws deliver clean, square, burr-free cuts to exact lengths with automatic chamfering for easy joint assembly.',           bullets: ['CNC-controlled cut length', 'Automatic deburring & chamfering', 'Minimal material waste'],                          img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80' },
  { title: 'Protective Packaging',                 desc: 'Pipes are bundled, stretch-wrapped, and palletized with protective end caps and stacking labels ensuring zero damage in transit.',               bullets: ['UV-protective stretch wrap', 'End cap protection on every pipe', 'Pallet stacking load labels'],                    img: 'https://images.unsplash.com/photo-1565636249-aefe4e0ade93?w=700&q=80' },
];

function setProcess(idx, el) {
  document.querySelectorAll('.process-step').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const d   = processData[idx];
  const img = document.getElementById('processImg');
  document.getElementById('processTitle').textContent = d.title;
  document.getElementById('processDesc').textContent  = d.desc;
  document.getElementById('processBullets').innerHTML = d.bullets.map(b => `<li>${b}</li>`).join('');
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.3s ease';
  setTimeout(() => { img.src = d.img; img.style.opacity = '1'; }, 200);
}