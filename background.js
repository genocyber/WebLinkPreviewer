const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

extensionAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "open_tab" && message.url) {
    extensionAPI.tabs.create({ url: message.url, active: true });
    sendResponse({ status: "ok" });
  }
  return true;
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