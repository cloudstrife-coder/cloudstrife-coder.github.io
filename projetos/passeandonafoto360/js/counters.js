export function initCounters() {
  const counters = [...document.querySelectorAll("[data-counter]")];
  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const format = new Intl.NumberFormat("pt-BR");

  const showFinalValue = (element) => {
    const target = Number(element.dataset.counter);
    if (!Number.isFinite(target)) return;
    element.textContent = format.format(target);
  };

  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    counters.forEach(showFinalValue);
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const element = entry.target;
      const target = Number(element.dataset.counter);
      currentObserver.unobserve(element);
      if (!Number.isFinite(target)) continue;

      const duration = 1100;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        element.textContent = format.format(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, { threshold: 0.55 });

  counters.forEach((counter) => observer.observe(counter));
}
