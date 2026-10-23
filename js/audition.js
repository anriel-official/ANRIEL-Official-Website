// AN:RIEL 1期生オーディション — navigation & accessible scroll reveals
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  if (toggle && menu) {
    const closeMenu = () => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
    };
    toggle.addEventListener('click', () => {
      const willOpen = menu.hidden;
      menu.hidden = !willOpen;
      toggle.setAttribute('aria-expanded', String(willOpen));
      toggle.setAttribute('aria-label', willOpen ? 'メニューを閉じる' : 'メニューを開く');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => {
      if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 850) closeMenu(); });
  }
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = document.querySelectorAll('.section-heading, .concept-grid, .values > div, .split-title, .member-panel, .underlined-link, .info-table > div, .flow h2, .flow-grid > div, .faq-item, .faq-contact, .entry-english, .entry h2, .entry-bottom, .socials a');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -20px 0px'});
  targets.forEach(element => {
    element.classList.add('reveal-on-scroll');
    observer.observe(element);
  });
  document.documentElement.classList.add('js-motion');
})();
