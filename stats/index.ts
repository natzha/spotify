import {
    checkExpiryPKCE, clientCredential, getCCStoredAccessTokens,
    getStoredAccessTokens, logout
} from '../src/auth';
import { createLoginButton, createLogoutButton } from '../src/global_ui';
import {
    getPlaylistTracksData, getTopArtistsData, getTopTracksData
} from '../src/spotifyApi';
import { isAnyPropertyEmpty } from '../src/utils';
import {
    createArtistGenreStats, createGeneralStats, createReleaseDateChart,
    createTrackArtistStats, populateArtistCountBar, populateGenreCountBar,
    populateReleaseDateBar, populateReleaseDateScatter
} from './ui';

// sort by artists
// sort by popularity

// do they hard listen to one artist or many artists? how many songs from the same artist - pie chart?
// do thye like listening to albums or individual songs? how many songs from the same album
// popularity against artists songs played as a dot chart


function anaylseGeneralStats(name: string, tracks) {
    const popularityInput = analyseTrackPopularity(tracks);
    createGeneralStats(name, popularityInput);
    return;
}

function analyseTrackArtists(name: string, tracks) {
    const artistTrackCount = getArtistTrackCount(tracks);

    // artist name as labels, track count as datavalues
    const labels = Object.keys(artistTrackCount);
    const dataValues = Object.values(artistTrackCount);

    // Sort the artists by the number of tracks in descending order
    const sortedData = labels.map((artist, index) => ({
        artist,
        tracks: dataValues[index]
    })).sort((a, b) => b.tracks - a.tracks);

    // Reorganize sorted data for Chart.js
    const sortedLabels = sortedData.map(item => item.artist).slice(0, 20);
    const sortedDataValues = sortedData.map(item => item.tracks).slice(0, 20);

    // store all data in usable
    const trackArtistStatsInput = {
        "most_freq_artist": sortedLabels[0],
        "most_freq_count": sortedDataValues[0],
        "artist_track_count": artistTrackCount,
        "labels": labels,
        "dataValues": dataValues,
        "sortedLabels": sortedLabels,
        "sortedDataValues": sortedDataValues,
    };

    // get how many tracks by the same artists and graph
    createTrackArtistStats(name, trackArtistStatsInput);
    populateArtistCountBar(name, trackArtistStatsInput);
}

function getArtistTrackCount(tracks) {
    const artistTrackCount = {};

    // Loop through each track
    tracks.forEach(track => {
        const artistsInTrack = new Set();

        track.artists.forEach(artist => {
            artistsInTrack.add(artist.name);
        });

        // Increment the count for each artist that appeared in the track
        artistsInTrack.forEach(artistName => {
            artistTrackCount[artistName] = (artistTrackCount[artistName] || 0) + 1;
        });
    });

    return artistTrackCount;
}

function analyseArtistGenres(name: string, artists) {
    const artistGenreCount = getArtistGenreCount(artists);

    // artist name as labels, track count as datavalues
    const labels = Object.keys(artistGenreCount);
    const dataValues = Object.values(artistGenreCount);

    // sort the genres by number of artists in descending order
    const sortedData = labels.map((genre, index) => ({
        genre,
        numArtists: dataValues[index]
    })).sort((a, b) => b.numArtists - a.numArtists);

    // Reorganize sorted data for Chart.js
    const sortedLabels = sortedData.map(item => item.genre).slice(0, 30);
    const sortedDataValues = sortedData.map(item => item.numArtists).slice(0, 30);

    // // Group remaining elements and sum their values
    // const remainingValues = sortedData.map(item => item.numArtists).slice(29);
    // const summedRestValue = remainingValues.reduce((accumulator, currentValue) => {
    //     return accumulator + currentValue
    // },0);

    // sortedLabels.push("Others");
    // sortedDataValues.push(summedRestValue);

    // store all data in usable
    const artistGenreStatsInput = {
        "most_freq_artist": sortedLabels[0],
        "most_freq_count": sortedDataValues[0],
        "artist_track_count": artistGenreCount,
        "labels": labels,
        "dataValues": dataValues,
        "sortedLabels": sortedLabels,
        "sortedDataValues": sortedDataValues,
    };

    // get how many tracks by the same artists and graph
    createArtistGenreStats(name, artistGenreStatsInput);
    populateGenreCountBar(name, artistGenreStatsInput);
}


function getArtistGenreCount(artists) {
    const artistGenreCount = {};

    // Loop through each artist
    artists.forEach(artist => {
        // Increment the count for the genre, artist can have multiple genres
        const genresInArtist = artist.genres;
        if (genresInArtist === undefined) { return; }

        // Increment the count for each artist that appeared in the track
        genresInArtist.forEach(genre => {
            artistGenreCount[genre] = (artistGenreCount[genre] || 0) + 1;
        });
        // artistGenreCount[genresInArtist] = (artistGenreCount[genresInArtist] || 0) + 1;
    });

    return artistGenreCount;
}

