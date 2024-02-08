// Update the getSongs function to handle errors and use relative paths
async function getSongs(folder) {
  currFolder = folder;
  try {
    let response = await fetch(`./${folder}/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch songs: ${response.statusText}`);
    }
    let div = document.createElement("div");
    div.innerHTML = await response.text();
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
        songs.push(element.href.split(`/${folder}/`)[1]);
      }
    }

    // ... rest of the code remains unchanged

    return songs;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

// Update the fetch for albums to handle errors and use relative paths
async function displayAlbums() {
  try {
    let response = await fetch(`./songs/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch albums: ${response.statusText}`);
    }
    let div = document.createElement("div");
    div.innerHTML = await response.text();
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
        // ... rest of the code remains unchanged
      }
    }

    // ... rest of the code remains unchanged
  } catch (error) {
    console.error("Error fetching albums:", error);
  }
}

// Main function
async function main() {
  try {
    await getSongs("songs/dailyMix");
    playMusic(songs[0], true);

    await displayAlbums();

    // ... rest of the code remains unchanged
  } catch (error) {
    console.error("Error in main:", error);
  }
}

// Calling Main Function
main();
