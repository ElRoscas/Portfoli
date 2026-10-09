(() => {
window.ELROCAS_PAGE_CLEANUP?.();
var elrocasPageController = new AbortController();
window.ELROCAS_PAGE_CLEANUP = () => elrocasPageController.abort();
var pageEvents = { signal: elrocasPageController.signal };
document.querySelector(".web-menu").addEventListener("click", (event) => {
  const open = document.querySelector(".web-header nav").classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
}, pageEvents);
})();
document.querySelectorAll("[data-transition]").forEach((link) => {
  if (window.ELROCAS_SPA) return;
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
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
