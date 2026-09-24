/* Neo-brutalist portfolio interactions */

/* --- Matrix-style scramble on the hero greeting --- */
const matrixEl = document.querySelector('[data-matrix]');
if (matrixEl) {
  const words = ['HELLO_WORLD', 'HI_THERE', 'NAMASTE', 'HOLA', 'HALLO'];
  const glyphs = '!<>-_\\/[]{}—=+*^?#________';
  let running = false;

  function crack(el, targetWord) {
    let frame = 0;
    const total = 16;
    el.textContent = '';
    const tick = () => {
      const fraction = frame / total;
      const resolved = Math.floor(targetWord.length * fraction);
      let out = '';
      for (let i = 0; i < targetWord.length; i++) {
        if (i < resolved) out += targetWord[i];
        else if (i === resolved && fraction < 0.9) out += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      el.textContent = out;
      frame++;
      if (frame <= total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  let t = 0;
  running = setInterval(() => {
    crack(matrixEl, words[t % words.length]);
    t++;
  }, 2600);
  crack(matrixEl, words[0]);
}

/* --- Scroll-driven highlighter effect --- */
const highlights = document.querySelectorAll('[data-highlight]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('lit');
    });
  }, { threshold: 0.4 });
  highlights.forEach((h) => io.observe(h));
}

document.addEventListener('DOMContentLoaded', () => {
  /* --- Falling decorative icons near the hero --- */
  const hero = document.querySelector('.hero');
  if (hero) {
    const bits = ['◆', '✳', '●', '▲', '□', '✦', '◆', '✳', '●', '▲'];
    const colors = ['#ffd500', '#00e5ff', '#ff6b6b', '#7bed9f'];
    let dropped = false;

    const dropIcons = () => {
      if (dropped) return;
      dropped = true;
      const rect = hero.getBoundingClientRect();
      for (let i = 0; i < bits.length; i++) {
        const el = document.createElement('span');
        el.textContent = bits[i];
        el.style.cssText = `position:absolute;left:${12 + Math.random() * 76}%;top:${10 + Math.random() * 40}%;
          font-size:${18 + Math.random() * 14}px;color:${colors[i % colors.length]};
          opacity:.9;z-index:-1;pointer-events:none;transform:rotate(${Math.random() * 90}deg);`;
        hero.appendChild(el);
        el.animate(
          [
            { transform: `translateY(-40px) rotate(0deg)`, opacity: 0 },
            { transform: `translateY(6px) rotate(${Math.random() * 180}deg)`, opacity: 0.95, offset: 0.4 },
            { transform: `translateY(${rect.height}px) rotate(${Math.random() * 360}deg)`, opacity: 0 },
          ],
          { duration: 2600 + Math.random() * 1800, easing: 'cubic-bezier(.3,.7,.4,1)' }
        ).onfinish = () => el.remove();
      }
      setTimeout(() => { dropped = false; }, 6000);
    };

    window.addEventListener('scroll', () => {
      if (!dropped && window.scrollY > 120) dropIcons();
    }, { passive: true });
  }

  /* --- Custom hard-shadow cursor --- */
  const fx = document.querySelector('.cursor-fx');
  if (fx && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      fx.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });
  }

  /* --- Active nav underline on section scroll --- */
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [...links].map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => (l.style.textDecoration = 'none'));
        const match = [...links].find(
          (l) => l.getAttribute('href') === '#' + entry.target.id
        );
        if (match) match.style.textDecoration = 'underline wavy var(--pink)';
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* --- Glass-tap acknowledgement on mobile --- */
  const isTouch = 'ontouchstart' in window;
  document.querySelectorAll('.btn').forEach((b) => {
    if (isTouch) b.addEventListener('click', () => { b.style.transform = 'translate(8px,8px)'; }, { once: true });
  });
});