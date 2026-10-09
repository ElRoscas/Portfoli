(() => {
window.ELROCAS_PAGE_CLEANUP?.();
var elrocasPageController = new AbortController();
window.ELROCAS_PAGE_CLEANUP = () => elrocasPageController.abort();
var pageEvents = { signal: elrocasPageController.signal };
const slides = [...document.querySelectorAll(".game-slide")];
const dots = [...document.querySelectorAll(".story-dots button")];
const current = document.querySelector("#slide-current");
const progress = document.querySelector(".story-line span");
const carousel = document.querySelector(".game-carousel");
let activeIndex = 0;

if (!carousel || !slides.length || !current || !progress) {
  throw new Error("Game carousel markup is incomplete.");
}

function showSlide(index, fromSwipe = false) {
  activeIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("is-current", i === activeIndex));
  dots.forEach((dot, i) => dot.classList.toggle("is-current", i === activeIndex));
  current.textContent = String(activeIndex + 1).padStart(2, "0");
  progress.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
  if (fromSwipe) slides[activeIndex].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

document.querySelector(".prev").addEventListener("click", () => showSlide(activeIndex - 1), pageEvents);
document.querySelector(".next").addEventListener("click", () => showSlide(activeIndex + 1), pageEvents);
dots.forEach((dot) => dot.addEventListener("click", () => showSlide(Number(dot.dataset.go)), pageEvents));
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showSlide(activeIndex - 1);
  if (event.key === "ArrowRight") showSlide(activeIndex + 1);
}, pageEvents);

let startX = 0;
let dragging = false;
const startDrag = (event) => {
  dragging = true;
  startX = event.clientX ?? event.changedTouches?.[0]?.screenX ?? 0;
};
const endDrag = (event) => {
  if (!dragging) return;
  dragging = false;
  const endX = event.clientX ?? event.changedTouches?.[0]?.screenX ?? startX;
  const distance = endX - startX;
  if (Math.abs(distance) > 45) showSlide(activeIndex + (distance < 0 ? 1 : -1), true);
};
carousel.addEventListener("touchstart", startDrag, { passive: true, ...pageEvents });
carousel.addEventListener("touchend", endDrag, { passive: true, ...pageEvents });
carousel.addEventListener("pointerdown", startDrag, { passive: true, ...pageEvents });
carousel.addEventListener("pointerup", endDrag, { passive: true, ...pageEvents });
carousel.addEventListener("pointercancel", endDrag, { passive: true, ...pageEvents });

document.querySelector(".game-menu").addEventListener("click", (event) => {
  const open = document.querySelector(".games-header nav").classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
}, pageEvents);
document.querySelectorAll("[data-transition]").forEach((link) => {
  if (window.ELROCAS_SPA) return;
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank") return;
    event.preventDefault();
    const transition = document.querySelector(".page-transition");
    const label = transition.querySelector("span");
    const destination = link.dataset.transition;
    const copy = {
      home: ["01 / HOME", "DIGITAL PORTFOLIO"],
      games: ["02 / PLAY", "GAME SELECT"],
      web: ["03 / LINK", "WEB PROJECTS"]
    }[destination] || ["00 / FILE", "LOADING NEXT FILE"];
    transition.dataset.transition = destination;
    transition.style.setProperty("--transition-accent", destination === "games" ? "#146be8" : destination === "web" ? "#7928d8" : "#087ee8");
    label.dataset.code = copy[0];
    label.dataset.label = copy[1];
    window.playNebulaUiSound?.(link);
    transition.classList.add("is-active");
    window.setTimeout(() => { window.location.href = link.href; }, 760);
  });
});
showSlide(0);
})();
