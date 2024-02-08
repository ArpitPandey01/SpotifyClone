//Some Global Variables
let currSong = new Audio();
let songUl;
let songs;
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

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  // Show all the songs in the playlist

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" width="34" src="img/music.svg" alt="musicIcon">
                          <div class="info">
                              <div> ${song.replaceAll("%20", " ")}</div>
                              <div>Arpit</div>
                          </div>
                          <div class="playnow">
                              <span>Play Now</span>
                              <img class="invert" src="img/play.svg" alt="playIcon">
                          </div> </li>`;
  }

  // Attach an event listener to each song

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

// Playing Music - Function

const playMusic = (track, pause = false) => {
  currSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[1];
      //Get The meta deta of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}" class="card">
     <div class="play">
     <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                                <polygon points="59,40 59,160 159,100" fill="black" stroke="#000" stroke-width="1"/>
                              </svg>
     </div>
     <img src="/songs/${folder}/cover.jpg">
     <h4>${response.title}</h4>
     <p>${response.Description}</p>
 </div>`;
    }
  }
  //Adding Event Listener on Cards

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}


//Main function

async function main() {
  await getSongs("songs/dailyMix");
  playMusic(songs[0], true);

  // call Display albums

  displayAlbums();

  // Add eventListener On Play Button

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
