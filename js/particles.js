/* ============================================
   INNER LIGHT — CSS Particle System
============================================ */

(function () {
  const container = document.getElementById('particles');
  const colors = ['#52b788', '#e8c97e', '#9b72cf', '#95d5b2', '#f0ede6'];
  const count = 28;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size   = Math.random() * 3 + 1;
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const left   = Math.random() * 100;
    const delay  = Math.random() * 12;
    const dur    = 10 + Math.random() * 14;
    const drift  = (Math.random() - 0.5) * 120 + 'px';

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      bottom: -10px;
      --drift: ${drift};
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      box-shadow: 0 0 ${size * 3}px ${color};
      opacity: 0;
    `;

    container.appendChild(p);
  }
})();
