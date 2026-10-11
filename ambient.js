'use strict';

/* Reveals and visibility gating for subtle ambient details.
   Only IntersectionObserver is used; no scroll polling or DOM canvases. */
(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = [...document.querySelectorAll('[data-ambient-reveal]')];
  const contact = document.querySelector('.contact-section');

  // Native rendering is the fallback on old browsers or for reduced motion.
  if (!('IntersectionObserver' in window) || motionPreference.matches) return;

  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('ambient-visible');
      revealObserver.unobserve(entry.target);
    }
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -7% 0px'
  });

  // Register targets before enabling the opacity transition. We only reveal
  // once, and do not affect keyboard focus or any page navigation.
  elements.forEach(element => revealObserver.observe(element));
  if (elements.length) document.documentElement.classList.add('ambient-ready');

  // Keep the occasional comet paused when its section is offscreen.
  let contactObserver = null;
  if (contact) {
    contactObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        contact.classList.toggle('ambient-active', entry.isIntersecting && !motionPreference.matches);
      }
    }, { threshold: 0.04 });
    contactObserver.observe(contact);
  }

  const disableAnimation = event => {
    if (!event.matches) return;
    document.documentElement.classList.remove('ambient-ready');
    elements.forEach(element => element.classList.add('ambient-visible'));
    contact?.classList.remove('ambient-active');
    revealObserver.disconnect();
    contactObserver?.disconnect();
  };
  motionPreference.addEventListener?.('change', disableAnimation);
})();
