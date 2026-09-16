browser.runtime.onMessage.addListener((message) => {
  if (message.action === "open_tab" && message.url) {
    browser.tabs.create({ url: message.url, active: true });
  }
});