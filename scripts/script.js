(() => {
window.ELROCAS_PAGE_CLEANUP?.();
var elrocasPageController = new AbortController();
window.ELROCAS_PAGE_CLEANUP = () => elrocasPageController.abort();
var pageEvents = { signal: elrocasPageController.signal };
const nav = document.querySelector("#main-nav");
const menuToggle = document.querySelector(".menu-toggle");
const sections = document.querySelectorAll("main section[id]");
const transition = document.querySelector(".page-transition");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  }, pageEvents);

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }, pageEvents);
  });
}

if (nav && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      nav.querySelectorAll("a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
  elrocasPageController.signal.addEventListener("abort", () => sectionObserver.disconnect(), { once: true });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll(".filter").forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((button) => button.classList.remove("active"));
    filterButton.classList.add("active");
    const selected = filterButton.dataset.filter;
    document.querySelectorAll(".project").forEach((project) => {
      project.classList.toggle("is-hidden", selected !== "all" && project.dataset.category !== selected);
  }, pageEvents);
});
});

document.querySelectorAll("[data-transition]").forEach((link) => {
  if (window.ELROCAS_SPA) return;
  link.addEventListener("click", (event) => {
    if (!transition || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const destination = link.dataset.transition;
    const copy = {
      home: ["01 / HOME", "DIGITAL PORTFOLIO"],
      games: ["02 / PLAY", "GAME SELECT"],
      web: ["03 / LINK", "WEB PROJECTS"]
    }[destination] || ["00 / FILE", "LOADING NEXT FILE"];
    const label = transition.querySelector("span");
    transition.dataset.transition = destination;
    transition.style.setProperty("--transition-accent", destination === "games" ? "#146be8" : destination === "web" ? "#7928d8" : "#087ee8");
    if (label) {
      label.dataset.code = copy[0];
      label.dataset.label = copy[1];
    }
    window.playNebulaUiSound?.(link);
    transition.classList.add(`is-${link.dataset.transition}`);
    transition.classList.add("is-active");
    window.setTimeout(() => { window.location.href = link.href; }, 760);
  });
});
})();
