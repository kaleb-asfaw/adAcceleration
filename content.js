let wasAdPlaying = false;
let originalPlaybackRate = 1;
let lastPlaybackTime = 0;

const checkInterval = 1000; // every 1000ms, a check will occur (this can be more frequent, may cause laggy browser)

function isAdPlaying() {
  return !!document.querySelector('.video-ads ytp-ad-module, .ytp-ad-preview, .ytp-preview-ad, .ytp-ad-preview-slot, .ytp-skip-ad-button');
}

function isDetected() {
  return !!document.querySelector('.style-scope.ytd-enforcement-message-view-model');
}

function accelerate() {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    originalPlaybackRate = videoElement.playbackRate; // Save the original playback rate
    videoElement.playbackRate = 15;
    videoElement.muted = true;
  }
}

function restoreNormal() {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    videoElement.playbackRate = originalPlaybackRate; // Restore to the original playback rate
    videoElement.muted = false; // Restore the original mute state if needed
  }
}

function getAdDuration() {
  const adDurationElement = document.querySelector('.ytp-time-duration');
  if (adDurationElement) {
    const [minutes, seconds] = adDurationElement.textContent.trim().split(':').map(Number);
    return minutes * 60 + seconds - 1; // acceleration takes 1 sec
  }
  return 0;
}

function getAdSkipperState(callback) {
  chrome.storage.local.get("adSkipperEnabled", (result) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      const isAdSkipperEnabled = result.adSkipperEnabled !== undefined ? result.adSkipperEnabled : true;
      callback(isAdSkipperEnabled);
    }
  });
}

// Periodically check the ad skipper state
const adSkipChecker = setInterval(() => {
  const adCurrentlyPlaying = isAdPlaying();
  const videoElement = document.querySelector('video');
  const blockDetected = isDetected();

  if (videoElement && !adCurrentlyPlaying) {
    originalPlaybackRate = videoElement.playbackRate; // Dynamically adjusting the value of originalPlaybackRate
  }

  // Check if the enforcement message is detected
  if (blockDetected) {
    // console.log('Block message detected, refreshing the page.');
    location.reload();
    return; // Exit the function to avoid further checks in this interval
  }

  // Retrieve the ad skipper state and use it to decide whether to skip ads
  getAdSkipperState((isAdSkipperEnabled) => {
    if (isAdSkipperEnabled) {
      const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-overlay-close-button, .ytp-ad-skip-button-slot, .ytp-skip-ad-button');

      if (skipButton) {
        skipButton.click();
        chrome.runtime.sendMessage({ action: 'updateTimeSaved', timeSaved: 5 });
        wasAdPlaying = true;
        // console.log('Ad skipped, time saved updated.');
      } else if (adCurrentlyPlaying) {
        if (!wasAdPlaying) {
          accelerate();
          wasAdPlaying = true;
          // console.log('Ad accelerated, duration logged:', getAdDuration());
        }
        chrome.runtime.sendMessage({ action: 'updateTimeSaved', timeSaved: getAdDuration() });
      } else if (wasAdPlaying && !adCurrentlyPlaying) {
        restoreNormal();
        wasAdPlaying = false;
        // console.log('Ad finished playing, state reset.');
      }
    }
  });
}, checkInterval);
