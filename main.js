const fs = require('fs');

// https://github.com/thelinmichael/spotify-web-api-node
const SpotifyApi = require("spotify-web-api-node");

// Get from https://developer.spotify.com/dashboard/applications/
const CLIENT_ID = "b79f2468429844849a2c558b77d5ba50";
const CLIENT_SECRET = "";
const AUTH_TOKEN = "";

let spotifyApi = new SpotifyApi({
    cliendId: CLIENT_ID,
    clientSecret: CLIENT_SECRET
});

spotifyApi.setAccessToken(AUTH_TOKEN);

// Path to the import file
let googlePlaylist = JSON.parse(fs.readFileSync("/home/bryan/Downloads/google-play-music-thumbs-up-formatted.json"));
let googleTracks = googlePlaylist[1][0];
// [49] is timestamp?
googleTracks.sort((a, b) => {
    return a[49] - b[49];
});

function processOneTrack(trackName, artist, album, playlistId) {
    return new Promise((resolve, reject) => {
        try {
            let search = "track:" + trackName + " artist:" + artist + " album:" + album;

            spotifyApi.searchTracks(search).then(response => {
                let items = response.body.tracks.items;
                if (items && items.length) {
                    let firstItem = items[0];
                    spotifyApi.addTracksToPlaylist(playlistId, ["spotify:track:" + firstItem.id]).then(response => {
                        console.log("Added track:", trackName, artist, album);
                        resolve(firstItem.id);
                    }).catch(ex => {
                        console.log("Error adding track:", trackName, artist, album);
                        console.log(ex);
                        resolve(null);
                    });
                } else {
                    console.log("Missing track:", trackName, artist, album);
                    resolve(null);
                }
            }).catch(ex => {
                console.log("Missing track:", trackName, artist, album);
                console.log(ex);
                resolve(null);
            });
        } catch (ex) {
            console.log("Error handling track:", trackName, artist, album);
            console.log(ex);
            resolve(null);
        }
    });
}

function getSanitizedSearchTerm(term) {
    let result = term.replace("'", "")
                     .replace(":", "")
                     .replace("(", "")
                     .replace(")", "")
                     .replace(".", "")
                     .replace(",", "")
                     .replace("-", "");
    return result;
}

function importPlaylist() {
    spotifyApi.getMe().then(userResponse => {
        let userId = userResponse.body.id;

        spotifyApi.createPlaylist(userId, "New Playlist", {"public": false}).then(response => {
            let playlistId = response.body.id;
            let currentIndex = 0;

            async function next() {
                let googleTrack = googleTracks[currentIndex];
                let trackName = getSanitizedSearchTerm(googleTrack[1]);
                let artist = getSanitizedSearchTerm(googleTrack[3]);
                let album = getSanitizedSearchTerm(googleTrack[4]);

                let result = await processOneTrack(trackName, artist, album, playlistId);
                currentIndex += 1;

                if (currentIndex < googleTracks.length) {
                    setTimeout(next, 500);
                }
            }

            next();
        });
    });
}

importPlaylist();
