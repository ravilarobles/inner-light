/* ============================================
   INNER LIGHT — GSAP Animations & Interactions
============================================ */

(function () {

  /* ---- Loader ---- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      document.getElementById('navbar').classList.add('visible');
      revealWords();
    }, 1200);
  });

  /* ---- Word Reveal ---- */
  function revealWords() {
    const words = document.querySelectorAll('.word');
    words.forEach((word) => {
      const delay = parseFloat(word.dataset.delay || 0) + 0.2;
      setTimeout(() => {
        word.classList.add('visible');
      }, delay * 1000);
    });
  }

  /* ---- 3D Tilt on Mouse ---- */
  const heroContent = document.querySelector('.hero-content');

  document.addEventListener('mousemove', (e) => {
    if (!heroContent) return;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    const rotateX = -dy * 6;
    const rotateY =  dx * 6;

    heroContent.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(10px)
    `;
  });

  document.addEventListener('mouseleave', () => {
    if (!heroContent) return;
    heroContent.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });

  /* ---- Touch tilt for mobile ---- */
  document.addEventListener('touchmove', (e) => {
    if (!heroContent) return;
    const touch = e.touches[0];
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (touch.clientX - cx) / cx;
    const dy = (touch.clientY - cy) / cy;

    heroContent.style.transform = `
      perspective(1000px)
      rotateX(${-dy * 4}deg)
      rotateY(${dx * 4}deg)
    `;
  }, { passive: true });

  /* ---- Ambient glow pulse on message words ---- */
  const goldWord = document.querySelector('.gold-word');
  if (goldWord) {
    setInterval(() => {
      goldWord.style.textShadow = `0 0 ${40 + Math.sin(Date.now() / 800) * 20}px rgba(232,201,126,0.4)`;
    }, 50);
  }

  const greenWord = document.querySelector('.green-word');
  if (greenWord) {
    setInterval(() => {
      greenWord.style.textShadow = `0 0 ${30 + Math.sin(Date.now() / 1000 + 1) * 15}px rgba(82,183,136,0.3)`;
    }, 50);
  }

})();
