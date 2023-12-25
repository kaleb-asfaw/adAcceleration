let wasAdPlaying = false;

function isAdUnskippable() {
  return !!document.querySelector(".ytp-ad-preview, .ytp-ad-preview-slot");
}

function clickSkipAdButton() {
  const skipButton = document.querySelector(".ytp-ad-skip-button, .ytp-ad-overlay-close-button, .ytp-ad-skip-button-slot");
  if (skipButton) {
    skipButton.click();
  }
}

function accelerate() {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    videoElement.playbackRate = 15;
    videoElement.muted = true;
  }
}

function restoreNormal() {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    videoElement.playbackRate = 1;
    videoElement.muted = false;
  }
}

const checkInterval = 1000; // every 1000ms, a check will occur

function isAdPlaying() {
  return !!document.querySelector('.ytp-ad-preview, .ytp-ad-preview-slot');
}

// Retrieve the ad skipper state, and handle errors gracefully
function getAdSkipperState(callback) {
  chrome.storage.local.get("adSkipperEnabled", (result) => {
    if (chrome.runtime.lastError) {
      // Handle any errors that occur while retrieving data
      console.error(chrome.runtime.lastError);
    } else {
      const isAdSkipperEnabled = result.adSkipperEnabled !== undefined ? result.adSkipperEnabled : true;
      callback(isAdSkipperEnabled);
    }
  });
}

// Periodically check the ad skipper state
const adSkipChecker = setInterval(() => {
  // Retrieve the ad skipper state and use it to decide whether to skip ads
  getAdSkipperState((isAdSkipperEnabled) => {
    if (isAdSkipperEnabled) {
      const skipButton = document.querySelector(".ytp-ad-skip-button, .ytp-ad-overlay-close-button, .ytp-ad-skip-button-slot");
      const adCurrentlyPlaying = isAdPlaying();

      if (skipButton) {
        clickSkipAdButton();
        wasAdPlaying = true;
      } else if (adCurrentlyPlaying || isAdUnskippable()) {
        accelerate();
        wasAdPlaying = true;
      } else if (wasAdPlaying && !adCurrentlyPlaying) {
        restoreNormal();
        wasAdPlaying = false;
      }
    }
  });
}, checkInterval);
