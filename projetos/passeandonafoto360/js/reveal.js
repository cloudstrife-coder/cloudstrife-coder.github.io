export function initReveal() {
  const elements = [...document.querySelectorAll(".reveal")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!elements.length || reducedMotion.matches) return;

  document.documentElement.classList.add("js-ready");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });

  elements.forEach((element) => observer.observe(element));
}
