
'use strict';
/* Small accessibility- and performance-minded navigation enhancements. */
(() => {
  const meter = document.getElementById('scroll-progress-fill');
  if (meter) {
    let queued = false;
    const measureProgress = () => {
      queued = false;
      const root = document.documentElement;
      const distance = Math.max(1, root.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / distance));
      meter.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    };
    const requestMeasure = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(measureProgress);
    };
    window.addEventListener('scroll', requestMeasure, { passive: true });
    window.addEventListener('resize', requestMeasure, { passive: true });
    window.addEventListener('load', requestMeasure, { once: true });
    requestMeasure();
  }

  // Make expandable project summaries discoverable to keyboard and assistive tech.
  const index = document.querySelector('.project-index');
  if (index) {
    const summary = index.querySelector(':scope > summary');
    index.addEventListener('toggle', () => {
      if (!summary) return;
      const hint = summary.querySelector('.project-index-caption');
      if (hint) hint.textContent = index.open
        ? 'Four detailed projects · select again to close'
        : 'Four additional projects · expand to browse';
    });
  }



  // Two low-key constellations draw themselves only when encountered.
  // Without IntersectionObserver, their complete lines stay visible.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const constellations = [...document.querySelectorAll('.constellation-break')];
  if (constellations.length && 'IntersectionObserver' in window && !reduce.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    constellations.forEach(node => observer.observe(node));
    document.documentElement.classList.add('space-reveal-ready');
    reduce.addEventListener?.('change', event => {
      if (event.matches) {
        observer.disconnect();
        document.documentElement.classList.remove('space-reveal-ready');
      }
    });
  }

  // The small star trail belongs to one deliberate action: moving between
  // collections. It does not follow the pointer or run continuously.
  document.querySelectorAll('[data-collection-target]').forEach(button => {
    let trailTimer = null;
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.collectionTarget);
      if (!target) return;
      if (trailTimer !== null) window.clearTimeout(trailTimer);
      button.classList.remove('is-traveling');
      if (!reduce.matches) {
        void button.offsetWidth;
        button.classList.add('is-traveling');
        trailTimer = window.setTimeout(() => {
          button.classList.remove('is-traveling');
          trailTimer = null;
        }, 900);
      }
      target.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'center' });
      const heading = target.querySelector('.shelf-label-row h3');
      if (heading) {
        heading.tabIndex = -1;
        window.setTimeout(() => heading.focus({ preventScroll: true }), reduce.matches ? 0 : 500);
      }
    });
  });

  // No auto-scrolling on ordinary keyboard focus. Native links, summary
  // disclosure, dialog controls, and mobile menu keep their native behavior.
})();
