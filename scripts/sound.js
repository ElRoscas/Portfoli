const uiSound = "assets/audio/Select.m4a";
const uiAudio = new Audio(uiSound);
uiAudio.preload = "auto";
const SOUND_VOLUME_KEY = "nebulaSoundVolume";
const SOUND_MUTED_KEY = "nebulaSoundMuted";
let soundMuted = localStorage.getItem(SOUND_MUTED_KEY) === "true";
const savedSoundVolume = Number(localStorage.getItem(SOUND_VOLUME_KEY) || "0.34");
uiAudio.volume = Math.min(Math.max(savedSoundVolume, 0), 1);

const playFallbackTone = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(170, now);
  oscillator.frequency.exponentialRampToValueAtTime(62, now + 0.11);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.13);
  oscillator.addEventListener("ended", () => context.close(), { once: true });
};

const playUiSound = (target) => {
  if (soundMuted) return;
  uiAudio.currentTime = 0;
  uiAudio.play().catch(() => {
    target?.setAttribute("data-sound-hint", "Añade assets/audio/Select.m4a");
    playFallbackTone();
  });
};

window.playNebulaUiSound = playUiSound;

const setupSoundControl = () => {
  const slider = document.querySelector("#sound-volume");
  const toggle = document.querySelector("#sound-toggle");
  if (!slider || !toggle || slider.dataset.initialized === "true") return;
  slider.dataset.initialized = "true";

  const update = () => {
    slider.value = String(Math.round(uiAudio.volume * 100));
    slider.style.setProperty("--sound-progress", `${slider.value}%`);
    toggle.textContent = soundMuted ? "SFX OFF" : "SFX ON";
    toggle.setAttribute("aria-pressed", String(soundMuted));
    toggle.classList.toggle("is-muted", soundMuted);
  };

  slider.addEventListener("input", () => {
    uiAudio.volume = Number(slider.value) / 100;
    localStorage.setItem(SOUND_VOLUME_KEY, String(uiAudio.volume));
    if (uiAudio.volume > 0 && soundMuted) {
      soundMuted = false;
      localStorage.setItem(SOUND_MUTED_KEY, "false");
    }
    update();
  });
  toggle.addEventListener("click", () => {
    soundMuted = !soundMuted;
    localStorage.setItem(SOUND_MUTED_KEY, String(soundMuted));
    update();
  });
  update();
};

window.setupNebulaSoundControl = setupSoundControl;
setupSoundControl();

document.addEventListener("pointerdown", (event) => {
  const target = event.target.closest("button, a");
  if (!target || target.matches(".music-toggle, #music-volume, #sound-toggle, #sound-volume, [data-transition]") || target.closest(".page-transition")) return;
  playUiSound(target);
}, { passive: true });
