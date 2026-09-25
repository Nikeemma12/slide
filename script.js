// Land at the very bottom, which is the visual "start" of the site.
window.addEventListener('load', () => {
  document.getElementById('bottom-anchor').scrollIntoView({ block: 'end' });
});

// Fade the "scroll up" hint out once the visitor has moved away from the start.
const hint = document.querySelector('.hint');
window.addEventListener('scroll', () => {
  const distFromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
  hint.style.opacity = distFromBottom < 60 ? '0.8' : '0';
}, { passive: true });
