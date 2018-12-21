# google-to-spotify-playlist-importer

Imports Google Play Music playlist files to Spotify.

## Setup

### Download Your Playlists from Google Play Music

For each playlist you want to import, first download it from the Google Play
Music website.

1. Load Google Play Music in your browser, open developer tools, and switch to
   the network tab.
2. Navigate to the playlist in the web application.
3. Switch to the developer tools network tab and locate the "loaduserplaylist"
   request for regular playlists or the "getephemthumbsup" request for the
   automatically created Thumbs Up playlist.
4. Right-click on the request and select the option to copy the response.
5. Paste the response in a new file.

### Spotify Developer Info

The following environment variables must be configured:

* SPOTIFY_PLAYLIST_IMPORTER_CLIENT_ID
* SPOTIFY_PLAYLIST_IMPORTER_CLIENT_SECRET
* SPOTIFY_PLAYLIST_IMPORTER_AUTH_TOKEN

The Client ID and Client Secret are provided with a
[Spotify developer application](https://developer.spotify.com/dashboard/applications/).

You can get an authorization token with the correct scopes using the
[Spotify developer console](https://developer.spotify.com/console/post-playlists/).

## Usage

```sh
node main.js <path-to-google-playlist-file>
```

## Results

After the script runs, you'll have a new playlist in your Spotify account titled
"Imported Playlist" containing each track that was successfully imported.

The script logs one line per track to standard out. Tracks that were
successfully imported produce a line starting with "Added track". Tracks that
were not imported produce a line starting with "Missing track" or "Error".
