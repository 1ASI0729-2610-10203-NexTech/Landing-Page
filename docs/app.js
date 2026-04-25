/* ═══════════════════════════════════════════════
   BIOTRACK — main.js
   NexTech · UPC · Aplicaciones Web 2026-01
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. NAVBAR: scroll state & hamburger ─── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const navCta    = document.querySelector('.nav-cta');

  // Scroll → añade clase .scrolled al navbar
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateScrollTop();
  }, { passive: true });

  // Hamburger toggle (mobile)
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', open);
    navCta  && navCta.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Cierra el menú al hacer clic en un enlace de nav
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      navCta && navCta.classList.remove('open');
    });
  });

  /* ─── 2. REVEAL ON SCROLL (IntersectionObserver) ─── */
  const revealItems = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(el => observer.observe(el));
  } else {
    // Fallback: muestra todo
    revealItems.forEach(el => el.classList.add('revealed'));
  }

  /* ─── 3. SEGMENT TABS ─── */
  const segBtns   = document.querySelectorAll('.seg-btn');
  const segPanels = document.querySelectorAll('.seg-panel');

  segBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.seg;

      // Botones
      segBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Paneles
      segPanels.forEach(p => {
        p.classList.toggle('active', p.id === `seg-${target}`);
      });
    });
  });

  /* ─── 4. PRICING TOGGLE (mensual / anual) ─── */
  const billingToggle = document.getElementById('billing-toggle');
  const priceNums     = document.querySelectorAll('.price-num');
  const lblMonthly    = document.getElementById('lbl-monthly');
  const lblAnnual     = document.getElementById('lbl-annual');

  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isAnnual = billingToggle.checked;

      priceNums.forEach(el => {
        const monthly = parseFloat(el.dataset.monthly);
        const annual  = parseFloat(el.dataset.annual);
        const val     = isAnnual ? annual : monthly;

        // Animación de cambio
        el.style.opacity = '0';
        el.style.transform = 'translateY(-6px)';
        setTimeout(() => {
          el.textContent = Number.isInteger(val) ? val : val.toFixed(2);
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 160);
      });

      // Resaltar etiqueta activa
      if (lblMonthly && lblAnnual) {
        lblMonthly.style.color = isAnnual ? '' : 'var(--gray-dark)';
        lblAnnual.style.color  = isAnnual ? 'var(--gray-dark)' : '';
      }
    });

    // Transición suave para los números
    priceNums.forEach(el => {
      el.style.transition = 'opacity .16s ease, transform .16s ease';
    });
  }

  /* ─── 5. COUNTER ANIMATION (stats) ─── */
  const counters = document.querySelectorAll('.stat-num[data-count]');

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentLang = localStorage.getItem('biotrack-lang') || 'es';
      const locale = currentLang === 'es' ? 'es-PE' : 'en-US';
      el.textContent = Math.floor(eased * target).toLocaleString(locale);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString(locale);
    }
    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => statsObserver.observe(el));
  } else {
    counters.forEach(el => {
      el.textContent = parseInt(el.dataset.count, 10).toLocaleString('es-PE');
    });
  }

  /* ─── 6. SCROLL TO TOP ─── */
  const scrollTopBtn = document.getElementById('scrollTop');

  function updateScrollTop() {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── 7. SMOOTH SCROLL para anclas internas ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // altura del navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── 8. ACTIVE NAV LINK en scroll (highlight) ─── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNav() {
    const scrollY = window.scrollY + 90;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${section.id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ─── init ───
  updateScrollTop();
  highlightNav();

})();