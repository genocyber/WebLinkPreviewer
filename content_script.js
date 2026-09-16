let hoverTimer = null;
let previewContainer = null;
let loadingIndicator = null;
let isPinned = false;
let currentSettings = {};

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let initialLeft = 0;
let initialTop = 0;

const DEFAULTS = {
  activationKey: "Shift",
  previewWidth: 600,
  previewHeight: 700,
  previewDelay: 200,
  blacklistedDomains: []
};

function loadSettings() {
  return browser.storage.local.get(DEFAULTS).then((s) => {
    currentSettings = s;
  });
}
loadSettings();
browser.storage.onChanged.addListener(() => loadSettings());

function isKeyActive(event) {
  if (currentSettings.activationKey === "none") return true;
  if (currentSettings.activationKey === "Shift") return event.shiftKey;
  if (currentSettings.activationKey === "Control") return event.ctrlKey;
  if (currentSettings.activationKey === "Alt") return event.altKey;
  return false;
}

function isDomainBlacklisted(url) {
  try {
    const hostname = new URL(url).hostname;
    return (currentSettings.blacklistedDomains || []).some(domain => domain && hostname.includes(domain));
  } catch (e) {
    return false;
  }
}

function formatPreviewUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be")) {
      let videoId = "";
      if (parsed.hostname.includes("youtu.be")) {
        videoId = parsed.pathname.slice(1);
      } else if (parsed.searchParams.has("v")) {
        videoId = parsed.searchParams.get("v");
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    }
  } catch (e) {}
  return url;
}

function showLoadingIndicator(x, y, delay) {
  removeLoadingIndicator();
  loadingIndicator = document.createElement("div");
  Object.assign(loadingIndicator.style, {
    position: "fixed",
    top: `${y + 20}px`,
    left: `${x + 10}px`,
    width: "40px",
    height: "4px",
    backgroundColor: "#334155",
    borderRadius: "2px",
    overflow: "hidden",
    zIndex: "2147483646",
    pointerEvents: "none"
  });

  const bar = document.createElement("div");
  Object.assign(bar.style, {
    width: "0%",
    height: "100%",
    backgroundColor: "#3b82f6",
    transition: `width ${delay}ms linear`
  });

  loadingIndicator.appendChild(bar);
  document.body.appendChild(loadingIndicator);

  requestAnimationFrame(() => {
    bar.style.width = "100%";
  });
}

function removeLoadingIndicator() {
  if (loadingIndicator) {
    loadingIndicator.remove();
    loadingIndicator = null;
  }
}

document.addEventListener("mouseover", (e) => {
  const link = e.target.closest("a");
  if (!link || !link.href || link.href.startsWith("javascript:") || link.href.startsWith("#")) return;
  if (isPinned || isDomainBlacklisted(link.href)) return;

  clearTimeout(hoverTimer);

  if (isKeyActive(e)) {
    const delay = currentSettings.previewDelay || 200;
    showLoadingIndicator(e.clientX, e.clientY, delay);

    hoverTimer = setTimeout(() => {
      removeLoadingIndicator();
      createPreview(link.href, e.clientX, e.clientY);
    }, delay);
  }
}, true);

document.addEventListener("mousemove", (e) => {
  if (previewContainer || isPinned) return;
  
  const link = e.target.closest("a");
  if (!link || !link.href || link.href.startsWith("javascript:") || link.href.startsWith("#")) return;
  if (isDomainBlacklisted(link.href)) return;

  if (isKeyActive(e) && !hoverTimer) {
    const delay = currentSettings.previewDelay || 200;
    showLoadingIndicator(e.clientX, e.clientY, delay);

    hoverTimer = setTimeout(() => {
      removeLoadingIndicator();
      createPreview(link.href, e.clientX, e.clientY);
    }, delay);
  }
});

document.addEventListener("mouseout", (e) => {
  const link = e.target.closest("a");
  if (link && !isPinned && !isDragging) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
    removeLoadingIndicator();
  }
});

document.addEventListener("keyup", (e) => {
  if (isPinned || isDragging) return;

  const key = currentSettings.activationKey;
  if (
    (key === "Shift" && e.key === "Shift") ||
    (key === "Control" && e.key === "Control") ||
    (key === "Alt" && e.key === "Alt")
  ) {
    removePreview();
  }
});

document.addEventListener("keydown", (e) => {
  if (!previewContainer) return;

  if (e.code === "Space") {
    e.preventDefault();
    handlePinButtonClick();
  } else if (e.key === "Escape") {
    removePreview();
  }
});

