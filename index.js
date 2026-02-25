const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEL = document.getElementById('current-time'),
    durationEL = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img'),
    volumeSlider = document.getElementById('volume-slider'),
    volumeIcon = document.getElementById('volume-icon'),
    shuffleBtn = document.getElementById('shuffle'),
    repeatBtn = document.getElementById('repeat'),
    favoriteBtn = document.getElementById('favorite'),
    playbackSpeed = document.getElementById('playback-speed'),
    darkModeToggle = document.getElementById('dark-mode-toggle'),
    playlistSongs = document.getElementById('playlist-songs'),
    dropArea = document.getElementById('drop-area');

const music = new Audio();
let songs = [
    { path: 'assets/Lazy Song.mp3', displayName: 'The Lazy Song', cover: 'assets/Lazy Song.jpg', artist: 'Bruno Mars' },
    { path: 'assets/Grenade.mp3', displayName: 'Grenade', cover: 'assets/Grenade.jpg', artist: 'Bruno Mars' },
    { path: 'assets/It Will Rain.mp3', displayName: 'It Will Rain', cover: 'assets/It Will Rain.jpg', artist: 'Bruno Mars' },
    { path: 'assets/24k Magic.mp3', displayName: '24k Magic', cover: 'assets/24k Magic.jpg', artist: 'Bruno Mars' },
    { path: 'assets/Just The Way You Are.mp3', displayName: 'Just The Way You Are', cover: 'assets/Just The Way You Are.jpg', artist: 'Bruno Mars' },
    { path: 'assets/Locked Out Of Heaven.mp3', displayName: 'Locked Out Of Heaven', cover: 'assets/Locked Out Of Heaven.jpg', artist: 'Bruno Mars' },
    { path: 'assets/Talking To The Moon.mp3', displayName: 'Talking To The Moon', cover: 'assets/Talking To The Moon.jpg', artist: 'Bruno Mars' },
    { path: 'assets/That Is What I Like.mp3', displayName: 'That Is What I Like', cover: 'assets/That Is What I Like.jpg', artist: 'Bruno Mars' },
    { path: 'assets/Treasure.mp3', displayName: 'Treasure', cover: 'assets/Treasure.jpg', artist: 'Bruno Mars' },
    { path: 'assets/Uptown Funk.mp3', displayName: 'Uptown Funk', cover: 'assets/Uptown Funk.jpg', artist: 'Bruno Mars' },
    { path: 'assets/When I Was Your Man.mp3', displayName: 'When I Was Your Man', cover: 'assets/When I Was Your Man.jpg', artist: 'Bruno Mars' },
    { path: 'assets/Chunky.mp3', displayName: 'Chunky', cover: 'assets/Chunky.jpg', artist: 'Bruno Mars' },
    { path: 'assets/Runaway Baby.mp3', displayName: 'Runaway Baby', cover: 'assets/Runaway Baby.jpg', artist: 'Bruno Mars' },
    { path: 'assets/Versace On The Floor.mp3', displayName: 'Versace On The Floor', cover: 'assets/Versace On The Floor.jpg', artist: 'Bruno Mars' }
];
let favorites = [];
let musicIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isDarkMode = false;

// Play/Pause toggle
function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

// Play music
function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.classList.add('playing');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

// Pause music
function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.classList.remove('playing');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

// Load song
function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.querySelector('img').src = song.cover;
    image.classList.add('active');
    updatePlaylistUI();
    updateFavoriteButton();
}

// Change song
function changeMusic(direction) {
    if (isShuffle) {
        musicIndex = Math.floor(Math.random() * songs.length);
    } else {
        musicIndex = (musicIndex + direction + songs.length) % songs.length;
    }
    loadMusic(songs[musicIndex]);
    playMusic();
}

// Update progress bar
function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEL.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEL.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

// Set progress bar
function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

// Toggle favorite for the current song
function toggleFavorite() {
    const currentSong = songs[musicIndex];
    const index = favorites.findIndex(song => song.path === currentSong.path);
    if (index === -1) {
        favorites.push(currentSong);
    } else {
        favorites.splice(index, 1);
    }
    updateFavoriteButton();
}

// Update favorite button UI based on current song
function updateFavoriteButton() {
    const currentSong = songs[musicIndex];
    const isFavorited = favorites.some(song => song.path === currentSong.path);
    favoriteBtn.classList.toggle('active', isFavorited);
}

// Update playlist UI
function updatePlaylistUI() {
    playlistSongs.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = `${song.displayName} - ${song.artist}`;
        if (index === musicIndex) {
            li.style.fontWeight = 'bold';
            li.style.color = '#ff5555';
        }
        li.addEventListener('click', () => {
            musicIndex = index;
            loadMusic(songs[musicIndex]);
            playMusic();
        });
        playlistSongs.appendChild(li);
    });
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    darkModeToggle.classList.toggle('active');
}

// Handle dropped files
function handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'audio/mpeg') {
            const songURL = URL.createObjectURL(file);
            songs.push({
                path: songURL,
                displayName: file.name.replace('.mp3', ''),
                cover: 'assets/default-cover.jpg',
                artist: 'Unknown'
            });
        }
    }
    updatePlaylistUI();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowRight':
            changeMusic(1);
            break;
        case 'ArrowLeft':
            changeMusic(-1);
            break;
        case 'ArrowUp':
            music.volume = Math.min(1, music.volume + 0.1);
            volumeSlider.value = music.volume;
            break;
        case 'ArrowDown':
            music.volume = Math.max(0, music.volume - 0.1);
            volumeSlider.value = music.volume;
            break;
    }
});

// Event listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
});
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active');
});
favoriteBtn.addEventListener('click', toggleFavorite);
playbackSpeed.addEventListener('change', () => {
    music.playbackRate = parseFloat(playbackSpeed.value);
});
darkModeToggle.addEventListener('click', toggleDarkMode);
dropArea.addEventListener('drop', handleDrop);
dropArea.addEventListener('dragover', (e) => e.preventDefault());
music.addEventListener('ended', () => {
    if (isRepeat) {
        playMusic();
    } else {
        changeMusic(1);
    }
});
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);
volumeSlider.addEventListener('input', () => {
    music.volume = volumeSlider.value;
    volumeIcon.className = music.volume === 0 ? 'fa-solid fa-volume-xmark' :
                           music.volume < 0.5 ? 'fa-solid fa-volume-low' : 'fa-solid fa-volume-high';
});

// Load initial song
loadMusic(songs[musicIndex]);
