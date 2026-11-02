const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function initParallax() {
  const elements = [...document.querySelectorAll("[data-parallax]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!elements.length || reducedMotion.matches || !("IntersectionObserver" in window)) {
    return;
  }

  const finePointer = window.matchMedia("(pointer: fine)");
  const activeElements = new Set();
  const state = new Map(
    elements.map((element) => [element, { current: 0, target: 0 }]),
  );
  let frameId = 0;
  let resizeTimer = 0;
  let pageVisible = !document.hidden;
  let pointerX = 0;
  let pointerY = 0;

  const updateElement = (element, progress) => {
    const speed = Number.parseFloat(element.dataset.speed || "0");
    const axis = element.dataset.axis || "y";
    const scaleAmount = Number.parseFloat(element.dataset.scale || "0");
    const rotationAmount = Number.parseFloat(element.dataset.rotate || "0");
    const fadeAmount = Number.parseFloat(element.dataset.fade || "0");
    const intensity = window.innerWidth < 768 ? 0.4 : 1;
    const distance = progress * 100 * speed * intensity;
    const mouseEnabled = element.hasAttribute("data-mouse-parallax") && finePointer.matches;
    const mouseX = mouseEnabled ? pointerX * 14 * intensity : 0;
    const mouseY = mouseEnabled ? pointerY * 14 * intensity : 0;

    element.style.setProperty("--parallax-x", `${axis === "x" ? distance : 0}px`);
    element.style.setProperty("--parallax-y", `${axis === "y" ? distance : 0}px`);
    element.style.setProperty(
      "--parallax-scale",
      String(1 + progress * scaleAmount * intensity),
    );
    element.style.setProperty(
      "--parallax-rotate",
      `${progress * rotationAmount * intensity}deg`,
    );
    element.style.setProperty(
      "--parallax-opacity",
      String(clamp(1 - Math.max(0, progress) * fadeAmount, 0, 1)),
    );
    element.style.setProperty("--mouse-x", `${mouseX}px`);
    element.style.setProperty("--mouse-y", `${mouseY}px`);
  };

  const measure = () => {
    const viewportHeight = window.innerHeight || 1;
    for (const element of activeElements) {
      const bounds = element.getBoundingClientRect();
      const progress = (viewportHeight / 2 - (bounds.top + bounds.height / 2)) / viewportHeight;
      state.get(element).target = clamp(progress, -1.5, 1.5);
    }
  };

  const render = () => {
    frameId = 0;
    if (!pageVisible || reducedMotion.matches) return;

    let needsAnotherFrame = false;
    for (const element of activeElements) {
      const item = state.get(element);
      item.current += (item.target - item.current) * 0.1;
      if (Math.abs(item.target - item.current) > 0.001) needsAnotherFrame = true;
      updateElement(element, item.current);
    }

    if (needsAnotherFrame) frameId = requestAnimationFrame(render);
  };

  const schedule = () => {
    if (!pageVisible || frameId || reducedMotion.matches) return;
    measure();
    frameId = requestAnimationFrame(render);
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const element = entry.target;
      if (entry.isIntersecting) {
        activeElements.add(element);
        element.style.willChange = "transform, opacity";
      } else {
        activeElements.delete(element);
        element.style.willChange = "";
      }
    }
    schedule();
  }, { rootMargin: "160px 0px" });

  elements.forEach((element) => observer.observe(element));
  window.addEventListener("scroll", schedule, { passive: true });

  if (finePointer.matches) {
    document.querySelectorAll("[data-mouse-parallax]").forEach((element) => {
      const hero = element.closest(".hero");
      if (!hero) return;
      hero.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        const bounds = hero.getBoundingClientRect();
        pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
        pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
        schedule();
      }, { passive: true });
      hero.addEventListener("pointerleave", () => {
        pointerX = 0;
        pointerY = 0;
        schedule();
      }, { passive: true });
    });
  }

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(schedule, 120);
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    pageVisible = !document.hidden;
    if (!pageVisible && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    } else {
      schedule();
    }
  });

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      observer.disconnect();
      for (const element of elements) {
        element.style.willChange = "";
        element.style.removeProperty("--parallax-x");
        element.style.removeProperty("--parallax-y");
        element.style.removeProperty("--parallax-scale");
        element.style.removeProperty("--parallax-rotate");
        element.style.removeProperty("--parallax-opacity");
        element.style.removeProperty("--mouse-x");
        element.style.removeProperty("--mouse-y");
      }
      activeElements.clear();
    }
  });
}
