// This file is shared by every page (index.html, graphics-design.html, arts.html).
// Each page defines its own `const PHOTOS = [...]` in a small inline <script>
// placed BEFORE this file, so the gallery/slideshow logic below stays identical
// everywhere and only the picture set changes per page.

// ---- Build the gallery ----
const track = document.getElementById('galleryTrack');
PHOTOS.forEach((photo, i) => {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.style.setProperty('--g1', photo.g1);
  item.style.setProperty('--g2', photo.g2);
  item.innerHTML = `<span>${photo.label}</span>`;
  item.addEventListener('click', () => openLightbox(i));
  track.appendChild(item);
});

// (single full-screen gallery — no scroll-position or hint logic needed)

// ---- Slideshow lightbox (image only — no visible controls) ----
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
let current = 0;
let isZoomed = false;
let autoplayTimer = null;
const AUTOPLAY_MS = 3000;

function render() {
  const photo = PHOTOS[current];
  lbImage.style.background = `linear-gradient(160deg, ${photo.g1}, ${photo.g2})`;
}

function next() { current = (current + 1) % PHOTOS.length; render(); }
function prev() { current = (current - 1 + PHOTOS.length) % PHOTOS.length; render(); }

function startAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(next, AUTOPLAY_MS);
}
function stopAutoplay() { clearInterval(autoplayTimer); }

function openLightbox(index) {
  current = index;
  isZoomed = false;
  lbImage.classList.remove('zoomed');
  render();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  startAutoplay();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  isZoomed = false;
  lbImage.classList.remove('zoomed');
  stopAutoplay();
}

// Click the picture: toggle full-screen zoom. Autoplay pauses while zoomed
// so the photo doesn't change mid-inspection, and resumes once zoomed out.
lbImage.addEventListener('click', (e) => {
  e.stopPropagation();
  isZoomed = !isZoomed;
  lbImage.classList.toggle('zoomed', isZoomed);
  if (isZoomed) stopAutoplay(); else startAutoplay();
});

// Click the dark backdrop (outside the picture) to close.
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') { next(); if (!isZoomed) startAutoplay(); }
  if (e.key === 'ArrowLeft') { prev(); if (!isZoomed) startAutoplay(); }
});
