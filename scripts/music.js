const music = document.querySelector("#site-music");
const musicToggle = document.querySelector(".music-toggle");
const volumeSlider = document.querySelector("#music-volume");
const volumeValue = document.querySelector("#music-volume-value");
const MUSIC_ENABLED = "nebulaMusicEnabled";
const MUSIC_TIME = "nebulaMusicTime";
const MUSIC_TRACK = "nebulaMusicTrack";

if (music && musicToggle) {
  let audioError = false;
  let trackIndex = 0;
  const defaultTrack = music.dataset.src;
  const playlist = [...new Set((music.dataset.playlist || defaultTrack || "")
    .split(",")
    .map((track) => track.trim())
    .filter(Boolean))];
  const savedVolume = Number(localStorage.getItem("nebulaMusicVolume") || "0.42");
  const shouldPlay = sessionStorage.getItem(MUSIC_ENABLED) === "true";

  music.volume = Math.min(Math.max(savedVolume, 0), 1);

  const updateVolumeControl = () => {
    if (!volumeSlider || !volumeValue) return;
    const percentage = Math.round(music.volume * 100);
    volumeSlider.value = String(percentage);
    volumeValue.textContent = `${percentage}%`;
    volumeSlider.style.setProperty("--volume-progress", `${percentage}%`);
  };

  const updateMusicButton = (message) => {
    if (message) {
      musicToggle.textContent = message;
      return;
    }
    if (audioError) {
      musicToggle.textContent = "♫ AUDIO NOT FOUND";
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-pressed", "false");
      return;
    }
    const playing = !music.paused;
    musicToggle.textContent = playing ? "♫ MUSIC: ON" : "♫ MUSIC: OFF";
    musicToggle.setAttribute("aria-pressed", String(playing));
    musicToggle.classList.toggle("is-playing", playing);
  };

  const savePosition = () => {
    if (Number.isFinite(music.currentTime)) {
      sessionStorage.setItem(MUSIC_TIME, String(music.currentTime));
      sessionStorage.setItem(MUSIC_TRACK, String(trackIndex));
    }
  };

  const setTrack = (index) => {
    if (!playlist.length) return false;
    trackIndex = (index + playlist.length) % playlist.length;
    music.src = new URL(playlist[trackIndex], window.location.href).href;
    music.load();
    sessionStorage.setItem(MUSIC_TRACK, String(trackIndex));
    return true;
  };

  const chooseNextTrack = () => {
    if (playlist.length < 2) return trackIndex;
    let nextIndex = trackIndex;
    while (nextIndex === trackIndex) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    }
    return nextIndex;
  };

  const playCurrentTrack = async (attempt = 0) => {
    audioError = false;
    try {
      await music.play();
      sessionStorage.setItem(MUSIC_ENABLED, "true");
      updateMusicButton();
    } catch {
      if (attempt < playlist.length - 1) {
        setTrack(chooseNextTrack());
        await playCurrentTrack(attempt + 1);
        return;
      }
      audioError = true;
      updateMusicButton("♫ CHECK AUDIO FILE");
    }
  };

  music.addEventListener("loadedmetadata", () => {
    const savedTime = Number(sessionStorage.getItem(MUSIC_TIME) || "0");
    const savedTrack = Number(sessionStorage.getItem(MUSIC_TRACK));
    if (Number.isInteger(savedTrack) && savedTrack >= 0 && savedTrack < playlist.length && savedTrack !== trackIndex) {
      trackIndex = savedTrack;
    }
    if (savedTime > 0 && savedTime < music.duration) music.currentTime = savedTime;
  });

  music.addEventListener("timeupdate", savePosition);
  music.addEventListener("volumechange", updateVolumeControl);
  music.addEventListener("error", () => {
    audioError = true;
    updateMusicButton();
  });

  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      if (!music.src) setTrack(trackIndex);
      await playCurrentTrack();
    } else {
      music.pause();
      sessionStorage.setItem(MUSIC_ENABLED, "false");
      savePosition();
      updateMusicButton();
    }
  });

  volumeSlider?.addEventListener("input", () => {
    const volume = Number(volumeSlider.value) / 100;
    music.volume = Math.min(Math.max(volume, 0), 1);
    localStorage.setItem("nebulaMusicVolume", String(music.volume));
    updateVolumeControl();
  });

  music.addEventListener("ended", () => {
    if (sessionStorage.getItem(MUSIC_ENABLED) !== "true") {
      sessionStorage.removeItem(MUSIC_TIME);
      updateMusicButton();
      return;
    }
    sessionStorage.removeItem(MUSIC_TIME);
    setTrack(chooseNextTrack());
    playCurrentTrack();
  });

  window.addEventListener("pagehide", savePosition);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) savePosition();
  });

  if (shouldPlay) {
    const savedTrack = Number(sessionStorage.getItem(MUSIC_TRACK));
    if (Number.isInteger(savedTrack) && savedTrack >= 0 && savedTrack < playlist.length) trackIndex = savedTrack;
    setTrack(trackIndex);
    playCurrentTrack().catch(() => updateMusicButton("♫ RESUME MUSIC"));
  } else {
    updateMusicButton();
  }
  updateVolumeControl();
}
