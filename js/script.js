// Global Variables
let currSong = new Audio();
let songs = [];
let currFolder;

let previous = document.getElementById("prev");
let play = document.getElementById("play");
let next = document.getElementById("next");

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Function to extract folder name from URL
function getFolderName(url) {
  const parts = url.split('/');
  return parts[parts.length - 2];
}

// Function to get songs based on folder
async function getSongs(folder) {
  currFolder = folder;
  const response = await fetch(`/${folder}/`);
  const html = await response.text();
  const div = document.createElement("div");
  div.innerHTML = html;

  // Extract songs from anchor tags
  const as = div.querySelectorAll('a[href$=".mp3"]');
  songs = Array.from(as).map(element => element.href.split(`/${folder}/`)[1]);

  // Display songs in the playlist
  const songUL = document.querySelector(".songList").querySelector("ul");
  songUL.innerHTML = songs.map(song =>
    `<li> <!-- Your li HTML here --> </li>`
  ).join('');

  // Attach event listener to each song
  songUL.querySelectorAll("li").forEach((li, index) => {
    li.addEventListener("click", () => {
      playMusic(songs[index]);
    });
  });

  return songs;
}

// Function to display albums
async function displayAlbums() {
  const response = await fetch(`/songs/`);
  const html = await response.text();
  const div = document.createElement("div");
  div.innerHTML = html;

  // Extract folders from anchor tags
  const folders = Array.from(div.querySelectorAll('a[href*="/songs/"]'))
    .filter(element => !element.href.includes(".htaccess"))
    .map(element => getFolderName(element.href));

  const cardContainer = document.querySelector(".cardContainer");

  // Display cards for each folder
  for (const folder of folders) {
    const folderInfo = await fetch(`/songs/${folder}/info.json`);
    const info = await folderInfo.json();

    cardContainer.innerHTML += `
      <div data-folder="${folder}" class="card">
        <!-- Your card HTML here -->
      </div>`;

    // Add event listener to each card
    cardContainer.querySelector(`[data-folder="${folder}"]`).addEventListener("click", async () => {
      songs = await getSongs(`songs/${folder}`);
      playMusic(songs[0]);
    });
  }
}

// Main function
async function main() {
  // Get songs for initial folder
  await getSongs("songs/dailyMix");
  playMusic(songs[0], true);

  // Display albums
  displayAlbums();

  play.addEventListener("click", () => {
    if (currSong.paused) {
      currSong.play();
      play.src = "img/pause.svg";
    } else {
      currSong.pause();
      play.src = "img/play.svg";
    }
  });

  //updating time bar

  currSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currSong.currentTime
    )} / ${secondsToMinutesSeconds(currSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currSong.currentTime / currSong.duration) * 100 + "%";
  });

  //Adding a EventListener on seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currSong.currentTime = (currSong.duration * percent) / 100;
  });

  // Adding EventListener on Hamburger button

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Adding EventListener on Close Button

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Adding EventListener on Previous Button

  previous.addEventListener("click", (e) => {
    currSong.pause();
    let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Adding EventListener on Next Button

  next.addEventListener("click", (e) => {
    currSong.pause();
    let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Adding EventListener on Volume Button

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currSong.volume = parseInt(e.target.value) / 100;
      if(currSong.volume >0){
        document.querySelector(".volume > img").src = document.querySelector(".volume > img").src.replace("img/mute.svg" , "img/volume.svg");
      }
    });


//Add Event Listener to Mute the Track
document.querySelector(".volume > img").addEventListener('click', e=>{
  if(e.target.src.includes("img/volume.svg")){
    e.target.src = e.target.src.replace("img/volume.svg" , "img/mute.svg");
    currSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
    e.target.src = e.target.src.replace("img/mute.svg" , "img/volume.svg");
    currSong.volume = .10;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }
})

}

// Calling Main Function
main();
