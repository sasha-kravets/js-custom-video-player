const player = document.querySelector(".player");
const mainVideo = player.querySelector(".player__video");
const videoTimeline = player.querySelector(".player__timeline");
const currentVidTime = player.querySelector(".controls__current-time");
const videoDuration = player.querySelector(".controls__video-duration");
const progressBar = player.querySelector(".player__progress-bar");
const volumeBtn = player.querySelector(".controls__btn_volume .controls__icon");
const volumeSlider = player.querySelector(".controls__volume-range");
const skipBackward = player.querySelector(".controls__btn_skip-backward .controls__icon");
const skipForward = player.querySelector(".controls__btn_skip-forward .controls__icon");
const playPauseBtn = player.querySelector(".controls__btn_play-pause .controls__icon");
const speedBtn = player.querySelector(".controls__btn_playback-speed .controls__icon");
const speedOptions = player.querySelector(".controls__speed-options");
const picInPicBtn = player.querySelector(".controls__btn_pic-in-pic .controls__icon");
const fullScreenBtn = player.querySelector(".controls__btn_fullscreen .controls__icon");

let timer;
const hideControls = () => {
  if (mainVideo.paused) return;
  timer = setTimeout(() => {
    player.classList.remove("show-controls");
  }, 3000);
};
hideControls();

player.addEventListener("mousemove", () => {
  player.classList.add("show-controls");
  clearTimeout(timer); // clear timer
  hideControls();
});

// If video is paused, play the video else pause
function togglePlayPause() {
  mainVideo.paused ? mainVideo.play() : mainVideo.pause();
}

playPauseBtn.addEventListener("click", togglePlayPause);
mainVideo.addEventListener("click", togglePlayPause);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    togglePlayPause();
    e.preventDefault();
  }
});

// If the video is playing , change icon to pause and back
mainVideo.addEventListener("play", () => {
  playPauseBtn.classList.replace("fa-play", "fa-pause");
});
mainVideo.addEventListener("pause", () => {
  playPauseBtn.classList.replace("fa-pause", "fa-play");
});

const formatTime = (time) => {
  let seconds = Math.floor(time % 60);
  let minutes = Math.floor(time / 60) % 60;
  let hours = Math.floor(time / 3600);

  // adding 0 at the beginning if the particluar value is less than 10
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (parseInt(hours) === 0) {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

// Timeline update
mainVideo.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target;
  let percent = (currentTime / duration) * 100;
  progressBar.style.width = `${percent}%`;

  // update video current time
  currentVidTime.innerText = formatTime(currentTime);
});

// Passing video duration
mainVideo.addEventListener("loadedmetadata", () => {
  videoDuration.innerText = formatTime(mainVideo.duration);
});

// Draggable timeline
const draggableProgressBar = (e) => {
  let timelineWidth = videoTimeline.clientWidth;
  progressBar.style.width = `${e.offsetX}px`; // mouuse x position
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
  // update video current time
  currentVidTime.innerText = formatTime(mainVideo.currentTime);
};

videoTimeline.addEventListener("mousedown", () => {
  videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

document.addEventListener("mouseup", () => {
  videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

// Show time on timeline hover
videoTimeline.addEventListener("mousemove", (e) => {
  let timelineWidth = videoTimeline.clientWidth;
  let offsetX = e.offsetX;
  let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
  const progressTime = videoTimeline.querySelector(".player__hover-time");

  if (offsetX < 20) {
    offsetX = 20;
  } else if (offsetX > timelineWidth - 20) {
    offsetX = timelineWidth - 20;
  }
  progressTime.style.left = `${offsetX}px`;
  progressTime.innerText = formatTime(percent);
});

// Skip 10 seconds forward or backward
skipBackward.addEventListener("click", () => {
  mainVideo.currentTime -= 5;
});
skipForward.addEventListener("click", () => {
  mainVideo.currentTime += 5;
});

// Mute button
volumeBtn.addEventListener("click", () => {
  if (!volumeBtn.classList.contains("fa-volume-high")) {
    mainVideo.volume = 0.5;
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    mainVideo.volume = 0;
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  volumeSlider.value = mainVideo.volume; // Update slider value according to the video volume
});

// Volume slider
volumeSlider.addEventListener("input", (e) => {
  mainVideo.volume = e.target.value;
  if (e.target.value == 0) {
    return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
});

// Playback speed button
speedBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // stop the event from propagating up the DOM hierarchy
  speedOptions.classList.toggle("show");
});
// hide options box on outside click
document.addEventListener("click", (e) => {
  if (e.target.className !== "material-symbols-rounded") {
    speedOptions.classList.remove("show");
  }
});
speedOptions.querySelectorAll(".controls__speed-option").forEach((option) => {
  option.addEventListener("click", () => {
    mainVideo.playbackRate = option.dataset.speed; // passing option dataset value as video playback value
    speedOptions.querySelector(".active").classList.remove("active");
    option.classList.add("active");
  });
});

// Picture in picture
picInPicBtn.addEventListener("click", () => {
  mainVideo.requestPictureInPicture();
});

// Fullscreen
fullScreenBtn.addEventListener("click", () => {
  player.classList.toggle("fullscreen");
  if (document.fullscreenElement) {
    fullScreenBtn.classList.replace("fa-compress", "fa-expand");
    return document.exitFullscreen();
  }
  fullScreenBtn.classList.replace("fa-expand", "fa-compress");
  player.requestFullscreen();
});

// Timeline / progress bar
videoTimeline.addEventListener("click", (e) => {
  let timelineWidth = videoTimeline.clientWidth; // getting videoTimeline width
  // update video currentTime by clicking on the timeline
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // e.offsetX gives the mouse x position
});