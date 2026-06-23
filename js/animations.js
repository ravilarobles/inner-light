/* ============================================
   INNER LIGHT — Animations, Music, Interactions
============================================ */
(function () {

  /* ---- Loader ---- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      document.getElementById('navbar').classList.add('visible');
      revealWords();
      startShootingStars();
    }, 1800);
  });

  /* ---- Word Reveal ---- */
  function revealWords() {
    document.querySelectorAll('.word').forEach((word) => {
      const delay = parseFloat(word.dataset.delay || 0) * 1000;
      setTimeout(() => word.classList.add('visible'), delay);
    });
  }

  /* ---- 3D Tilt on Mouse ---- */
  const heroContent = document.getElementById('heroContent');

  document.addEventListener('mousemove', (e) => {
    if (!heroContent) return;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    // Parallax layers
    document.querySelectorAll('.layer-1').forEach(el => {
      el.style.transform = `translateY(0) translateZ(0px) translate(${dx * -6}px, ${dy * -6}px)`;
    });
    document.querySelectorAll('.layer-2').forEach(el => {
      el.style.transform = `translateY(0) translateZ(20px) translate(${dx * -12}px, ${dy * -10}px)`;
    });
    document.querySelectorAll('.layer-3').forEach(el => {
      el.style.transform = `translateY(0) translateZ(40px) translate(${dx * -18}px, ${dy * -14}px)`;
    });

    heroContent.style.transform = `
      perspective(1200px)
      rotateX(${-dy * 5}deg)
      rotateY(${dx * 5}deg)
    `;
  });

  document.addEventListener('mouseleave', () => {
    if (!heroContent) return;
    heroContent.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    ['layer-1','layer-2','layer-3'].forEach(cls => {
      document.querySelectorAll('.' + cls).forEach(el => {
        el.style.transform = '';
      });
    });
  });

  /* ---- Touch tilt ---- */
  document.addEventListener('touchmove', (e) => {
    if (!heroContent) return;
    const t = e.touches[0];
    const dx = (t.clientX / window.innerWidth  - 0.5) * 2;
    const dy = (t.clientY / window.innerHeight - 0.5) * 2;
    heroContent.style.transform = `perspective(1200px) rotateX(${-dy*4}deg) rotateY(${dx*4}deg)`;
  }, { passive: true });

  /* ---- Glow pulse ---- */
  const goldWord  = document.querySelector('.gold-word');
  const greenWord = document.querySelector('.green-word');

  setInterval(() => {
    const t = Date.now();
    if (goldWord)
      goldWord.style.textShadow = `0 0 ${40 + Math.sin(t/700)*20}px rgba(232,201,126,0.5), 0 0 80px rgba(232,201,126,0.2)`;
    if (greenWord)
      greenWord.style.textShadow = `0 0 ${30 + Math.sin(t/900+1)*15}px rgba(82,183,136,0.5), 0 0 60px rgba(82,183,136,0.2)`;
  }, 40);

  /* ---- Click Constellation Burst ---- */
  const burstContainer = document.getElementById('burst-container');
  const burstColors = ['#52b788','#e8c97e','#9b72cf','#95d5b2','#f0ede6','#c9a84c'];

  document.addEventListener('click', (e) => {
    for (let i = 0; i < 14; i++) {
      const star = document.createElement('div');
      star.className = 'burst-star';
      const size  = Math.random() * 5 + 2;
      const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.5;
      const dist  = 40 + Math.random() * 80;
      const color = burstColors[Math.floor(Math.random() * burstColors.length)];

      star.style.cssText = `
        left: ${e.clientX}px;
        top:  ${e.clientY}px;
        width:  ${size}px;
        height: ${size}px;
        background: ${color};
        box-shadow: 0 0 ${size*3}px ${color};
        --dx: ${Math.cos(angle)*dist}px;
        --dy: ${Math.sin(angle)*dist}px;
        animation-duration: ${0.5 + Math.random()*0.4}s;
      `;
      burstContainer.appendChild(star);
      setTimeout(() => star.remove(), 900);
    }
  });

  /* ---- Shooting Stars ---- */
  function startShootingStars() {
    function shoot() {
      const el    = document.createElement('div');
      el.className = 'shooting-star';
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight * 0.5;
      const dist   = 200 + Math.random() * 300;
      const angle  = Math.PI * 0.2 + Math.random() * 0.3;
      const color  = ['#ffffff','#95d5b2','#e8c97e','#9b72cf'][Math.floor(Math.random()*4)];
      const dur    = 0.8 + Math.random() * 0.6;

      el.style.cssText = `
        left: ${startX}px; top: ${startY}px;
        background: ${color};
        box-shadow: 0 0 6px ${color}, 0 0 12px ${color};
        --sx: ${Math.cos(angle)*dist}px;
        --sy: ${Math.sin(angle)*dist}px;
        animation-duration: ${dur}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000 + 100);
      setTimeout(shoot, 2500 + Math.random() * 4000);
    }
    setTimeout(shoot, 3000);
  }

  /* ---- Music ---- */
  const music   = document.getElementById('bg-music');
  const btn     = document.getElementById('music-btn');
  const icon    = document.getElementById('music-icon');
  let playing   = false;

  music.volume  = 0.25;

  btn.addEventListener('click', () => {
    if (playing) {
      music.pause();
      icon.textContent = '🔇';
    } else {
      music.play().catch(() => {});
      icon.textContent = '🔊';
    }
    playing = !playing;
  });

  // Try autoplay after interaction
  document.addEventListener('click', () => {
    if (!playing) {
      music.play().then(() => {
        playing = true;
        icon.textContent = '🔊';
      }).catch(() => {});
    }
  }, { once: true });

})();