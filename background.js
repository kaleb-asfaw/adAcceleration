chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ "totalTimeSaved": 0, "timeSavedSinceReset": 0, "lastResetDate": new Date().toISOString(), "adSkipperEnabled": true });
    // initialize id in superbase upon installation HERE
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "resetTimeSaved") {
        chrome.storage.local.set({ "timeSavedSinceReset": 0, "lastResetDate": new Date().toISOString() });
    }
    
    if (request.action === "updateTimeSaved") {
        chrome.storage.local.get(["totalTimeSaved", "timeSavedSinceReset"], (result) => {
            let totalTimeSaved = result.totalTimeSaved || 0;
            let timeSavedSinceReset = result.timeSavedSinceReset || 0;

            totalTimeSaved += request.timeSaved; // Value that is pushed to database

            // UPDATE TOTALTIMESAVED IN DB

            timeSavedSinceReset += request.timeSaved;
            chrome.storage.local.set({ "totalTimeSaved": totalTimeSaved, "timeSavedSinceReset": timeSavedSinceReset });
        });
    }
});