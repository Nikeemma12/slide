// Build the gallery
const track = document.getElementById("galleryTrack");
PHOTOS.forEach((photo, i) => {
  const item = document.createElement("div");
  item.className = "gallery-item";
  item.style.setProperty("--g1", photo.g1);
  item.style.setProperty("--g2", photo.g2);
  item.innerHTML = `<span>${photo.label}</span>`;
  item.addEventListener("click", () => openLightbox(i));
  track.appendChild(item);
});

//  Slideshow lightbox (image only)
const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
let current = 0;
let isZoomed = false;
let autoplayTimer = null;
const AUTOPLAY_MS = 3000;

function render() {
  const photo = PHOTOS[current];
  lbImage.style.background = `linear-gradient(160deg, ${photo.g1}, ${photo.g2})`;
}

function next() {
  current = (current + 1) % PHOTOS.length;
  render();
}
function prev() {
  current = (current - 1 + PHOTOS.length) % PHOTOS.length;
  render();
}

function startAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(next, AUTOPLAY_MS);
}
function stopAutoplay() {
  clearInterval(autoplayTimer);
}

function openLightbox(index) {
  current = index;
  isZoomed = false;
  lbImage.classList.remove("zoomed");
  render();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  startAutoplay();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  isZoomed = false;
  lbImage.classList.remove("zoomed");
  stopAutoplay();
}

// Click the picture: toggle full-screen zoom. Autoplay pauses while zoomed
// so the photo doesn't change when zoomed in, and resumes once zoomed out.
let suppressClick = false;
lbImage.addEventListener("click", (e) => {
  e.stopPropagation();
  if (suppressClick) {
    suppressClick = false;
    return;
  }
  isZoomed = !isZoomed;
  lbImage.classList.toggle("zoomed", isZoomed);
  if (isZoomed) stopAutoplay();
  else startAutoplay();
});

// Swipe left/right on touch devices to move to the next/previous picture.
let touchStartX = 0,
  touchStartY = 0;
lbImage.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  },
  { passive: true },
);

lbImage.addEventListener(
  "touchend",
  (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
      if (!isZoomed) startAutoplay();
      suppressClick = true; // this was a swipe, not a tap — don't toggle zoom
    }
  },
  { passive: true },
);

// Click the dark backdrop (outside the picture) to close.
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") {
    next();
    if (!isZoomed) startAutoplay();
  }
  if (e.key === "ArrowLeft") {
    prev();
    if (!isZoomed) startAutoplay();
  }
});
