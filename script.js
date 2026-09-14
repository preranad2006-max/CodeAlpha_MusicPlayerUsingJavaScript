// Pulse Player — a small, framework-free HTML5 Audio player.
const songs = [
  {
    title: "Neon Drift",
    artist: "Astra Vale",
    album: "PULSE ARCHIVE · 001",
    audio: "audio/neon-drift.wav",
    artwork: "images/neon-drift.svg",
    duration: "0:12",
    accent: "#92b366"
  },
  {
    title: "Soft Focus",
    artist: "Mira Sol",
    album: "PULSE ARCHIVE · 002",
    audio: "audio/soft-focus.wav",
    artwork: "images/soft-focus.svg",
    duration: "0:14",
    accent: "#b88772"
  },
  {
    title: "Afterglow FM",
    artist: "North Arcade",
    album: "PULSE ARCHIVE · 003",
    audio: "audio/afterglow-fm.wav",
    artwork: "images/afterglow-fm.svg",
    duration: "0:10",
    accent: "#5a8e9d"
  },
  {
    title: "Daydream Loop",
    artist: "June Bloom",
    album: "PULSE ARCHIVE · 004",
    audio: "audio/daydream-loop.wav",
    artwork: "images/daydream-loop.svg",
    duration: "0:13",
    accent: "#b08cc0"
  },
  {
    title: "Orbital Rain",
    artist: "Kairo Bloom",
    album: "PULSE ARCHIVE · 005",
    audio: "audio/orbital-rain.wav",
    artwork: "images/orbital-rain.svg",
    duration: "0:11",
    accent: "#5d9ab0"
  },
  {
    title: "Amber Hours",
    artist: "Sora Field",
    album: "PULSE ARCHIVE · 006",
    audio: "audio/amber-hours.wav",
    artwork: "images/amber-hours.svg",
    duration: "0:15",
    accent: "#b98252"
  },
  {
    title: "Low Tide",
    artist: "Eli Meridian",
    album: "PULSE ARCHIVE · 007",
    audio: "audio/low-tide.wav",
    artwork: "images/low-tide.svg",
    duration: "0:09",
    accent: "#548993"
  },
  {
    title: "Electric Bloom",
    artist: "Nova Park",
    album: "PULSE ARCHIVE · 008",
    audio: "audio/electric-bloom.wav",
    artwork: "images/electric-bloom.svg",
    duration: "0:16",
    accent: "#a46eaa"
  }
];

const audio = document.querySelector("#audioPlayer");
const playButton = document.querySelector("#playButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const progressBar = document.querySelector("#progressBar");
const volumeBar = document.querySelector("#volumeBar");
const autoplayToggle = document.querySelector("#autoplayToggle");
const playlist = document.querySelector("#playlist");
const albumArt = document.querySelector("#albumArt");
const artworkFrame = document.querySelector("#artworkFrame");
const artworkGlow = document.querySelector(".artwork-glow");
const songTitle = document.querySelector("#songTitle");
const songArtist = document.querySelector("#songArtist");
const songKicker = document.querySelector("#songKicker");
const currentTimeLabel = document.querySelector("#currentTime");
const durationLabel = document.querySelector("#duration");
const trackCounter = document.querySelector("#trackCounter");

let currentIndex = 0;
let isAutoplay = true;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function updateRangeFill(range, percentage) {
  range.style.setProperty("--range-progress", `${Math.max(0, Math.min(100, percentage))}%`);
}

function renderPlaylist() {
  playlist.innerHTML = songs.map((song, index) => `
    <div class="playlist-item ${index === currentIndex ? "is-active" : ""}" role="listitem" tabindex="0" data-index="${index}" aria-label="Play ${song.title} by ${song.artist}">
      <div class="playlist-thumb">
        <img src="${song.artwork}" alt="" />
        <span class="equalizer" aria-hidden="true"><span></span><span></span><span></span></span>
      </div>
      <div class="track-info">
        <span class="track-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="track-name">${song.title}</span>
        <span class="track-artist">${song.artist}</span>
      </div>
      <span class="track-duration">${song.duration}</span>
    </div>
  `).join("");

  playlist.querySelectorAll(".playlist-item").forEach((item) => {
    item.addEventListener("click", () => {
      loadSong(Number(item.dataset.index));
      playSong();
    });
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        loadSong(Number(item.dataset.index));
        playSong();
      }
    });
  });
}

function loadSong(index) {
  currentIndex = (index + songs.length) % songs.length;
  const song = songs[currentIndex];
  audio.src = song.audio;
  audio.load();
  albumArt.src = song.artwork;
  albumArt.alt = `${song.title} album artwork`;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  songKicker.textContent = song.album;
  trackCounter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(songs.length).padStart(2, "0")}`;
  artworkGlow.style.background = song.accent;
  currentTimeLabel.textContent = "0:00";
  durationLabel.textContent = song.duration;
  progressBar.value = 0;
  updateRangeFill(progressBar, 0);
  renderPlaylist();
}

function playSong() {
  audio.play().then(() => {
    playButton.classList.add("is-playing");
    playButton.setAttribute("aria-label", "Pause");
    playButton.setAttribute("title", "Pause");
    artworkFrame.classList.add("is-playing");
    renderPlaylist();
  }).catch(() => {
    // Browsers may block autoplay until the user interacts with the page.
    pauseSong();
  });
}

function pauseSong() {
  audio.pause();
  playButton.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Play");
  playButton.setAttribute("title", "Play");
  artworkFrame.classList.remove("is-playing");
  renderPlaylist();
}

function playNext() {
  loadSong(currentIndex + 1);
  playSong();
}

function playPrevious() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  loadSong(currentIndex - 1);
  playSong();
}

playButton.addEventListener("click", () => {
  if (audio.paused) playSong();
  else pauseSong();
});
nextButton.addEventListener("click", playNext);
prevButton.addEventListener("click", playPrevious);

audio.addEventListener("loadedmetadata", () => {
  if (Number.isFinite(audio.duration)) {
    durationLabel.textContent = formatTime(audio.duration);
    progressBar.max = audio.duration;
  }
});

audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration) || audio.duration === 0) return;
  progressBar.value = audio.currentTime;
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  updateRangeFill(progressBar, (audio.currentTime / audio.duration) * 100);
});

audio.addEventListener("ended", () => {
  if (isAutoplay) playNext();
  else pauseSong();
});

progressBar.addEventListener("input", () => {
  audio.currentTime = Number(progressBar.value);
  updateRangeFill(progressBar, (audio.currentTime / audio.duration) * 100);
});

volumeBar.addEventListener("input", () => {
  audio.volume = Number(volumeBar.value);
  updateRangeFill(volumeBar, Number(volumeBar.value) * 100);
});

autoplayToggle.addEventListener("click", () => {
  isAutoplay = !isAutoplay;
  autoplayToggle.classList.toggle("is-on", isAutoplay);
  autoplayToggle.setAttribute("aria-pressed", String(isAutoplay));
});

audio.volume = Number(volumeBar.value);
updateRangeFill(volumeBar, Number(volumeBar.value) * 100);
loadSong(0);