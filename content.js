(() => {
  const site = location.hostname;
  const className = "extopera-rtl-enabled";

  function setEnabled(enabled) {
    if (!document.documentElement) {
      document.addEventListener("DOMContentLoaded", () => setEnabled(enabled), { once: true });
      return;
    }

    document.documentElement.classList.toggle(className, enabled);
  }

  chrome.storage.local.get({ rtlSites: {} }, ({ rtlSites }) => {
    setEnabled(Boolean(rtlSites[site]));
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes.rtlSites) return;

    setEnabled(Boolean(changes.rtlSites.newValue?.[site]));
  });
})();