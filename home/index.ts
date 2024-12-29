import { isAnyPropertyEmpty } from "../src/utils";
import { fetchProfile, getNewReleasesData, getPlaylistTracksData, getTopArtistsData, getTopTracksData } from '../src/spotifyApi';
import {
    createListSection,
    createTopListSection,
    populateArtists,
    populateTracks,
    populateProfile,
    populateAlbums,
    createProfile, populateUI,
    createStatsButton
} from './ui';
import { createLoginButton, createLogoutButton } from "../src/global_ui";

import { getStoredAccessTokens, clientCredential, getCCStoredAccessTokens, checkExpiryPKCE, logout } from '../src/auth';
// import { fetchProfile, getTop, getNewReleases, getPlaylistTracks } from '../src/spotifyApi';
// import { storeAccessTokens, getStoredAccessTokens, getCCStoredAccessTokens, clientCredential, checkExpiryPKCE } from '../src/auth';

// /////////////// TEST
// const accessTEST = {
//     access_token: null,
//     expires_in: 10,
//     refresh_token: null,
//     scope: null, 
//     token_type: null,
// }

// storeAccessTokens(accessTEST);
async function main() {

    // get access tokens
    var accessToken = getStoredAccessTokens();
    const accessTokenIsEmpty = isAnyPropertyEmpty(accessToken);

    // button to login if no access token
    if (accessTokenIsEmpty) {
        createLoginButton();

        // client crentials for when not signed in
        var clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        var clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
        await clientCredential(clientId, clientSecret);
        createListSection("new-album-releases-section", "new-releases-list", "Latest Album Releases", populateAlbumOnChangeEvent);
        createListSection("friendmas-section", "friendmas-list", "Friendmas Playlist", populateFriendmasPlaylistOnChangeEvent);

        // try {
        //     createListSection("top-global-tracks-section", "top-50-tracks", "Top Global Tracks", populateGlobalTracksOnChangeEvent);
        // } catch {
        //     console.log("Error: Failed to create list for Top Global Tracks");
        // }
        return;

    } else {
        // check if tokens need to be refreshed and get latest
        accessToken = await checkExpiryPKCE(accessToken);

        // profile section
        const profile = await fetchProfile(accessToken);
        createProfile();
        populateProfile(profile);

        // top tracks and artists sections
        createTopListSection("top5", "track-list", "Your Top Songs", populateTracksOnChangeEvent);
        createTopListSection("user-top-artists-section", "user-top-artists-list", "Your Top Artists", populateArtistOnChangeEvent);

        // make all profile names show
        populateUI(profile);
        createStatsButton();
        createLogoutButton(logout);
    }
}



//////////////////////////////////////////////
///////////// on change events ///////////////
//////////////////////////////////////////////
async function populateTracksOnChangeEvent(numItems: number, numDuration: number) {
    const accessToken = getStoredAccessTokens();
    const tracks = await getTopTracksData(accessToken, numItems, numDuration);
    populateTracks("track-list", tracks);
}

async function populateArtistOnChangeEvent(numItems: number, numDuration: number) {
    const accessToken = getStoredAccessTokens();
    const artists = await getTopArtistsData(accessToken, numItems, numDuration);
    populateArtists("user-top-artists-list", artists);
}

async function populateAlbumOnChangeEvent(numItems: number) {
    const ccAccessToken = getCCStoredAccessTokens();
    const albumsList = await getNewReleasesData(ccAccessToken, numItems);
    populateAlbums("new-releases-list", albumsList);
}

async function populateFriendmasPlaylistOnChangeEvent(numItems: number) {
    const ccAccessToken = getCCStoredAccessTokens();
    const friendmasPlaylistTracksData = await getPlaylistTracksData(ccAccessToken.access_token, "7y74PC03oAdN1LVA5fYN2q", numItems);
    populateTracks("friendmas-list", friendmasPlaylistTracksData);
}

// async function populateGlobalTracksOnChangeEvent(event: any) {
//     // the token from https://everynoise.com/worldbrowser.cgi since my token
//     // wouldnt display spotify owned editorial playlists
//     // https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api
//     try {
//         const token_spotify_global = "BQAiahDa9iawb4R-S3qipuy62HPqoHA9IjCrgkkFGfgfBFJ802GSll7YXWrfiqSEhR8GJk-PbJZYk5mwXVuBLjoNHbiqNFgvNiJci_Cj9F1o91GNKIY";
//         const top50SongsPlaylistTracks = await getPlaylistTracks(token_spotify_global, "37i9dQZEVXbNG2KDcFcKOF", event.target.value);
//         const top50SongsTracks: Track[] = top50SongsPlaylistTracks.items.map((item: any) => item.track);
//         populateTracks("top-50-tracks", top50SongsTracks)
//     } catch {
//         console.log("Error: failed to get Top Global Tracks");
//     }
// }

await main();