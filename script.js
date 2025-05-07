
const previousSong= () => {
    if (songIndex <= 1) {
        songIndex = 8;
    } else {
        songIndex -= 1;
    }
    playSong();
}

const nextSong=() => {
    if (songIndex >= 8) {
        songIndex = 1;
    } else {
        songIndex += 1;
    }
    playSong();
}
//Variables
let songIndex = 1;
let pauseIndex = false;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById("masterPlay"); //play/pause button
const progressBar = document.getElementsByClassName("progressBar")[0];//progress bar with div
const progressContainer = document.getElementsByClassName("progressContainer")[0];
//let songItem = Array.from(document.getElementsByClassName("songItem"));//handle after
let masterSongName = document.getElementById("masterSongName");
const rippleSpans = document.querySelectorAll('.ripple-container span');
// Animation control variables
let animationId = null;//progress bar animation id
let isPlaying = false; // Flag to check if the song is playing
const width = window.innerWidth; // Get the width of the window
let animationState = true;// Animation state variable of the ripple 
//Event listeners
document.getElementById('next').addEventListener('click',nextSong);// Next song button
document.getElementById('previous').addEventListener('click',previousSong);// Previous song button
progressContainer.addEventListener('click', seekAudio);// Seek audio when clicking on the progress bar
// Audio timeupdate event (for progress bar sync)
audioElement.addEventListener('timeupdate', updateProgressBar);

// Initialize progress bar
progressBar.style.width = "0%";
console.log(progressBar.style.width);

//list of songs
let songs = [
    { id:1, songName: "Halo CE Theme", filepath: "song/1.mp3", coverPath: "covers/cover1.jpg", duration: 177.790453 },
    { id:2, songName: "Halo CE Didactic Principal", filepath: "song/2.mp3", coverPath: "covers/cover1.jpg", duration: 107.860657 },
    { id:3, songName: "Halo 2 Mjolnir Mix", filepath: "song/3.mp3", coverPath: "covers/cover2.jpg", duration: 249.7578 },
    { id:4, songName: "Halo 2 Heretic, Hero", filepath: "song/4.mp3", coverPath: "covers/cover2.jpg", duration: 154.515351 },
    { id:5, songName: "Halo 2 Heavy Price Paid", filepath: "song/5.mp3", coverPath: "covers/cover2.jpg", duration: 151.981473 },
    { id:6, songName: "Halo 3 Finish the Fight", filepath: "song/6.mp3", coverPath: "covers/cover3.jpg", duration: 147.018208 },
    { id:7, songName: "Halo 3 ODST Finale", filepath: "song/7.mp3", coverPath: "covers/cover4.jpg", duration: 492.069637 },
    { id:8, songName: "Halo 3 ODST The Rookie", filepath: "song/8.mp3", coverPath: "covers/cover4.jpg", duration: 449.803514 },
]

// 2. Function to generate song items
function renderSongList() {
    const container = document.querySelector('.songItemContainer');
    container.innerHTML = ''; // Clear existing items
    
    songs.forEach(song => {
      const songItem = document.createElement('div');
      songItem.className = 'songItem';
      songItem.innerHTML = `
        <img src="${song.coverPath}" alt="${song.id}">
        <span class="songName">${song.songName}</span>
        <span class="songlistplay">
          <span class="timeStamp">${formatDuration(song.duration)} 
            <i id="${song.id}" class="songItemPlay fa-solid fa-play"></i>
          </span>
        </span>
      `;
      container.appendChild(songItem);
    });
    arrayOfSongItemPlay = Array.from(document.getElementsByClassName('songItemPlay'));

    //Format time in mm:ss format
    function formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    }
    

    // Add event listeners to all play buttons
  document.querySelectorAll('.songItemPlay').forEach(button => {
    button.addEventListener('click',(e) => {
        console.log(e.target.id)
        makeallPlay();
        if (parseInt(e.target.id) == songIndex) {
            if (audioElement.paused) {
                pauseIndex = true;
            } else {
                pauseIndex = false;
            }

        } else {
            pauseIndex = true;
        }
        songIndex = parseInt(e.target.id);
        
        e.target.classList.remove('fa-play');
        e.target.classList.add('fa-pause');
        console.log(songIndex, pauseIndex);
        console.log(e.target.classList);
        if (pauseIndex) {
            playSong();
        } else {
            pauseSong();
        }
    } )
  });
}

// 4. Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    renderSongList();
});

