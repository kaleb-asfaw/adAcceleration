document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.getElementById("toggleSwitch");
  
    // Retrieve the ad skipper state from Chrome storage and set the toggle switch accordingly
    chrome.storage.local.get("adSkipperEnabled", (result) => {
      const isAdSkipperEnabled = result.adSkipperEnabled !== undefined ? result.adSkipperEnabled : true;
  
      toggleSwitch.checked = isAdSkipperEnabled;
  
      // Handle toggle switch changes
      toggleSwitch.addEventListener("change", function () {
        const isChecked = this.checked;
  
        // Update the ad skipper state in Chrome storage
        chrome.storage.local.set({ "adSkipperEnabled": isChecked });
      });
    });
  });
  
  