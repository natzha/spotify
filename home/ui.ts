export function createTopListSection(sectionId: string, listId: string, sectionTitle: string, onChangeAction: any) {
    // Create new album releases section
    const section = document.createElement('section');
    section.id = sectionId;
    section.className = "standard-section";

    // Create title
    const heading = document.createElement('h2');
    heading.innerHTML = sectionTitle;
    section.appendChild(heading);

    // slider all div
    const sliderDiv = document.createElement("div");
    sliderDiv.id = "slider-div";

    // duration slider
    const sliderDurationDiv = document.createElement("div");
    sliderDurationDiv.innerHTML = "How Long Ago: <span class='slider-duration-counter" + sectionId + "'></span>";
    sliderDurationDiv.className = "slider-holder"
    const sliderDuration = document.createElement("input");
    sliderDuration.type = "range";
    sliderDuration.min = "1";
    sliderDuration.max = "3";
    sliderDuration.value = "1";
    sliderDuration.id = "slider-duration";

    // number of items slider
    const sliderNumItemsDiv = document.createElement("div");
    sliderNumItemsDiv.innerHTML = "Show Max Number of Items: <span class='slider-num-items-counter" + sectionId + "'></span>";
    sliderNumItemsDiv.className = "slider-holder"
    const sliderNumItems = document.createElement("input");
    sliderNumItems.type = "range";
    sliderNumItems.min = "10";
    sliderNumItems.max = "200";
    sliderNumItems.value = "10";
    sliderNumItems.id = "slider-num-items";

    // duration event listener
    sliderDuration.addEventListener("change", () => {
        onChangeAction(Number(sliderNumItems.value), Number(sliderDuration.value));

        const displayCounterElements = document.querySelectorAll(".slider-duration-counter" + sectionId);
        displayCounterElements.forEach((element) => {
            var duration = "";
            switch (sliderDuration.value) {
                case "1": {
                    duration = "Past Month"
                    break;
                }
                case "2": {
                    duration = "Past 6 Months"
                    break;
                }
                case "3": {
                    duration = "Past Year"
                    break;
                }
                default: {
                    duration = "Past Month"
                    break;
                }
            };
            (element as HTMLElement).innerText = duration;
        });
    });

    // num items event listener
    sliderNumItems.addEventListener("change", () => {
        onChangeAction(Number(sliderNumItems.value), Number(sliderDuration.value));

        const displayCounterElements = document.querySelectorAll(".slider-num-items-counter" + sectionId);
        displayCounterElements.forEach((element) => {
            (element as HTMLElement).innerText = sliderNumItems.value;
        });
    });


    sliderDurationDiv.appendChild(sliderDuration);
    sliderNumItemsDiv.appendChild(sliderNumItems);
    sliderDiv.appendChild(sliderDurationDiv);
    sliderDiv.appendChild(sliderNumItemsDiv);
    section.appendChild(sliderDiv);

    // Create list
    const htmlList = document.createElement('ul');
    htmlList.id = listId;
    htmlList.className = "standard-list";
    section.appendChild(htmlList);
    document.body.appendChild(section);

    // trigger a slider event
    sliderNumItems.dispatchEvent(new Event('change'));
    sliderDuration.dispatchEvent(new Event('change'));
}


export function createListSection(sectionId: string, listId: string, sectionTitle: string, onChangeAction: any) {
    // Create new album releases section
    const section = document.createElement('section');
    section.id = sectionId;
    section.className = "standard-section";

    // Create title
    const heading = document.createElement('h2');
    heading.innerHTML = sectionTitle;
    section.appendChild(heading);

    // slider all div
    const sliderDiv = document.createElement("div");
    sliderDiv.id = "slider-div";

    // number of items slider
    const sliderNumItemsDiv = document.createElement("div");
    sliderNumItemsDiv.innerHTML = "Show Max Number of Items: <span class='slider-num-items-counter" + sectionId + "'></span>";
    sliderNumItemsDiv.className = "slider-holder"
    const sliderNumItems = document.createElement("input");
    sliderNumItems.type = "range";
    sliderNumItems.min = "10";
    sliderNumItems.max = "200";
    sliderNumItems.value = "10";
    sliderNumItems.id = "slider-num-items";

    // num items event listener
    sliderNumItems.addEventListener("change", () => {
        onChangeAction(Number(sliderNumItems.value));

        const displayCounterElements = document.querySelectorAll(".slider-num-items-counter" + sectionId);
        displayCounterElements.forEach((element) => {
            (element as HTMLElement).innerText = sliderNumItems.value;
        });
    });


    sliderNumItemsDiv.appendChild(sliderNumItems);
    sliderDiv.appendChild(sliderNumItemsDiv);
    section.appendChild(sliderDiv);

    // Create list
    const htmlList = document.createElement('ul');
    htmlList.id = listId;
    htmlList.className = "standard-list"
    section.appendChild(htmlList);
    document.body.appendChild(section);

    // trigger a slider event
    sliderNumItems.dispatchEvent(new Event('change'));
}


