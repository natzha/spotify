# spotify

https://developer.spotify.com/documentation/web-api/howtos/web-app-profile

## requirements
node npm

## To run
- `git clone `
- `npm install`
- `npm run dev`

Deployed to github pages on push to prod - https://natzha.github.io/spotify/

include .env in base directory with the following
```
VITE_SPOTIFY_CLIENT_ID
VITE_SPOTIFY_CLIENT_SECRET
VITE_SPOTIFY_REDIRECT_URI
```

# TODO
- given the top 5-10 songs, find a similar public playlist

#### Stats Page
- sort by artists
- sort by popularity
- do they hard listen to one artist or many artists? how many songs from the same artist - pie chart?
- do thye like listening to albums or individual songs? how many songs from the same album
- how genre diverse are they? - use artist genre
- popularity as a dot chart

#### Later
- server
- scrobbling
