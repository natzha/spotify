import { getStoredAccessTokens, checkExpiryPKCE, getCCStoredAccessTokens, clientCredential } from "../src/auth";
import { getPlaylistTracksData, getTopArtistsData, getTopTracksData } from "../src/spotifyApi"
import { isAnyPropertyEmpty } from "../src/utils";
import { createLoginButton } from "../home/ui";
import { createArtistCountChart, createGeneralStats, createReleaseDateChart, populateArtistCountBar, populateReleaseDateBar, populateReleaseDateScatter } from "./ui";


// sort by artists
// sort by popularity

// do they hard listen to one artist or many artists? how many songs from the same artist - pie chart?
// do thye like listening to albums or individual songs? how many songs from the same album
// how genre diverse are they? - use artist genre
// popularity as a dot chart


//DONE
// do they like new songs or old songs <- use release date from album - column graph
// do they like indie songs or do they follow pop trends - average the popularity



function anaylseGeneralStats(name: string, tracks) {

    const popularityInput = analyseTrackPopularity(tracks);
    const trackArtistStatsInput = analyseTrackArtists(tracks);

    createGeneralStats(name, popularityInput, trackArtistStatsInput);

    const labels = Object.keys(trackArtistStatsInput.artist_track_count);
    const dataValues = Object.values(trackArtistStatsInput.artist_track_count);
    createArtistCountChart(name);
    populateArtistCountBar(name, labels, dataValues);
    console.log("analyse track artists3");
    return
}

function analyseTrackArtists(tracks) {
    const artistTrackCount = getArtistTrackCount(tracks);

    var maxTracks = 0;
    var maxArtist = "";

    // Find the artist with the maximum number of tracks
    for (let artist in artistTrackCount) {
        if (artistTrackCount[artist] > maxTracks) {
            maxTracks = artistTrackCount[artist];
            maxArtist = artist;
        }
    }

    console.log("artist to track: ", getArtistTrackCount(tracks));
    const trackArtistStatsInput = {
        "most_freq_artist": maxArtist,
        "most_freq_count": maxTracks,
        "artist_track_count": artistTrackCount,
    };




    return trackArtistStatsInput;
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

function analyseTrackPopularity(tracks) {
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
    const allYears = generateAllYears(new Date(startDate).toISOString(), new Date(endDate).toISOString());

    // For each year, either use the count from `groupedData` or set it to 0 if no tracks
    const labels = allYears.sort();  // Sort the years in ascending order
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
        const friendmasPlaylistTracksData = await getPlaylistTracksData(ccAccessToken.access_token, "7y74PC03oAdN1LVA5fYN2q", 50)
        anaylseGeneralStats("friendsmas", friendmasPlaylistTracksData);
        analyseTrackDateBar("friendsmas", friendmasPlaylistTracksData);

        return;
    } else {
        // check if tokens need to be refreshed and get latest
        accessToken = await checkExpiryPKCE(accessToken);
    }

    // get users top 250 songs and artists
    const topTracksData = await getTopTracksData(accessToken, 200, 3);
    const topArtistsData = await getTopArtistsData(accessToken, 200, 3);

    anaylseGeneralStats("top-tracks", topTracksData);
    analyseTrackDateBar("top-tracks", topTracksData);
}


await main();