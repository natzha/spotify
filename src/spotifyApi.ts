import { checkExpiryPKCE } from "./auth";

export async function fetchWebApi(endpoint: string, method: string, body: string, token: string) {
    const options: RequestInit = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
    }

    // Only include the body if the method is not GET
    if (method !== 'GET' && body) {
        options.body = JSON.stringify(body);
    }

    const result = await fetch(`https://api.spotify.com/${endpoint}`, options);
    return await result.json();
}

// Call Web API with the access token we got from https://accounts.spotify.com/api/token
export async function fetchProfile(accessToken: AccessToken) {
    accessToken = await checkExpiryPKCE(accessToken);
    return (await fetchWebApi(
        "v1/me",
        "GET",
        "",
        accessToken.access_token,
    ));
}

// Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
export async function getTop(accessToken: AccessToken, type: string,
    time_range: string, limit: number, offset: number = 0) {
    accessToken = await checkExpiryPKCE(accessToken);
    if (limit > 50 || limit < 1) {
        console.log("Warning: limit must be between 1-50, setting default to 10");
        limit = 10;
    }
    return (await fetchWebApi(
        `v1/me/top/${type}?time_range=${time_range}&limit=${limit}&offset=${offset}`,
        "GET",
        "",
        accessToken.access_token,
    ));
}

export async function getTopTracksData(accessToken: AccessToken, numItems: number,
    numDuration: number) {
    const max = 50;
    const offset = Math.floor(numItems / max);
    const limit = numItems % max;

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

    var topTracks: SpotifyApi.UsersTopTracksResponse;
    var tracks: any = [];
    for (let i = 0; i <= offset; i++) {
        if (i < offset) {
            topTracks = await getTop(accessToken, "tracks", duration, max, i * max);
        } else {
            if (limit == 0 && i == offset) {
                continue;
            } else {
                topTracks = await getTop(accessToken, "tracks", duration, limit, offset * max);
            }
        }
        tracks = tracks.concat(topTracks.items);
    }
    return tracks;
}


export async function getTopArtistsData(accessToken: AccessToken, numItems:
    number, numDuration: number) {
    const max = 50;
    const offset = Math.floor(numItems / max);
    const limit = numItems % max;

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

    var topArtists: SpotifyApi.UsersTopArtistsResponse;
    var artists: any = [];
    for (let i = 0; i <= offset; i++) {
        if (i < offset) {
            topArtists = await getTop(accessToken, "artists", duration, max, i * max);
        } else {
            if (limit == 0 && i == offset) {
                continue;
            } else {
                topArtists = await getTop(accessToken, "artists", duration, limit, offset * max);
            }
        }
        artists = artists.concat(topArtists.items);
    }

    return artists;
}

export async function getBrowseCategories(accessToken: AccessToken, categoryId: string) {
    accessToken = await checkExpiryPKCE(accessToken);
    return (await fetchWebApi(
        `v1/browse/categories/${categoryId}`,
        "GET",
        "",
        accessToken.access_token,
    ));
}


// get playlist
export async function getPlaylist(accessToken: AccessToken, playlistId: string) {
    accessToken = await checkExpiryPKCE(accessToken);
    return (await fetchWebApi(
        `v1/playlists/${playlistId}?market=US`,
        "GET",
        "",
        accessToken.access_token,
    ));
}

// get tracks from playlist
export async function getPlaylistTracks(token: string, playlistId: string,
    limit: number = 10, offset: number = 0) {
    return (await fetchWebApi(
        `v1/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
        "GET",
        "",
        token,
    ));
}

// get tracks from playlist
export async function getPlaylistTracksData(token: string, playlistId: string,
    numItems: number) {
    const max = 50;
    const offset = Math.floor(numItems / max);
    const limit = numItems % max;

    var playlistObject;
    var trackList: Track[] = [];
    for (let i = 0; i <= offset; i++) {
        if (i < offset) {
            playlistObject = await getPlaylistTracks(token, playlistId, max, i * max);
        } else {
            if (limit == 0 && i == offset) {
                continue;
            } else {
                playlistObject = await getPlaylistTracks(token, playlistId, limit, offset * max);
            }
        }
        playlistObject.items.map((item: any) => item.track)
        trackList = trackList.concat(playlistObject.items.map((item: any) => item.track));
    }

    return trackList;
}

// get new releases
export async function getNewReleases(accessToken: AccessToken, limit: number = 10,
    offset: number = 0, locale: string = "en-US"): Promise<NewReleasesResponse> {
    accessToken = await checkExpiryPKCE(accessToken);
    if (limit > 50 || limit < 1) {
        console.log("Warning: limit must be between 1-50, setting default to 10");
        limit = 10;
    }
    return (await fetchWebApi(
        `v1/browse/new-releases?offset=${offset}&limit=${limit}&locale=${locale}`,
        "GET",
        "",
        accessToken.access_token,
    ));
}

export async function getNewReleasesData(accessToken: AccessToken, numItems:
    number): Promise<Album[]> {
    const max = 50;
    const offset = Math.floor(numItems / max);
    const limit = numItems % max;

    var newAlbumReleases: NewReleasesResponse;
    var albumsList: Album[] = [];
    for (let i = 0; i <= offset; i++) {
        if (i < offset) {
            newAlbumReleases = await getNewReleases(accessToken, max, i * max);
        } else {
            if (limit == 0 && i == offset) {
                continue;
            } else {
                newAlbumReleases = await getNewReleases(accessToken, limit, offset * max);
            }
        }
        albumsList = albumsList.concat(newAlbumReleases.albums.items);
    }
    return albumsList;
}

// get artist by id
export async function getArtist(accessToken: AccessToken, id: string) {
    accessToken = await checkExpiryPKCE(accessToken);
    return (await fetchWebApi(
        `v1/artists?id=${id}`,
        "GET",
        "",
        accessToken.access_token,
    ));
}
