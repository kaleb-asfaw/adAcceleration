chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ "totalTimeSaved": 0, "adSkipperEnabled": true });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateTimeSaved") {
        chrome.storage.local.get("totalTimeSaved", (result) => {
            let totalTimeSaved = result.totalTimeSaved || 0;
            totalTimeSaved += request.timeSaved;
            chrome.storage.local.set({ "totalTimeSaved": totalTimeSaved });
        });
    }
});