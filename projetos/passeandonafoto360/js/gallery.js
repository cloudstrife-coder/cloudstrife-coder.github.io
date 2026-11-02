const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function initGallery() {
  const section = document.querySelector(".film-gallery");
  const track = section?.querySelector("[data-gallery-track]");
  const filmWindow = section?.querySelector(".film-window");
  const stickyPanel = section?.querySelector(".film-gallery-sticky");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!section || !track || !filmWindow || !stickyPanel) return;

  const supportsSticky = typeof CSS !== "undefined" && (
    CSS.supports("position", "sticky") ||
    CSS.supports("position", "-webkit-sticky")
  );
  let distance = 0;
  let frameId = 0;
  let resizeTimer = 0;
  let isActive = false;
  let dragState = null;

  const updatePosition = () => {
    frameId = 0;
    if (!isActive || !section.classList.contains("film-gallery-enhanced")) return;

    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const scrollDistance = section.offsetHeight - window.innerHeight;
    const progress = scrollDistance > 0
      ? clamp((window.scrollY - sectionTop) / scrollDistance, 0, 1)
      : 0;

    track.style.transform = `translate3d(${-distance * progress}px, 0, 0)`;
  };

  const scheduleUpdate = () => {
    if (!isActive || frameId) return;
    frameId = requestAnimationFrame(updatePosition);
  };

  const configure = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const wasEnhanced = section.classList.contains("film-gallery-enhanced");
      section.classList.remove("film-gallery-enhanced", "film-gallery-native");
      track.style.removeProperty("transform");
      section.style.removeProperty("--gallery-distance");
      section.style.removeProperty("--gallery-viewport-height");

      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const bodyCreatesScrollContainer = getComputedStyle(document.body).overflowY === "auto";
      const canPin = supportsSticky &&
        !bodyCreatesScrollContainer &&
        !reducedMotion.matches &&
        viewportWidth >= 768;

      if (!canPin) {
        section.classList.add("film-gallery-native");
        return;
      }

      distance = Math.max(0, track.scrollWidth - filmWindow.clientWidth);
      if (distance === 0) {
        section.classList.add("film-gallery-native");
        return;
      }

      if (!wasEnhanced) filmWindow.scrollLeft = 0;
      section.style.setProperty("--gallery-distance", `${distance}px`);
      section.style.setProperty("--gallery-viewport-height", `${window.innerHeight}px`);
      section.classList.add("film-gallery-enhanced");

      if (stickyPanel.scrollHeight > stickyPanel.clientHeight + 1) {
        section.classList.remove("film-gallery-enhanced");
        section.style.removeProperty("--gallery-distance");
        section.style.removeProperty("--gallery-viewport-height");
        section.classList.add("film-gallery-native");
        return;
      }

      scheduleUpdate();
    }, 100);
  };

  const scrollHorizontally = (event) => {
    if (section.classList.contains("film-gallery-enhanced")) return;

    const maxScroll = filmWindow.scrollWidth - filmWindow.clientWidth;
    if (maxScroll <= 0) return;

    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;
    const nextScroll = clamp(filmWindow.scrollLeft + delta, 0, maxScroll);
    if (nextScroll === filmWindow.scrollLeft) return;

    if (event.cancelable) event.preventDefault();
    filmWindow.scrollLeft = nextScroll;
  };

  const startDrag = (event) => {
    if (
      section.classList.contains("film-gallery-enhanced") ||
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      filmWindow.scrollWidth <= filmWindow.clientWidth
    ) return;

    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: filmWindow.scrollLeft,
    };
    filmWindow.classList.add("is-dragging");
    filmWindow.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const moveDrag = (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    filmWindow.scrollLeft = dragState.startScroll - (event.clientX - dragState.startX);
    event.preventDefault();
  };

  const endDrag = (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    dragState = null;
    filmWindow.classList.remove("is-dragging");
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", configure, { passive: true });
  filmWindow.addEventListener("wheel", scrollHorizontally, { passive: false });
  filmWindow.addEventListener("pointerdown", startDrag);
  filmWindow.addEventListener("pointermove", moveDrag);
  filmWindow.addEventListener("pointerup", endDrag);
  filmWindow.addEventListener("pointercancel", endDrag);
  filmWindow.addEventListener("lostpointercapture", endDrag);

  if ("addEventListener" in reducedMotion) {
    reducedMotion.addEventListener("change", configure);
  } else {
    reducedMotion.addListener(configure);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      isActive = entry.isIntersecting;
      section.classList.toggle("is-gallery-active", isActive);
      if (isActive) scheduleUpdate();
    }, { rootMargin: "100px 0px" });
    observer.observe(section);
  } else {
    isActive = true;
    section.classList.add("is-gallery-active");
  }

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(configure);
    observer.observe(track);
    observer.observe(filmWindow);
  }

  configure();
}