function createPreview(rawUrl, mouseX, mouseY) {
  removePreview();

  const url = formatPreviewUrl(rawUrl);
  const width = currentSettings.previewWidth || 600;
  const height = currentSettings.previewHeight || 700;

  const padding = 20;
  let left = mouseX + 15;
  let top = mouseY + 15;

  if (left + width > window.innerWidth - padding) {
    left = Math.max(padding, mouseX - width - 15);
  }
  if (top + height > window.innerHeight - padding) {
    top = Math.max(padding, mouseY - height - 15);
  }

  previewContainer = document.createElement("div");
  previewContainer.id = "link-preview-hover-container";
  Object.assign(previewContainer.style, {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
    zIndex: "2147483647",
    backgroundColor: "#1e293b",
    borderRadius: "10px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid #334155",
    fontFamily: "system-ui, -apple-system, sans-serif",
    resize: "both",
    minWidth: "300px",
    minHeight: "200px"
  });

  // Cabecera
  const header = document.createElement("div");
  Object.assign(header.style, {
    height: "36px",
    backgroundColor: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px",
    borderBottom: "1px solid #334155",
    userSelect: "none",
    cursor: "grab",
    flexShrink: "0"
  });

  header.addEventListener("mousedown", startDragging);

  const title = document.createElement("span");
  title.textContent = rawUrl;
  Object.assign(title.style, {
    color: "#94a3b8",
    fontSize: "12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "60%",
    pointerEvents: "none"
  });

  const controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.gap = "8px";

  const pinBtn = createHeaderButton("📌", "Fijar / Cerrar (Espacio)", () => handlePinButtonClick());
  const openBtn = createHeaderButton("↗️", "Abrir en nueva pestaña", () => {
    browser.runtime.sendMessage({ action: "open_tab", url: rawUrl });
    removePreview();
  });
  const closeBtn = createHeaderButton("✖️", "Cerrar (Esc)", () => removePreview());

  controls.appendChild(pinBtn);
  controls.appendChild(openBtn);
  controls.appendChild(closeBtn);

  header.appendChild(title);
  header.appendChild(controls);
  previewContainer.appendChild(header);

  // Cuerpo
  const body = document.createElement("div");
  Object.assign(body.style, {
    flex: "1",
    position: "relative",
    backgroundColor: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  });

  const spinner = document.createElement("div");
  spinner.textContent = "Cargando vista previa...";
  Object.assign(spinner.style, {
    position: "absolute",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "500"
  });
  body.appendChild(spinner);

  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(rawUrl);
  const isVideo = /\.(mp4|webm|ogg)$/i.test(rawUrl);

  if (isImage) {
    const img = document.createElement("img");
    img.src = rawUrl;
    Object.assign(img.style, { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" });
    img.onload = () => spinner.remove();
    body.appendChild(img);
  } else if (isVideo) {
    const video = document.createElement("video");
    video.src = rawUrl;
    video.controls = true;
    video.autoplay = true;
    Object.assign(video.style, { maxWidth: "100%", maxHeight: "100%" });
    video.onloadeddata = () => spinner.remove();
    body.appendChild(video);
  } else {
    const iframe = document.createElement("iframe");
    iframe.src = url;
    Object.assign(iframe.style, {
      width: "100%",
      height: "100%",
      border: "none",
      backgroundColor: "#ffffff"
    });

    // Quitar el texto de carga tras 1 segundo
    setTimeout(() => {
      if (spinner && spinner.parentNode) {
        spinner.remove();
      }
    }, 1000);

    iframe.onload = () => {
      if (spinner && spinner.parentNode) {
        spinner.remove();
      }
    };

    body.appendChild(iframe);
  }

  previewContainer.appendChild(body);
  document.body.appendChild(previewContainer);
}

function showIframeErrorFallback(container, targetUrl) {
  container.innerHTML = "";
  
  const box = document.createElement("div");
  Object.assign(box.style, {
    textAlign: "center",
    padding: "20px",
    color: "#f8fafc"
  });

  const icon = document.createElement("div");
  icon.textContent = "🛡️";
  icon.style.fontSize = "32px";
  icon.style.marginBottom = "10px";

  const msg = document.createElement("p");
  msg.textContent = "Este sitio web rechaza las vistas previas por seguridad (X-Frame-Options).";
  Object.assign(msg.style, {
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "15px"
  });

  const actionBtn = document.createElement("button");
  actionBtn.textContent = "Abrir en nueva pestaña";
  Object.assign(actionBtn.style, {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
  });

  actionBtn.onclick = () => {
    browser.runtime.sendMessage({ action: "open_tab", url: targetUrl });
    removePreview();
  };

  box.appendChild(icon);
  box.appendChild(msg);
  box.appendChild(actionBtn);
  container.appendChild(box);
}

function handlePinButtonClick() {
  if (isPinned) {
    removePreview();
  } else {
    isPinned = true;
    if (previewContainer) {
      previewContainer.style.border = "2px solid #3b82f6";
    }
  }
}

function startDragging(e) {
  if (e.target.tagName === "BUTTON") return;

  isDragging = true;
  isPinned = true;
  if (previewContainer) {
    previewContainer.style.border = "2px solid #3b82f6";
  }

  const header = e.currentTarget;
  header.style.cursor = "grabbing";

  dragStartX = e.clientX;
  dragStartY = e.clientY;
  initialLeft = previewContainer.offsetLeft;
  initialTop = previewContainer.offsetTop;

  const iframe = previewContainer.querySelector("iframe");
  if (iframe) iframe.style.pointerEvents = "none";

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDragging);
}

function onDrag(e) {
  if (!isDragging || !previewContainer) return;

  const deltaX = e.clientX - dragStartX;
  const deltaY = e.clientY - dragStartY;

  previewContainer.style.left = `${initialLeft + deltaX}px`;
  previewContainer.style.top = `${initialTop + deltaY}px`;
}

function stopDragging() {
  if (!isDragging) return;
  isDragging = false;

  if (previewContainer) {
    const header = previewContainer.querySelector("div");
    if (header) header.style.cursor = "grab";

    const iframe = previewContainer.querySelector("iframe");
    if (iframe) iframe.style.pointerEvents = "auto";
  }

  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDragging);
}

function createHeaderButton(icon, title, onClick) {
  const btn = document.createElement("button");
  btn.textContent = icon;
  btn.title = title;
  Object.assign(btn.style, {
    background: "transparent",
    border: "none",
    color: "#cbd5e1",
    cursor: "pointer",
    fontSize: "13px",
    padding: "2px 4px",
    borderRadius: "4px"
  });
  btn.addEventListener("click", onClick);
  return btn;
}

function removePreview() {
  clearTimeout(hoverTimer);
  hoverTimer = null;
  removeLoadingIndicator();
  stopDragging();
  if (previewContainer) {
    previewContainer.remove();
    previewContainer = null;
  }
  isPinned = false;
}