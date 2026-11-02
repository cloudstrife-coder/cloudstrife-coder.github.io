export function initNavigation() {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  const progress = document.querySelector(".header-progress");
  if (!header || !menuButton || !navigation || !progress) return;

  let previousScrollY = window.scrollY;
  let ticking = false;

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    navigation.classList.remove("is-open");
  };

  const updateHeader = () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollRatio = maxScroll > 0 ? scrollY / maxScroll : 0;
    progress.style.transform = `scaleX(${scrollRatio})`;
    header.classList.toggle("is-scrolled", scrollY > 24);

    const movingDown = scrollY > previousScrollY;
    const focusInsideHeader = header.contains(document.activeElement);
    header.classList.toggle(
      "is-hidden",
      scrollY > 180 && movingDown && !focusInsideHeader && !navigation.classList.contains("is-open"),
    );

    previousScrollY = scrollY;
    ticking = false;
  };

  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });

  window.addEventListener("resize", closeMenu, { passive: true });
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHeader);
  }, { passive: true });

  updateHeader();
}