export function populateAlbums(listId: string, albums: Album[]): void {
    const albumList = document.getElementById(listId) as HTMLUListElement;
    albumList.innerHTML = "";

    albums?.map(album => {
        const listItem = document.createElement("li");

        // Create span to display linked album image - spotify provides 3 images sizes
        const albumImageDiv = document.createElement("div");
        const albumImageLink = document.createElement("a");
        const albumImage = document.createElement("img");
        albumImage.src = album.images[0].url;
        albumImage.width = album.images[0].width;
        albumImage.height = album.images[0].height;
        albumImageLink.id = "album-image";
        albumImageLink.href = album.external_urls.spotify;
        albumImageLink.appendChild(albumImage);
        albumImageDiv.id = "album-image-div";
        albumImageDiv.className = "standard-image";
        albumImageDiv.appendChild(albumImageLink);

        // Create a span to display the artist names
        const artistList = document.createElement("div");
        const artistNames = album.artists.map(artist => {
            const artistNameAndLink = document.createElement("a");
            artistNameAndLink.id = "artist-name";
            artistNameAndLink.href = artist.external_urls.spotify;
            artistNameAndLink.textContent = " " + artist.name;
            return artistNameAndLink;
        });
        artistList.id = "artist-list";
        artistList.innerHTML += artistNames.map(link => link.outerHTML);

        // Create a span to display the album name
        const albumName = document.createElement("a");
        albumName.id = "album-name";
        albumName.href = album.external_urls.spotify;
        albumName.textContent = album.name;

        // Create a span to display the album name
        const albumReleaseDate = document.createElement("div");
        albumReleaseDate.id = "album-release-date";
        albumReleaseDate.textContent = "Released: " + album.release_date;

        // store all text info: title, artists, album
        const albumInfo = document.createElement("div");
        albumInfo.id = "album-info";
        albumInfo.appendChild(albumName);
        albumInfo.appendChild(albumReleaseDate);
        albumInfo.append(artistList);

        // Append the track link and artist names to the list item
        listItem.appendChild(albumImageDiv);
        listItem.appendChild(albumInfo);

        // Append the list item to the track list
        albumList.appendChild(listItem);

    });
}

export function populateArtists(listId: string, artists: SpotifyApi.ArtistObjectFull[]): void {
    const artistList = document.getElementById(listId) as HTMLUListElement;
    artistList.innerHTML = "";

    artists?.map(artist => {
        const listItem = document.createElement("li");

        // Create span to display linked album image - spotify provides 3 images sizes
        const artistImageDiv = document.createElement("div");
        const artistImageLink = document.createElement("a");
        const artistImage = document.createElement("img");
        artistImage.src = artist.images[0].url;
        artistImage.width = artist.images[0].width!;
        artistImage.height = artist.images[0].height!;
        artistImageLink.id = "artist-image";
        artistImageLink.href = artist.external_urls.spotify;
        artistImageLink.appendChild(artistImage);
        artistImageDiv.id = "artist-image-div";
        artistImageDiv.className = "standard-image";
        artistImageDiv.appendChild(artistImageLink);

        // Create a span to display the artist names
        const artistNameDiv = document.createElement("div");
        const artistName = document.createElement("a");
        artistName.id = "artist-name";
        artistName.href = artist.external_urls.spotify;
        artistName.textContent = artist.name
        artistNameDiv.appendChild(artistName);

        // num followers
        const artistFollowersDiv = document.createElement("div");
        artistFollowersDiv.id = "artist-followers";
        artistFollowersDiv.textContent = "Followers: " + artist.followers.total.toString();

        // genres
        const artistGenreDiv = document.createElement("div");
        artistGenreDiv.id = "artist-genre";
        artistGenreDiv.textContent = "Genre: " + artist.genres[0];

        // popularity
        const artistPopularityDiv = document.createElement("div");
        artistPopularityDiv.id = "popularity";
        artistPopularityDiv.textContent = "Popularity: " + artist.popularity.toString();

        // artist info
        const artistInfo = document.createElement("div");
        artistInfo.appendChild(artistNameDiv);
        artistInfo.appendChild(artistFollowersDiv);
        if (artist.genres.length != 0) {
            artistInfo.appendChild(artistGenreDiv);
        };
        artistInfo.appendChild(artistPopularityDiv);

        listItem.appendChild(artistImageDiv);
        listItem.appendChild(artistInfo);

        artistList.appendChild(listItem);
    });
}