let arrayOfSongItemPlay; 
console.log(arrayOfSongItemPlay)



//audioElement.play();

//function to play a song
const playSong = () => {
    console.log(songIndex, audioElement.currentTime, audioElement)
    startRipple();
    masterSongName.innerHTML = songs[songIndex - 1].songName;
    //if else to check if same song then play from where it was left
    //original pc url="http://127.0.0.1:5500/songs/${songIndex}.mp3"
    //for github hosting use"https://arijitkayal-gm.github.io/Myhalothemeapp/${songIndex}.mp3"
    //for own ip while playing any song in console see the link it generates and use it here and replace name of mp3 with string interpolation
    if (audioElement.src == `https://arijitkayal-gm.github.io/Myhalothemeapp/songs/${songIndex}.mp3`) {
        console.log(`matched`)
        audioElement.play();
    } else {
        console.log(`not matched`);
        audioElement.src = `songs/${songIndex}.mp3`;
        audioElement.currentTime = 0;
        audioElement.play();
    }
    makeallPlay();
    changeIcon(songIndex);
    console.log(arrayOfSongItemPlay[songIndex - 1])
    masterPlay.classList.remove('fa-play');
    masterPlay.classList.add('fa-pause');
    // Start animation if not already running
    isPlaying = true;
    if (!animationId) {
        animateProgressBar();
    }
}

//function to pause song
const pauseSong = () => {
    audioElement.pause();
    stopRipple();
    makeallPlay();
    arrayOfSongItemPlay[songIndex - 1].classList.remove('fa-pause');//pseudo
    arrayOfSongItemPlay[songIndex - 1].classList.add('fa-play');
    masterPlay.classList.remove('fa-pause');
    masterPlay.classList.add('fa-play');
    // Stop progress bar animation
    isPlaying = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

//Events

//Play&Pause
masterPlay.addEventListener("click", () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        playSong();

    } else {
        pauseSong();

    }
})


const makeallPlay = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((e) => {
        e.classList.remove('fa-pause');
        e.classList.add('fa-play');

    })
}
// function to currently playing song icon change
const changeIcon = (id) => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((e) => {
        if (e.id == id) {
            e.classList.remove('fa-play');
            e.classList.add('fa-pause');
        }
    })
}

//playing song from list
//loop through all the songItemPlay(the play icon on each songItem) and add event listener to each of them


//progress bar animation
function seekAudio(e) {
    // Calculate clicked position (0-1)
    const rect = progressContainer.getBoundingClientRect();
    const clickPosition = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
    
    // Set audio position
    audioElement.currentTime = clickPosition * songs[songIndex-1].duration;
    
    // Update progress bar immediately
    progressBar.style.width = `${clickPosition * 100}%`;
    
    // Restart animation if audio is playing
    if (isPlaying) {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      animateProgressBar();
    }
  }

  
function updateProgressBar() {
    // Update progress bar based on current audio time
    const duration = songs[songIndex-1].duration * 1000; 
    const progress = (audioElement.currentTime / duration) * 100;
    progressBar.style.width = `${progress}%`;
  }

function animateProgressBar() {
    const startTime = performance.now();
    const duration = songs[songIndex-1].duration * 1000; // in milliseconds
    const initialProgress = (audioElement.currentTime / audioElement.duration) * 100;

    function animate(currentTime) {
        if (!isPlaying) return;

        const elapsedTime = currentTime - startTime;
        const currentAudioTime = audioElement.currentTime * 1000; // in ms fishy

        const progress = Math.min((currentAudioTime / duration) * 100, 100);

        progressBar.style.width = `${progress}%`;

        if (progress < 100 && isPlaying) {
            animationId = requestAnimationFrame(animate);
        } else {
            animationId = null;
            //Next song when current song ends
            nextSong();
        }
    }

    animationId = requestAnimationFrame(animate);
}


// When new audio loads (important!)
audioElement.addEventListener('loadedmetadata', function () {
    progressBar.style.width = "0%";
});


//ripple effect stop
const stopRipple = () => {
    rippleSpans.forEach(span => {
        span.style.animation = 'none';
        void span.offsetWidth; // Trigger reflow
    });
}
//ripple effect start
const startRipple = () => {
    rippleSpans.forEach((span, index) => {
        span.style.animation = 'ripple 3s ease-out infinite';
        if (width <= 768) {
            span.style.animationDelay = `${index * 0.5}s`;
        } else {
            span.style.animationDelay = `${index * 1}s`;
        }
    });
}
