// Wrapper universal para soporte Firefox (browser) y Chrome/Edge (chrome)
const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

const DEFAULTS = {
  activationKey: "Shift",
  previewWidth: 600,
  previewHeight: 700,
  previewDelay: 200,
  blacklistedDomains: [],
  darkMode: true
};

function restoreOptions() {
  const processSettings = (settings) => {
    document.getElementById("activationKey").value = settings.activationKey;
    document.getElementById("previewWidth").value = settings.previewWidth;
    document.getElementById("previewHeight").value = settings.previewHeight;
    document.getElementById("previewDelay").value = settings.previewDelay;

    const domains = Array.isArray(settings.blacklistedDomains) 
      ? settings.blacklistedDomains.join("\n") 
      : "";
    document.getElementById("blacklistedDomains").value = domains;

    const isDark = settings.darkMode !== undefined ? settings.darkMode : true;
    applyTheme(isDark);
  };

  if (typeof browser !== "undefined") {
    extensionAPI.storage.local.get(DEFAULTS).then(processSettings);
  } else {
    extensionAPI.storage.local.get(DEFAULTS, processSettings);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const isDark = currentTheme !== "dark";
  
  applyTheme(isDark);
  extensionAPI.storage.local.set({ darkMode: isDark });
}

function applyTheme(isDark) {
  const toggleBtn = document.getElementById("themeToggle");
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
    toggleBtn.textContent = "☀️ Modo Claro";
  } else {
    document.documentElement.removeAttribute("data-theme");
    toggleBtn.textContent = "🌙 Modo Oscuro";
  }
}

function saveOptions(e) {
  e.preventDefault();

  const currentTheme = document.documentElement.getAttribute("data-theme");
  const rawDomains = document.getElementById("blacklistedDomains").value;
  
  const domainsArray = rawDomains
    .split("\n")
    .map(d => d.trim().toLowerCase())
    .filter(d => d.length > 0);

  const settings = {
    activationKey: document.getElementById("activationKey").value,
    previewWidth: parseInt(document.getElementById("previewWidth").value, 10) || DEFAULTS.previewWidth,
    previewHeight: parseInt(document.getElementById("previewHeight").value, 10) || DEFAULTS.previewHeight,
    previewDelay: parseInt(document.getElementById("previewDelay").value, 10) || DEFAULTS.previewDelay,
    blacklistedDomains: domainsArray,
    darkMode: currentTheme === "dark"
  };

  const onSaved = () => {
    const status = document.getElementById("status");
    status.textContent = "¡Ajustes guardados correctamente!";
    setTimeout(() => {
      status.textContent = "";
    }, 2000);
  };

  if (typeof browser !== "undefined") {
    extensionAPI.storage.local.set(settings).then(onSaved);
  } else {
    extensionAPI.storage.local.set(settings, onSaved);
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("saveBtn").addEventListener("click", saveOptions);
document.getElementById("themeToggle").addEventListener("click", toggleTheme);