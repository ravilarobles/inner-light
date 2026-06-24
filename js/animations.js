/* ============================================
   INNER LIGHT — Animations v3
   Autoplay música + textos + 3D tilt
============================================ */
(function () {

  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      document.getElementById('navbar').classList.add('visible');
      revealWordsSequence();
      startShootingStars();
    }, 1800);
  });

  function revealWordsSequence() {
    const sequence = [
      { sel: '.w1', delay: 200,  shimmer: true  },
      { sel: '.w2', delay: 800,  shimmer: true  },
      { sel: '.w3', delay: 1500, shimmer: false },
      { sel: '.w4', delay: 2100, shimmer: true  },
      { sel: '.w5', delay: 2800, shimmer: false },
      { sel: '.w6', delay: 3100, shimmer: true  },
    ];
    sequence.forEach(({ sel, delay, shimmer }) => {
      setTimeout(() => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.classList.add('visible');
        if (shimmer) setTimeout(() => el.classList.add('shimmer'), 1000);
      }, delay);
    });
  }

  const heroContent = document.getElementById('heroContent');

  document.addEventListener('mousemove', (e) => {
    if (!heroContent) return;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    heroContent.style.transform = `
      perspective(1400px)
      rotateX(${-dy * 6}deg)
      rotateY(${dx * 6}deg)
    `;
    document.querySelectorAll('.word.visible').forEach((w, i) => {
      const depth = (i % 3 + 1) * 5;
      w.style.transform = `translate(${dx * -depth}px, ${dy * -depth}px) translateZ(0)`;
    });
  });

  document.addEventListener('mouseleave', () => {
    if (!heroContent) return;
    heroContent.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg)';
    document.querySelectorAll('.word.visible').forEach(w => { w.style.transform = ''; });
  });

  document.addEventListener('touchmove', (e) => {
    if (!heroContent) return;
    const t  = e.touches[0];
    const dx = (t.clientX/window.innerWidth  - 0.5)*2;
    const dy = (t.clientY/window.innerHeight - 0.5)*2;
    heroContent.style.transform = `perspective(1400px) rotateX(${-dy*4}deg) rotateY(${dx*4}deg)`;
  }, { passive:true });

  const goldWord  = document.querySelector('.gold-word');
  const greenWord = document.querySelector('.green-word');
  setInterval(() => {
    const t = Date.now();
    if (goldWord)
      goldWord.style.textShadow = `1px 1px 0 rgba(0,0,0,0.8),2px 2px 0 rgba(0,0,0,0.5),3px 3px 8px rgba(0,0,0,0.3),0 0 ${40+Math.sin(t/700)*20}px rgba(232,201,126,0.6),0 0 80px rgba(232,201,126,0.2)`;
    if (greenWord)
      greenWord.style.textShadow = `1px 1px 0 rgba(0,0,0,0.8),2px 2px 0 rgba(0,0,0,0.5),3px 3px 8px rgba(0,0,0,0.3),0 0 ${35+Math.sin(t/900+1)*18}px rgba(82,183,136,0.6),0 0 70px rgba(82,183,136,0.2)`;
  }, 40);

  const burstContainer = document.getElementById('burst-container');
  const burstColors = ['#52b788','#e8c97e','#9b72cf','#95d5b2','#f0ede6','#c9a84c','#ffffff'];

  document.addEventListener('click', (e) => {
    for (let i = 0; i < 16; i++) {
      const star  = document.createElement('div');
      star.className = 'burst-star';
      const size  = Math.random()*5+2;
      const angle = (i/16)*Math.PI*2 + Math.random()*0.4;
      const dist  = 50+Math.random()*100;
      const color = burstColors[Math.floor(Math.random()*burstColors.length)];
      star.style.cssText = `
        left:${e.clientX}px; top:${e.clientY}px;
        width:${size}px; height:${size}px;
        background:${color};
        box-shadow:0 0 ${size*3}px ${color};
        --dx:${Math.cos(angle)*dist}px;
        --dy:${Math.sin(angle)*dist}px;
        animation-duration:${0.5+Math.random()*0.5}s;
      `;
      burstContainer.appendChild(star);
      setTimeout(() => star.remove(), 1000);
    }
  });

  function startShootingStars() {
    function shoot() {
      const el = document.createElement('div');
      el.className = 'shooting-star';
      const startX = Math.random()*window.innerWidth;
      const startY = Math.random()*window.innerHeight*0.4;
      const dist   = 250+Math.random()*350;
      const angle  = Math.PI*0.2+Math.random()*0.25;
      const color  = ['#ffffff','#95d5b2','#e8c97e','#9b72cf'][Math.floor(Math.random()*4)];
      const dur    = 0.7+Math.random()*0.6;
      el.style.cssText = `
        left:${startX}px; top:${startY}px;
        background:${color};
        box-shadow:0 0 8px ${color}, 0 0 16px ${color};
        --sx:${Math.cos(angle)*dist}px;
        --sy:${Math.sin(angle)*dist}px;
        animation-duration:${dur}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), dur*1000+100);
      setTimeout(shoot, 2000+Math.random()*4000);
    }
    setTimeout(shoot, 3000);
  }

  /* ---- Música ---- */
  const music  = document.getElementById('bg-music');
  const btn    = document.getElementById('music-btn');
  const icon   = document.getElementById('music-icon');
  let playing  = false;

  music.volume = 0.3;

  // Arranca en el primer clic en cualquier parte
  document.addEventListener('click', () => {
    if (!playing) {
      music.play().then(() => {
        playing = true;
        icon.textContent = '🔊 Pausar música';
      }).catch(()=>{});
    }
  }, { once: true });

  // Botón para pausar/reanudar
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (playing) {
      music.pause();
      icon.textContent = '🎵 Activar música';
      playing = false;
    } else {
      music.play().catch(()=>{});
      icon.textContent = '🔊 Pausar música';
      playing = true;
    }
  });

})();