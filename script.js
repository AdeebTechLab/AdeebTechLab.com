// Adeeb Technology Lab — Link Page
// Small, dependency-free progressive enhancement: typing tagline,
// scroll-reveal for project cards, and an auto-updating footer year.

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Light / dark theme toggle ------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('atl-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('atl-theme', 'light');
      }
    });
  }

  // ---- Footer year --------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---- Rotating role tagline ----------------------------------------------
  const roles = [
    'Office Work',
    'Graphic Designer',
    'Video Editing',
    'Home Architecture',
    'Social Media Management',
    'Development',
    'Digital Marketing',
    'Cyber Security',
    'E-Commerce',
    'Computer Courses',
    'IoT Projects',
    'Freelancing',
    'Software Projects',
  ];
  const typedEl = document.getElementById('roleTyped');

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = roles.join(' · ');
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const TYPE_SPEED = 55;
      const DELETE_SPEED = 30;
      const HOLD_TIME = 1400;

      const tick = () => {
        const current = roles[roleIndex];

        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);

          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, HOLD_TIME);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);

          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(tick, 250);
            return;
          }
          setTimeout(tick, DELETE_SPEED);
        }
      };

      tick();
    }
  }

  // ---- Scroll-reveal for project cards -------------------------------------
  const cards = document.querySelectorAll('.card.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    cards.forEach((card) => card.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-visible'), i * 70);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    cards.forEach((card) => observer.observe(card));
  }

  // ---- Draw the ambient circuit trace(s) on load ---------------------------
  const tracePaths = [
    document.getElementById('trace-path'),
    document.getElementById('trace-path-2'),
  ].filter(Boolean);

  if (tracePaths.length && !prefersReducedMotion) {
    tracePaths.forEach((tracePath) => {
      const length = tracePath.getTotalLength();
      tracePath.style.strokeDasharray = String(length);
      tracePath.style.strokeDashoffset = String(length);
      tracePath.getBoundingClientRect(); // force reflow before transition
      tracePath.style.transition = 'stroke-dashoffset 2.4s ease';
      requestAnimationFrame(() => {
        tracePath.style.strokeDashoffset = '0';
      });
    });
  }

  // ---- Scroll progress bar ---------------------------------------------
  const progressBar = document.getElementById('scrollProgress');

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = percent + '%';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Subtle 3D tilt on project cards --------------------------------------
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach((card) => {
      const MAX_TILT = 6;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--rx', (px * MAX_TILT * 2).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (py * -MAX_TILT * 2).toFixed(2) + 'deg');
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }
});
