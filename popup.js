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
  
    // Function to update the display of total time saved
    function updateTimeSavedDisplay() {
        chrome.storage.local.get("totalTimeSaved", (result) => {
            const totalTimeSaved = result.totalTimeSaved || 0;
            // Update the text content of the element where you want to display the time
            // Replace 'timeSavedDisplay' with the actual ID of your display element
            document.getElementById("timeSavedDisplay").textContent = `1Time Saved: ${totalTimeSaved} seconds`;
        });
    }
    // Call this function to update the display when the popup is opened
    updateTimeSavedDisplay();
  });  