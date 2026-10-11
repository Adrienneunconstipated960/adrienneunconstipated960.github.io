'use strict';

/* Reveals and visibility gating for subtle ambient details.
   Only IntersectionObserver is used; no scroll polling or DOM canvases. */
(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = [...document.querySelectorAll('[data-ambient-reveal]')];
  const scenes = [...document.querySelectorAll('.hero, section.section')]
    .filter(section => section.querySelector(':scope > .ambient-field'));

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

  // Share one visibility observer across every section. Only the section
  // currently on screen animates its starfield/orbit; the comet stays off when
  // the contact section isn't visible. This avoids unnecessary background work.
  const sceneObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle(
        'ambient-active',
        entry.isIntersecting && !motionPreference.matches
      );
    }
  }, { threshold: 0, rootMargin: '80px 0px 80px 0px' });
  scenes.forEach(scene => sceneObserver.observe(scene));

  const disableAnimation = event => {
    if (!event.matches) return;
    document.documentElement.classList.remove('ambient-ready');
    elements.forEach(element => element.classList.add('ambient-visible'));
    scenes.forEach(scene => scene.classList.remove('ambient-active'));
    revealObserver.disconnect();
    sceneObserver.disconnect();
  };
  motionPreference.addEventListener?.('change', disableAnimation);
})();
