document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const resetButton = document.getElementById("resetButton");
  const displayMessage = document.getElementById("displayMessage");
  const toggleArrow = document.getElementById("toggleArrow");
  let currentView = "lifetime"; // Start with "lifetime" view

  // Hide the reset button initially
  resetButton.style.display = "none";

  toggleArrow.addEventListener('click', function () {
      // Toggle the view
      if (currentView === "lifetime") {
          currentView = "sinceDate";
          updateDisplay(); // Update display based on the new view
          resetButton.style.display = "block"; // Show reset button for "sinceDate" view
      } else {
          currentView = "lifetime";
          updateDisplay(); // Update display based on the new view
          resetButton.style.display = "none"; // Hide reset button for "lifetime" view
      }
  });

  // Update the display based on the current view
  function updateDisplay() {
      chrome.storage.local.get(["totalTimeSaved", "timeSavedSinceReset", "lastResetDate"], (result) => {
          if (currentView === "sinceDate") {
              const date = new Date(result.lastResetDate).toLocaleDateString();
              const timeSavedSinceDate = formatTime(result.timeSavedSinceReset);
              displayMessage.textContent = result.timeSavedSinceReset
              // if (result.timeSavedSinceReset == 0){
              //   displayMessage.textContent = timeSavedSinceDate;}
              // else{
              // displayMessage.textContent = timeSavedSinceDate + date;}

          } else { // "lifetime" view
              const totalTimeSaved = formatTime(result.totalTimeSaved);
              displayMessage.textContent = result.totalTimeSaved
              // displayMessage.textContent = totalTimeSaved + "installation!";
          }
      });
  }

  function formatTime(timeInSeconds) {
    // Your existing logic to format the time
    if (timeInSeconds == 0) {
        return 'Start watching and save time!';}
    else if (timeInSeconds < 60) {
        return 'Less than a minute saved since ';} 
    else if (timeInSeconds < 120) {
        return '1 minute saved since ';} 
    else {
      return `Over ${Math.floor(timeInSeconds / 60)} minutes saved since `;}}

  // Reset button functionality
  resetButton.addEventListener('click', function () {
      const newResetDate = new Date().toISOString();
      chrome.storage.local.set({ "timeSavedSinceReset": 0, "lastResetDate": newResetDate }, () => {
          if (chrome.runtime.lastError) {
              console.error('Error updating storage:', chrome.runtime.lastError);
          } else {
              // Optionally, update the UI to reflect the reset
              updateDisplay();
          }
      });
  });

  // Toggle switch initialization
  chrome.storage.local.get("adSkipperEnabled", (result) => {
      toggleSwitch.checked = result.adSkipperEnabled !== undefined ? result.adSkipperEnabled : true;
  });

  toggleSwitch.addEventListener("change", function () {
      chrome.storage.local.set({ "adSkipperEnabled": this.checked });
  });

  // Call updateDisplay at the end to ensure the popup is initialized with the correct data
  updateDisplay();
});