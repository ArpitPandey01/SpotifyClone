// Global Variables
let currSong = new Audio();
let songs = [];
let currFolder;

// Other variables...

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

  // Other event listeners...

  // Call other functions...
}

// Calling Main Function
main();
