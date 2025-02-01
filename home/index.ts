import { isAnyPropertyEmpty } from "../src/utils";
import { createLoginButton, createLogoutButton } from "../src/global_ui";
import {
    getStoredAccessTokens, clientCredential, getCCStoredAccessTokens,
    checkExpiryPKCE, logout
} from '../src/auth';
import {
    fetchProfile, getNewReleasesData, getPlaylistTracksData, getTop, getTopArtistsData,
    getTopTracksData
} from '../src/spotifyApi';
import {
    createListSection, createTopListSection, populateArtists, populateTracks,
    populateProfile, populateAlbums, createProfile, populateUI, createStatsButton
} from './ui';

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
        createListSection("new-album-releases-section", "new-releases-list",
            "Latest Album Releases", populateAlbumOnChangeEvent);
        createListSection("friendmas-section", "friendmas-list",
            "Friendmas Playlist", populateFriendmasPlaylistOnChangeEvent);

        // try {
        //     createListSection("top-global-tracks-section", "top-50-tracks", 
        //          "Top Global Tracks", populateGlobalTracksOnChangeEvent);
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
        createTopListSection("top5", "track-list", "Your Top Songs",
            populateTracksOffsetOnChangeEvent);
        createTopListSection("user-top-artists-section", "user-top-artists-list",
            "Your Top Artists", populateArtistOffsetOnChangeEvent);

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
    const friendmasPlaylistTracksData = await getPlaylistTracksData(
        ccAccessToken.access_token, "7y74PC03oAdN1LVA5fYN2q", numItems);
    populateTracks("friendmas-list", friendmasPlaylistTracksData);
}

var numItemsConst = 20
var allTracks: any = [];
var allArtists: any = [];
var allTracks: any = [];
var allTracks: any = [];

async function populateTracksOffsetOnChangeEvent(offset: number, numDuration: number) {
    const accessToken = getStoredAccessTokens();
    var duration = "";
    switch (numDuration) {
        case 1: {
            duration = "short_term"
            break;
        }
        case 2: {
            duration = "medium_term"
            break;
        }
        case 3: {
            duration = "long_term"
            break;
        }
        default: {
            duration = "short_term"
            break;
        }
    }

    const topTracks = await getTop(accessToken, "tracks", duration, numItemsConst, offset * numItemsConst);
    allTracks = allTracks.concat(topTracks.items);
    populateTracks("track-list", allTracks);
}

async function populateArtistOffsetOnChangeEvent(offset: number, numDuration: number) {
    const accessToken = getStoredAccessTokens();
    var duration = "";
    switch (numDuration) {
        case 1: {
            duration = "short_term"
            break;
        }
        case 2: {
            duration = "medium_term"
            break;
        }
        case 3: {
            duration = "long_term"
            break;
        }
        default: {
            duration = "short_term"
            break;
        }
    }
    const topArtists = await getTop(accessToken, "artists", duration, numItemsConst, offset * numItemsConst);
    allArtists = allArtists.concat(topArtists.items);
    populateArtists("user-top-artists-list", allArtists);
}

async function populateAlbumOffsetOnChangeEvent(numItems: number) {
    const ccAccessToken = getCCStoredAccessTokens();
    const albumsList = await getNewReleasesData(ccAccessToken, numItems);
    populateAlbums("new-releases-list", albumsList);
}

async function populateFriendmasPlaylistOffsetOnChangeEvent(numItems: number) {
    const ccAccessToken = getCCStoredAccessTokens();
    const friendmasPlaylistTracksData = await getPlaylistTracksData(
        ccAccessToken.access_token, "7y74PC03oAdN1LVA5fYN2q", numItems);
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