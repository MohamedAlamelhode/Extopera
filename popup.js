const toggleButton = document.querySelector("#toggle");
const siteLabel = document.querySelector("#site");
const statusLabel = document.querySelector("#status");

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function initialize() {
  const tab = await getActiveTab();
  let hostname;

  try {
    hostname = new URL(tab.url).hostname;
  } catch {
    siteLabel.textContent = "هذه الصفحة غير مدعومة";
    toggleButton.textContent = "غير متاح";
    toggleButton.disabled = true;
    return;
  }

  if (!hostname) {
    siteLabel.textContent = "هذه الصفحة غير مدعومة";
    toggleButton.textContent = "غير متاح";
    toggleButton.disabled = true;
    return;
  }

  siteLabel.textContent = hostname;
  const { rtlSites = {} } = await chrome.storage.local.get({ rtlSites: {} });
  const enabled = Boolean(rtlSites[hostname]);
  updateButton(enabled);

  toggleButton.addEventListener("click", async () => {
    const nextEnabled = toggleButton.getAttribute("aria-pressed") !== "true";
    const { rtlSites: currentSites = {} } = await chrome.storage.local.get({ rtlSites: {} });

    if (nextEnabled) {
      currentSites[hostname] = true;
    } else {
      delete currentSites[hostname];
    }

    await chrome.storage.local.set({ rtlSites: currentSites });
    updateButton(nextEnabled);
    statusLabel.textContent = nextEnabled ? "تم تفعيل RTL لهذا الموقع" : "تم إيقاف RTL لهذا الموقع";
  });
}

function updateButton(enabled) {
  toggleButton.disabled = false;
  toggleButton.setAttribute("aria-pressed", String(enabled));
  toggleButton.textContent = enabled ? "إيقاف RTL لهذا الموقع" : "تفعيل RTL لهذا الموقع";
}

initialize().catch(() => {
  siteLabel.textContent = "تعذر الوصول إلى هذه الصفحة";
  toggleButton.textContent = "غير متاح";
  toggleButton.disabled = true;
});