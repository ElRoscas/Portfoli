const initContact = () => {
  const root = document.querySelector("#contact-root");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  root.innerHTML = `
    <div class="contact-backdrop" data-contact-close></div>
    <aside class="contact-drawer" aria-label="Opciones de contacto" aria-hidden="true">
      <div class="contact-drawer__top">
        <span class="contact-kicker">[ INCOMING TRANSMISSION ]</span>
        <button class="contact-close" type="button" data-contact-close aria-label="Cerrar contacto">×</button>
      </div>
      <div class="contact-title">
        <span>MAIL / TODAY</span>
        <h2 data-i18n-html="contact-title">New<br><em>message.</em></h2>
      </div>
      <p class="contact-intro">Elige un canal para iniciar la conversación con Sans.</p>
      <div class="contact-notifications">
        <a class="contact-notification is-selected" href="mailto:hola@smashground.studio">
          <span class="contact-notification__icon">✉</span>
          <span><small>GMAIL / DIRECT</small><strong>hola@smashground.studio</strong></span>
          <b>↗</b>
        </a>
        <a class="contact-notification" href="tel:+34600000000">
          <span class="contact-notification__icon">☎</span>
          <span><small>PHONE / REMOTE</small><strong>+34 600 000 000</strong></span>
          <b>↗</b>
        </a>
        <a class="contact-notification" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
          <span class="contact-notification__icon">◎</span>
          <span><small>SOCIAL / INSTAGRAM</small><strong>@smashground.studio</strong></span>
          <b>↗</b>
        </a>
        <div class="contact-notification contact-location">
          <span class="contact-notification__icon">!</span>
          <span><small>STATUS / LOCATION</small><strong>MADRID / REMOTE</strong></span>
          <b>●</b>
        </div>
      </div>
      <div class="contact-drawer__footer"><span>Sans</span><span>READY TO CONNECT</span></div>
    </aside>
  `;

  const drawer = root.querySelector(".contact-drawer");
  const open = () => {
    root.classList.add("is-open");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("contact-is-open");
    drawer.querySelector(".contact-close").focus();
  };
  const close = () => {
    root.classList.remove("is-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("contact-is-open");
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-contact-trigger]");
    if (trigger) {
      event.preventDefault();
      open();
    }
    if (event.target.closest("[data-contact-close]")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) close();
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContact, { once: true });
} else {
  initContact();
}
