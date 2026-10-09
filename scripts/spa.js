(() => {
  window.ELROCAS_SPA = true;
  const transition = document.querySelector(".page-transition");
  const persistentSelectors = [".page-transition", "#site-music", ".music-control", ".sound-control", "#contact-root", "#skills-root"];
  let navigating = false;

  if (!transition) return;

  const transitionCopy = {
    home: ["01 / HOME", "DIGITAL PORTFOLIO", "#087ee8"],
    games: ["02 / PLAY", "GAME SELECT", "#146be8"],
    web: ["03 / LINK", "WEB PROJECTS", "#7928d8"]
  };

  const loadPageStyle = (page) => {
    document.querySelectorAll("[data-spa-style], link[href=\"styles/styles.css\"], link[href=\"styles/games.css\"], link[href=\"styles/web.css\"]").forEach((style) => style.remove());
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = pageAsset[page].style;
    style.dataset.spaStyle = page;
    document.head.append(style);
    const sharedContactStyle = document.querySelector('link[href="styles/contact.css"]');
    if (sharedContactStyle) document.head.append(sharedContactStyle);
    const sharedSkillsStyle = document.querySelector('link[href="styles/skills.css"]');
    if (sharedSkillsStyle) document.head.append(sharedSkillsStyle);
  };

  const runPageScripts = (page) => {
    document.querySelectorAll("[data-spa-page-script]").forEach((script) => script.remove());
    document.querySelectorAll('script[data-spa-page-script]').forEach((script) => script.remove());
    const scripts = [page === "home" ? "scripts/script.js" : `scripts/${page}.js`];
    scripts.forEach((source) => {
      const script = document.createElement("script");
      script.src = source;
      script.defer = false;
      script.dataset.spaPageScript = "true";
      document.body.append(script);
    });
    window.setupNebulaSoundControl?.();
  };

  const pageAsset = {
    home: { style: "styles/styles.css" },
    games: { style: "styles/games.css" },
    web: { style: "styles/web.css" }
  };

  const replacePage = async (url, destination) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`No se pudo cargar ${url}`);
    const markup = await response.text();
    const nextDocument = new DOMParser().parseFromString(markup, "text/html");
    const persistent = new Map(
      persistentSelectors.map((selector) => [selector, document.querySelector(selector)])
    );

    document.title = nextDocument.title;
    document.body.className = nextDocument.body.className;
    document.body.replaceChildren();
    persistent.forEach((element) => element && document.body.append(element));

    [...nextDocument.body.children]
      .filter((element) => !persistentSelectors.some((selector) => element.matches(selector)))
      .forEach((element) => document.body.append(document.importNode(element, true)));

    loadPageStyle(destination);
    runPageScripts(destination);
    history.pushState({ page: destination }, "", url);
  };

  document.addEventListener("click", async (event) => {
    const link = event.target.closest("a[data-transition]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || navigating) return;
    event.preventDefault();
    navigating = true;

    const destination = link.dataset.transition;
    const copy = transitionCopy[destination] || transitionCopy.home;
    const label = transition.querySelector("span");
    transition.style.setProperty("--transition-accent", copy[2]);
    if (label) {
      label.dataset.code = copy[0];
      label.dataset.label = copy[1];
    }
    window.playNebulaUiSound?.(link);
    transition.classList.remove("is-active");
    void transition.offsetWidth;
    transition.classList.add("is-active");

    try {
      await replacePage(link.href, destination);
      window.setTimeout(() => {
        transition.classList.remove("is-active");
        navigating = false;
      }, 1160);
    } catch (error) {
      console.error(error);
      transition.classList.remove("is-active");
      navigating = false;
      window.location.href = link.href;
    }
  });

  window.addEventListener("popstate", () => {
    window.location.reload();
  });
})();
