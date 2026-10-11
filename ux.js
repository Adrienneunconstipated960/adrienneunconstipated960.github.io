
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

  // No auto-scrolling on ordinary keyboard focus. Native links, summary
  // disclosure, dialog controls, and mobile menu keep their native behavior.
})();
