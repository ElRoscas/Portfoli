const initSkills = () => {
  const root = document.querySelector("#skills-root");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const skills = [
    { name: { en: "Frontend", es: "Frontend", ca: "Frontend" }, level: 9, color: "#a855f7" },
    { name: { en: "UI Design", es: "Diseño UI", ca: "Disseny UI" }, level: 8, color: "#c084fc" },
    { name: { en: "Game Dev", es: "Desarrollo de juegos", ca: "Desenvolupament de jocs" }, level: 7, color: "#7c3aed" },
    { name: { en: "Motion", es: "Motion", ca: "Motion" }, level: 6, color: "#d8b4fe" },
    { name: { en: "Branding", es: "Branding", ca: "Branding" }, level: 8, color: "#9333ea" },
    { name: { en: "3D Worlds", es: "Mundos 3D", ca: "Mons 3D" }, level: 5, color: "#6d28d9" }
  ];

  root.innerHTML = `
    <div class="skills-backdrop" data-skills-close></div>
    <aside class="skills-drawer" aria-label="Skills" aria-hidden="true">
      <div class="skills-drawer__top">
        <span class="skills-kicker">[ SKILL ARCHIVE ]</span>
        <button class="skills-close" type="button" data-skills-close aria-label="Cerrar skills">×</button>
      </div>
      <div class="skills-heading">
        <span>ELROCAS / LOADOUT</span>
        <h2 data-skills-title>Skills.</h2>
        <p data-skills-intro>Explora el nivel de cada habilidad del estudio.</p>
      </div>
      <div class="skills-orbit" data-skills-list></div>
      <div class="skills-drawer__footer"><span>0 / 10</span><span data-skills-count></span><span>SKILL STATUS</span></div>
    </aside>
  `;

  const list = root.querySelector("[data-skills-list]");
  const render = () => {
    const language = localStorage.getItem("nebula-language") || "en";
    list.innerHTML = skills.map((skill) => {
      const level = Math.max(0, Math.min(10, Number(skill.level) || 0));
      return `<article class="skill-orb" style="--skill-level:${level};--skill-color:${skill.color}" aria-label="${skill.name[language]} ${level} de 10">
        <div class="skill-orb__ring" aria-hidden="true"><span>${level}</span></div>
        <strong>${skill.name[language]}</strong>
        <small>LV ${level} / 10</small>
      </article>`;
    }).join("");
    root.querySelector("[data-skills-count]").textContent = `${skills.length} SKILLS`;
    const title = root.querySelector("[data-skills-title]");
    const intro = root.querySelector("[data-skills-intro]");
    title.textContent = { en: "Skills.", es: "Habilidades.", ca: "Habilitats." }[language];
    intro.textContent = {
      en: "Explore the level of every studio skill.",
      es: "Explora el nivel de cada habilidad del estudio.",
      ca: "Explora el nivell de cada habilitat de l'estudi."
    }[language];
  };
  render();

  const drawer = root.querySelector(".skills-drawer");
  const open = () => {
    render();
    root.classList.add("is-open");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("skills-is-open");
    drawer.querySelector(".skills-close").focus();
  };
  const close = () => {
    root.classList.remove("is-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("skills-is-open");
  };

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("[data-skills-trigger]")) {
      event.preventDefault();
      open();
    }
    if (target?.closest("[data-skills-close]")) close();
  }, true);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) close();
  });
  window.addEventListener("languagechange", render);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSkills, { once: true });
} else {
  initSkills();
}