export function createProfile(): void {
    // Create profile section
    const profileSection = document.createElement('section');
    profileSection.id = 'profile';
    profileSection.className = 'standard-section';

    const profileHeading = document.createElement('h2');
    profileHeading.innerHTML = 'Logged in as <span class="displayName"></span>';
    profileSection.appendChild(profileHeading);

    const avatarSpan = document.createElement('span');
    avatarSpan.id = 'avatar';
    profileSection.appendChild(avatarSpan);

    const profileList = document.createElement('ul');
    const userInfo = [
        { label: 'User ID', id: 'id' },
        // { label: 'Email', id: 'email' },
        { label: 'Spotify URI', id: 'uri', isLink: true },
        { label: 'Link', id: 'url', isLink: true },
        { label: 'Profile Image', id: 'imgUrl' }
    ];

    userInfo.forEach(info => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${info.label}: `;
        const span = document.createElement(info.isLink ? 'a' : 'span');
        span.id = info.id;
        if (info.isLink) {
            (span as HTMLAnchorElement).href = '#'; // Cast to HTMLAnchorElement
        }
        listItem.appendChild(span);
        profileList.appendChild(listItem);
    });

    profileSection.appendChild(profileList);
    document.body.appendChild(profileSection);
}

// Update UI with profile data
export function populateUI(profile: UserProfile): void {
    // Select all spans with the class "displayName"
    const displayNameElements = document.querySelectorAll(".displayName");

    // Update the innerText of all these spans
    displayNameElements.forEach((element) => {
        (element as HTMLElement).innerText = profile.display_name;
    });

}

export function populateProfile(profile: UserProfile): void {
    if (profile.images[0]) {
        const profileImage = new Image(120, 120);
        profileImage.id = "profile-image";
        profileImage.className = "standard-image";
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar")!.appendChild(profileImage);
    }

    document.getElementById("id")!.innerText = profile.id;
    // document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? "(no profile image)";
}

export function populateTracks(listId: string, topTracks: Track[]): void {
    // Clear the list before populating
    const trackList = document.getElementById(listId) as HTMLUListElement;
    trackList.innerHTML = "";

    topTracks?.map(track => {
        const listItem = document.createElement("li");

        // Create span to display linked album image - spotify provides 3 images sizes
        const albumImageDiv = document.createElement("div");
        const albumImageLink = document.createElement("a");
        const albumImage = document.createElement("img");
        albumImage.src = track.album.images[0].url;
        albumImage.width = track.album.images[0].width;
        albumImage.height = track.album.images[0].height;
        albumImageLink.id = "album-image"
        albumImageLink.href = track.album.external_urls.spotify;
        albumImageLink.appendChild(albumImage);
        albumImageDiv.id = "album-image-div"
        albumImageDiv.className = "standard-image";
        albumImageDiv.appendChild(albumImageLink);

        const trackInfo = document.createElement("div");

        // Create a clickable link for the track name
        const trackNameAndLink = document.createElement("a");
        trackNameAndLink.id = "track-name"
        trackNameAndLink.href = track.external_urls.spotify;
        trackNameAndLink.textContent = track.name;

        // popularity
        const trackPopularityDiv = document.createElement("div");
        trackPopularityDiv.id = "popularity";
        trackPopularityDiv.textContent = "Popularity: " + track.popularity.toString();

        // Create a span to display the artist names
        const artistList = document.createElement("div");
        const artistNames = track.artists.map(artist => {
            // Create a clickable link for the artist name
            const artistNameAndLink = document.createElement("a");
            artistNameAndLink.id = "artist-name"
            artistNameAndLink.href = artist.external_urls.spotify;
            artistNameAndLink.textContent = " " + artist.name;
            return artistNameAndLink
        });
        artistList.id = "artist-list"
        artistList.innerHTML += artistNames.map(link => link.outerHTML);

        // Create a span to display the album name
        const albumName = document.createElement("a");
        albumName.id = "album-name"
        albumName.href = track.album.external_urls.spotify;
        albumName.textContent = track.album.name

        // store all text info: title, artists, album
        trackInfo.id = "track-info";
        trackInfo.appendChild(trackNameAndLink);
        // trackInfo.appendChild(albumName);
        trackInfo.appendChild(trackPopularityDiv);
        trackInfo.append(artistList);

        // Append the track link and artist names to the list item
        listItem.appendChild(albumImageDiv);
        listItem.appendChild(trackInfo);

        // Append the list item to the track list
        trackList.appendChild(listItem);
    });
}

// export function createSlider(onChangeAction: (this: HTMLInputElement, ev: Event) => any) {
//     const slider = document.createElement("input");
//     slider.type = "range";
//     slider.min = "10";
//     slider.max = "50";
//     slider.value = "25";
//     // slider.class = "slider";
//     slider.id = "range-slider";

//     slider.addEventListener("change", onChangeAction);
//     return slider;
// }

export function createStatsButton(): void {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    const statsButton = document.createElement("button");
    statsButton.id = "stats-button";
    statsButton.className = "button-class";
    statsButton.textContent = "See More Stats";
    statsButton.addEventListener("click", () => {
        window.location.href = "/spotify/stats/";
    });
    buttonContainer.appendChild(statsButton);
    document.body.appendChild(buttonContainer);
}
