let wasAdPlaying = false;
let originalPlaybackRate = 1;

const checkInterval = 1000; // every 1000ms, a check will occur (this can be more frequent, may cause laggy browser)

function isAdPlaying() {
  return !!document.querySelector('.ytp-ad-preview, .ytp-ad-preview-slot');}

function accelerate() {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    videoElement.playbackRate = 15;
    videoElement.muted = true;}}

function restoreNormal(rate) {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    videoElement.playbackRate = rate;}}

function getAdDuration() {
  const adDurationElement = document.querySelector('.ytp-time-duration');
  //console.log(adDurationElement)
  if (adDurationElement) {
    //console.log("time:", adDurationElement.textContent)
    const [minutes, seconds] = adDurationElement.textContent.trim().split(':').map(Number);
    return minutes * 60 + seconds -1; //acceleration takes 1 sec
  }
  return 0;}

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
  const adCurrentlyPlaying = isAdPlaying();
  const videoElement = document.querySelector('video');

  if (videoElement && !adCurrentlyPlaying){
    originalPlaybackRate = videoElement.playbackRate; // Dynamically adjusting the value of originalPlaybackRate
  }
  
  // Retrieve the ad skipper state and use it to decide whether to skip ads
  getAdSkipperState((isAdSkipperEnabled) => {
    if (isAdSkipperEnabled) {
      const skipButton = document.querySelector(".ytp-ad-skip-button, .ytp-ad-overlay-close-button, .ytp-ad-skip-button-slot");
  
      if (skipButton) { 
        skipButton.click();
        chrome.runtime.sendMessage({ action: "updateTimeSaved", timeSaved: 5 });
        wasAdPlaying = true;

      } else if (adCurrentlyPlaying) {
        accelerate();
        chrome.runtime.sendMessage({ action: "updateTimeSaved", timeSaved: getAdDuration()});
        wasAdPlaying = true;

      } else if (wasAdPlaying && !adCurrentlyPlaying) {
        restoreNormal(originalPlaybackRate);
        wasAdPlaying = false;
      }}
  });
}, checkInterval);