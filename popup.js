document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.getElementById("toggleSwitch");
    const resetButton = document.getElementById("resetButton");
    const resetDateDisplay = document.getElementById("resetDateDisplay");

    resetButton.addEventListener('click', function () {
      const newResetDate = new Date().toISOString();
      chrome.storage.local.set({ "timeSavedSinceReset": 0, "lastResetDate": newResetDate }, () => {
          if (chrome.runtime.lastError) {
              console.error('Error updating storage:', chrome.runtime.lastError);
          } else {
              // Data has been successfully updated, now refresh the UI
              resetDateDisplay.textContent = `Time Saved Since (${new Date(newResetDate).toLocaleDateString()}): 0 seconds saved`;
              updateTimeSavedTooltip();
          }
      });
  });

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
    
    function formatTime(timeInSeconds) {
      if (timeInSeconds < 60) {
          return 'Less than a minute';
      } else if (timeInSeconds < 120) {
          return '1 minute';
      } else {
          return `Over ${Math.floor(timeInSeconds / 60)} minutes!`;
      }
  }
    
    function updateTimeSavedTooltip() {
      chrome.storage.local.get(["totalTimeSaved", "timeSavedSinceReset", "lastResetDate"], (result) => {
          const totalTimeSaved = result.totalTimeSaved || 0;
          const timeSavedSinceReset = result.timeSavedSinceReset || 0;
          const lastResetDate = new Date(result.lastResetDate || new Date()).toLocaleDateString();
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
          document.getElementById("displayMessage").textContent = totalTimeSaved
          resetDateDisplay.textContent = `Time Saved Since(${lastResetDate}): ${timeSavedSinceReset}`;
      });
  }
  updateTimeSavedTooltip(); // Call this function to update the tooltip when the popup is opened
  });  