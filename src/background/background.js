const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

// Escuchador de mensajes corregido
extensionAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "open_tab" && message.url) {
    extensionAPI.tabs.create({ url: message.url, active: true })
      .then(() => sendResponse({ status: "ok" }))
      .catch((err) => sendResponse({ status: "error", error: err.message }));
    
    // OBLIGATORIO: Mantener el canal de mensaje abierto para la respuesta asíncrona
    return true; 
  }
  
  // Si no procesamos ningún mensaje, devolvemos false o nada
  return false;
});

const RULE_ID = 1;

async function setupHeaderRules() {
  if (!extensionAPI.declarativeNetRequest) return;

  const rules = [
    {
      id: RULE_ID,
      priority: 1,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          { header: "X-Frame-Options", operation: "remove" },
          { header: "x-frame-options", operation: "remove" },
          { header: "Frame-Options", operation: "remove" },
          { header: "Content-Security-Policy", operation: "remove" },
          { header: "content-security-policy", operation: "remove" }
        ]
      },
      condition: {
        resourceTypes: ["sub_frame"]
      }
    }
  ];

  try {
    await extensionAPI.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID],
      addRules: rules
    });
  } catch (err) {
    console.error("Error al aplicar reglas de declarativeNetRequest:", err);
  }
}

extensionAPI.runtime.onInstalled.addListener(setupHeaderRules);
extensionAPI.runtime.onStartup.addListener(setupHeaderRules);