function analyseTrackPopularity(tracks) {
    //sort popularity and song
    const popularityArray = tracks.map(track => track.popularity);

    // get average popularity
    const average = array => array.reduce((a, b) => a + b) / array.length;
    const popularityAverage = average(popularityArray);

    // get maxx popularity
    const max = array => array.reduce(function (prev, current) {
        return (prev && prev.popularity > current.popularity) ? prev : current
    })
    const popularityMax = max(tracks);

    // get least popularity
    const min = array => array.reduce(function (prev, curr) {
        return prev.popularity < curr.popularity ? prev : curr;
    });
    const popularityMin = min(tracks);

    const popularityInput = {
        "average": popularityAverage,
        "track_max_popularity": popularityMax,
        "track_min_popularity": popularityMin
    }

    return popularityInput
}

// Function to parse the release date and return a Date object
function parseReleaseDate(releaseDate: string): Date {
    // catch if only year available, set to jan 1st
    if (releaseDate.length === 4) {
        return new Date(`${releaseDate}-01-01`);
    }
    return new Date(releaseDate);
}

// Utility function to parse release date and return the 'YYYY-MM' formatted period
function getMonthPeriod(releaseDate: string): string {
    const date = new Date(releaseDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
}

// Utility function to parse release date and return the 'YYYY' formatted period
function getYearPeriod(releaseDate: string): string {
    const date = new Date(releaseDate);
    const year = date.getFullYear();
    return `${year}`;
}

// Helper function to generate all years from the start year to the end year
function generateAllYears(startDate: string, endDate: string): string[] {
    const start = new Date(startDate).getFullYear(); // Get the start year
    const end = new Date(endDate).getFullYear(); // Get the end year
    const years: string[] = [];

    // Loop through each year between the start and end years (inclusive)
    for (let year = start; year <= end; year++) {
        years.push(year.toString());
    }

    // Add the current year if it's not already included
    const currentYear = new Date().getFullYear().toString();
    if (!years.includes(currentYear)) {
        years.push(currentYear);
    }

    return years;
}

function analyseTrackDateBar(name: string, tracks) {
    // Group the tracks by year and count the number of tracks in each year
    const groupedData = tracks.reduce((acc, track) => {
        const period = getYearPeriod(track.album.release_date);
        acc[period] = (acc[period] || 0) + 1;
        return acc;
    }, {});

    // Determine the date range for the graph (earliest and latest date)
    const allReleaseDates = tracks.map(track => track.album.release_date);
    const startDate = Math.min(...allReleaseDates.map(date => new Date(date).getTime()));
    const endDate = Math.max(...allReleaseDates.map(date => new Date(date).getTime()));

    // Generate all years between the earliest and latest release dates
    const allYears = generateAllYears(
        new Date(startDate).toISOString(),
        new Date(endDate).toISOString()
    );

    // For each year, either use the count from `groupedData` or set it to 0 if no tracks
    const labels = allYears.sort();
    const dataValues = labels.map(label => groupedData[label]);

    createReleaseDateChart(name);
    populateReleaseDateBar(name, labels, dataValues);
}

function analyseTrackDateScatter(tracks: Track[]) {
    const data = tracks.map((track) => ({
        x: parseReleaseDate(track.album.release_date).getTime(),
        y: 1,
        name: track.name,
        artists: track.artists.map(artist => artist.name).join(', '),
        date: track.album.release_date,
    }));
    console.log("data: ", data);

    createReleaseDateChart();
    populateReleaseDateScatter(data);
}

async function main() {
    var accessToken = getStoredAccessTokens();
    const accessTokenIsEmpty = isAnyPropertyEmpty(accessToken);

    // button to login if no access token
    if (accessTokenIsEmpty) {
        createLoginButton();

        // client crentials for when not signed in
        var clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        var clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
        await clientCredential(clientId, clientSecret);
        const ccAccessToken = getCCStoredAccessTokens();

        // friendmas stats
        const friendmasPlaylistTracksData = await getPlaylistTracksData(
            ccAccessToken.access_token, "7y74PC03oAdN1LVA5fYN2q", 50)
        anaylseGeneralStats("friendsmas", friendmasPlaylistTracksData);
        analyseTrackArtists("friendsmas", friendmasPlaylistTracksData);
        analyseTrackDateBar("friendsmas", friendmasPlaylistTracksData);

        return;
    } else {
        // check if tokens need to be refreshed and get latest
        accessToken = await checkExpiryPKCE(accessToken);
    }

    // get users top 250 songs and artists
    const topTracksData = await getTopTracksData(accessToken, 200, 3);
    console.log("top tracks: ", topTracksData);
    const topArtistsData = await getTopArtistsData(accessToken, 200, 3);
    console.log("top artsts: ", topArtistsData);

    anaylseGeneralStats("top-tracks", topTracksData);
    analyseTrackArtists("top-tracks", topTracksData);
    analyseArtistGenres("top-tracks", topArtistsData);
    analyseTrackDateBar("top-tracks", topTracksData);

    createLogoutButton(logout);
}


await main();