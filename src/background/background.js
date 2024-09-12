// Function to update popup for a specific tab
function updatePopupForTab(tabId) {
  chrome.storage.local.get("userData", (data) => {
    const popupPath = data && data.userData ? "main.html" : "popup.html";
    console.log(`Setting popup for tab ${tabId} to ${popupPath}`);
    chrome.action.setPopup({ tabId: tabId, popup: popupPath }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting popup:", chrome.runtime.lastError);
      } else {
        console.log(`Successfully set popup for tab ${tabId}`);
      }
    });
  });
}

// Update popup when a new tab is created
chrome.tabs.onCreated.addListener((tab) => {
  updatePopupForTab(tab.id);
});

// Update popup when a tab is updated (e.g., URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    updatePopupForTab(tabId);
  }
});

// Update popup for all tabs when userData changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.userData) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => updatePopupForTab(tab.id));
    });
  }
});

// Update popup for the current tab when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      updatePopupForTab(tabs[0].id);
    }
  });
});

// Ensure popup is set correctly when chrome starts up
chrome.runtime.onStartup.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => updatePopupForTab(tab.id));
  });
});
