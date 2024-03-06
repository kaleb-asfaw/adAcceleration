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
    function updateTimeSavedTooltip() {
      chrome.storage.local.get("totalTimeSaved", (result) => {
          const totalTimeSaved = result.totalTimeSaved || 0;
          // Sending floor of minutes saved
          let displayMessage;

          if (totalTimeSaved < 60) {
            displayMessage = 'Less than a minute saved';
          }
          else if (totalTimeSaved < 120) {
            displayMessage = 'You have saved 1 minute'
          }
          else{
            displayMessage = `Over ${Math.floor(totalTimeSaved/60)} minutes saved!`;
          }
          document.getElementById("displayMessage").textContent = displayMessage
      });
  }
  updateTimeSavedTooltip(); // Call this function to update the tooltip when the popup is opened
  });  