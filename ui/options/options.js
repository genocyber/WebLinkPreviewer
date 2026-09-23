document.addEventListener("DOMContentLoaded", () => {
  const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

  // Cargar la versión actual desde el manifest.json
  const manifestData = extensionAPI.runtime.getManifest();
  const versionElement = document.getElementById("app-version");
  if (versionElement && manifestData.version) {
    versionElement.textContent = `v${manifestData.version}`;
  }

  const DEFAULTS = {
    activationKey: "Shift",
    previewWidth: 600,
    previewHeight: 700,
    previewDelay: 200,
    blacklistedDomains: []
  };

  const form = document.getElementById("settings-form");
  const statusMessage = document.getElementById("status-message");

  function loadSettings() {
    extensionAPI.storage.local.get(DEFAULTS, (settings) => {
      document.getElementById("activationKey").value = settings.activationKey || DEFAULTS.activationKey;
      document.getElementById("previewWidth").value = settings.previewWidth || DEFAULTS.previewWidth;
      document.getElementById("previewHeight").value = settings.previewHeight || DEFAULTS.previewHeight;
      document.getElementById("previewDelay").value = settings.previewDelay || DEFAULTS.previewDelay;

      const domains = settings.blacklistedDomains || DEFAULTS.blacklistedDomains;
      document.getElementById("blacklistedDomains").value = Array.isArray(domains) ? domains.join("\n") : "";
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const rawDomains = document.getElementById("blacklistedDomains").value;
    const domainList = rawDomains
      .split("\n")
      .map((d) => d.trim().toLowerCase())
      .filter((d) => d.length > 0);

    const newSettings = {
      activationKey: document.getElementById("activationKey").value,
      previewWidth: parseInt(document.getElementById("previewWidth").value, 10) || DEFAULTS.previewWidth,
      previewHeight: parseInt(document.getElementById("previewHeight").value, 10) || DEFAULTS.previewHeight,
      previewDelay: parseInt(document.getElementById("previewDelay").value, 10) || DEFAULTS.previewDelay,
      blacklistedDomains: domainList
    };

    extensionAPI.storage.local.set(newSettings, () => {
      showStatus("Ajustes guardados correctamente");
    });
  });

  function showStatus(msg) {
    statusMessage.textContent = msg;
    statusMessage.classList.add("visible");
    setTimeout(() => {
      statusMessage.classList.remove("visible");
    }, 2500);
  }

  loadSettings();
});