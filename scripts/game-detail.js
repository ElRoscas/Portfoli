(() => {
  const game = document.body.dataset.game;
  const content = {
    after: {
      page: "ARMAZONE", code: { en: "01 / MAIN PROJECT", es: "01 / PROYECTO PRINCIPAL", ca: "01 / PROJECTE PRINCIPAL" },
      title: "Arma<br><span>zone.</span>",
      subtitle: { en: "The studio's most important purple world.", es: "El mundo morado más importante del estudio.", ca: "El món morat més important de l'estudi." },
      description: { en: "Enter Armazone, explore its zones and discover why every decision leaves a mark on the world.", es: "Entra en Armazone, explora sus zonas y descubre por qué cada decisión deja una marca en el mundo.", ca: "Entra a Armazone, explora les seves zones i descobreix per què cada decisió deixa una marca al món." },
      character: "Derrock",
      characterText: { en: "Guardian of the deep zones and the first character to find Armazone's lost signal.", es: "Guardián de las zonas profundas y primer personaje que encuentra la señal perdida de Armazone.", ca: "Guardià de les zones profundes i primer personatge que troba el senyal perdut d'Armazone." },
      rank: "9", arcana: "Fool", unit: "SEES / FIELD ARCHIVE"
    },
    rift: {
      page: "PEPE SOULS", code: { en: "02 / SECONDARY PROJECT", es: "02 / PROYECTO SECUNDARIO", ca: "02 / PROJECTE SECUNDARI" },
      title: "Pepe<br><span>souls.</span>",
      subtitle: { en: "A compact, direct yellow adventure.", es: "Una aventura amarilla, compacta y directa.", ca: "Una aventura groga, compacta i directa." },
      description: { en: "Pepe Souls is smaller in scale but huge in personality: fast combat and strange humour.", es: "Pepe Souls es un juego menor en escala, pero enorme en personalidad: combates rápidos y humor extraño.", ca: "Pepe Souls és un joc petit d'escala però enorme de personalitat: combats ràpids i humor estrany." },
      character: "Sans",
      characterText: { en: "The yellow traveller who knows every shortcut and never explains how he got there.", es: "El viajero amarillo que conoce todos los atajos y nunca explica cómo ha llegado hasta allí.", ca: "El viatger groc que coneix totes les dreceres i mai explica com ha arribat fins allà." },
      rank: "6", arcana: "Chariot", unit: "RIFT UNIT / FIELD ARCHIVE"
    },
    echo: {
      page: "STRAGHESS", code: { en: "03 / DARK PROJECT", es: "03 / PROYECTO OSCURO", ca: "03 / PROJECTE FOSC" },
      title: "Strag<br><span>hess.</span>",
      subtitle: { en: "Dark red tension around every corner.", es: "Tensión roja oscura en cada esquina.", ca: "Tensió vermella fosca a cada cantonada." },
      description: { en: "Straghess turns darkness into a game system. Move slowly: something is always watching you.", es: "Straghess convierte la oscuridad en un sistema de juego. Avanza despacio: algo siempre te está observando.", ca: "Straghess converteix la foscor en un sistema de joc. Avança a poc a poc: alguna cosa sempre t'observa." },
      character: "Vilafranca",
      characterText: { en: "The figure that appears when the screen turns red and the sound stops being reliable.", es: "La figura que aparece cuando la pantalla se vuelve roja y el sonido deja de ser fiable.", ca: "La figura que apareix quan la pantalla es torna vermella i el so deixa de ser fiable." },
      rank: "8", arcana: "Star", unit: "ECHO CLUB / FIELD ARCHIVE"
    }
  }[game];
  if (!content) throw new Error("Unknown game detail.");

  const translations = {
    en: { back: "← BACK TO GAME SELECT", status: "ARCANA / STATUS", rank: "PROJECT RANK", mission: "Mission log", gameplay: "GAMEPLAY / PLAY VIDEO", archive: "01 / ARCHIVE", character: "02 / CHARACTER", world: "03 / WORLD", file: "GAME FILE" },
    es: { back: "← VOLVER A GAME SELECT", status: "ARCANA / ESTADO", rank: "RANGO DEL PROYECTO", mission: "Registro de misión", gameplay: "JUGABILIDAD / REPRODUCIR VÍDEO", archive: "01 / ARCHIVO", character: "02 / PERSONAJE", world: "03 / MUNDO", file: "ARCHIVO DE JUEGO" },
    ca: { back: "← TORNAR A LA SELECCIÓ DE JOCS", status: "ARCANA / ESTAT", rank: "RANG DEL PROJECTE", mission: "Registre de missió", gameplay: "JUGABILITAT / REPRODUIR VÍDEO", archive: "01 / ARXIU", character: "02 / PERSONATGE", world: "03 / MÓN", file: "FITXA DEL JOC" }
  };

  const language = () => localStorage.getItem("nebula-language") || "en";
  const render = () => {
    const currentLanguage = language();
    const labels = translations[currentLanguage] || translations.en;
    const pageLabel = currentLanguage === "en" ? content.page : currentLanguage === "ca" ? `${content.page} // Fitxa del joc` : `${content.page} // Información del juego`;
    document.title = `ElRocas // ${pageLabel}`;
    document.querySelector("[data-detail-code]").textContent = content.code[currentLanguage];
    document.querySelector("[data-detail-title]").innerHTML = content.title;
    document.querySelector("[data-detail-subtitle]").textContent = content.subtitle[currentLanguage];
    document.querySelector("[data-detail-description]").textContent = content.description[currentLanguage];
    document.querySelector("[data-character-copy]").textContent = content.characterText[currentLanguage];
    document.querySelector("[data-rank]").textContent = content.rank;
    document.querySelector(".detail-back").textContent = labels.back;
    document.querySelector(".hud-label").textContent = labels.status;
    document.querySelector(".hud-panel h2").textContent = content.arcana;
    document.querySelector(".hud-panel p").textContent = content.unit;
    document.querySelector(".rank small").textContent = labels.rank;
    document.querySelector(".detail-description h3").textContent = labels.mission;
    document.querySelector(".media-video figcaption").textContent = labels.gameplay;
    document.querySelector(".detail-footer span:last-child").textContent = `${labels.file} / ${game === "after" ? "01" : game === "rift" ? "02" : "03"}`;
    const captions = document.querySelectorAll(".media-image figcaption");
    [labels.archive, labels.character, labels.world].forEach((value, index) => { if (captions[index]) captions[index].textContent = value; });
    document.querySelector(".visual-board").setAttribute("aria-label", `${currentLanguage === "en" ? "Multimedia gallery of" : currentLanguage === "ca" ? "Galeria multimèdia de" : "Galería multimedia de"} ${content.page}`);
    const altLabels = currentLanguage === "en" ? ["Concept art of", "Character art of", "Environment art of"] : currentLanguage === "ca" ? ["Art conceptual de", "Art del personatge de", "Escenari de"] : ["Arte conceptual de", "Arte de personaje de", "Escenario de"];
    document.querySelectorAll(".media-image img").forEach((image, index) => { image.alt = `${altLabels[index]} ${content.page}`; });
    document.querySelectorAll("[data-character-name]").forEach((element) => { element.textContent = content.character; });
  };

  render();
  window.addEventListener("languagechange", render);

  document.querySelectorAll(".media-image img").forEach((image) => {
    image.addEventListener("error", () => image.closest(".media-frame").classList.add("is-missing"), { once: true });
  });
  document.querySelectorAll(".media-video video").forEach((video) => {
    const frame = video.closest(".media-frame");
    if (!video.currentSrc && !video.querySelector("source")) frame.classList.add("is-missing");
    video.addEventListener("error", () => frame.classList.add("is-missing"), { once: true });
  });
})();
