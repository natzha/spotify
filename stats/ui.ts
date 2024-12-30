import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-luxon'; // Import and register Luxon date adapter

// Register all the necessary components of Chart.js (including the time scale)
Chart.register(...registerables);

export function createGeneralStats(name, popularityInput) {
    const generalStatsDiv = document.createElement("div");
    generalStatsDiv.id = name + "-general-stats-div";

    const popularityDiv = createGeneralPopularity(name, popularityInput);

    generalStatsDiv.appendChild(popularityDiv);
    document.body.appendChild(generalStatsDiv);
}

export function createTrackArtistStats(name: string, trackArtistStatsInput) {
    const trackArtistStatsDiv = document.createElement("div");
    trackArtistStatsDiv.id = name + "-track-artist-stats-div";

    var textCont = "";
    textCont += "Most Frequent Artist: " + trackArtistStatsInput.most_freq_artist,
        textCont += " who you listened to " + trackArtistStatsInput.most_freq_count + " songs";
    trackArtistStatsDiv.textContent = textCont;

    document.body.appendChild(trackArtistStatsDiv);
    return trackArtistStatsDiv
}

export function createGeneralPopularity(name, popularityInput) {

    const generalPopularityDiv = document.createElement("div");
    generalPopularityDiv.id = name + "-general-popularity-div";

    const popAvg = document.createElement("div");
    var exclaim = ". ";
    if (popularityInput.average > 75) {
        exclaim += "Wow! You're such a trend follower.";
    } else if (popularityInput.average > 50 && popularityInput.average < 75) {
        exclaim += "Damn! You're so basic.";
    } else if (popularityInput.average > 25 && popularityInput.average < 50) {
        exclaim += "Nice! You like you're indie songs more than the trendy ones.";
    } else {
        exclaim += "Okay, we get it you're not like the other girls.";
    }
    popAvg.textContent = "Your songs have a popularity of " + popularityInput.average + exclaim;

    // max popularity
    const popMax = document.createElement("div");
    popMax.textContent = "Your most popular song is with a popularity of " +
        popularityInput.track_max_popularity.popularity + " is ";
    const popMaxLink = document.createElement("a");
    popMaxLink.href = popularityInput.track_max_popularity.external_urls.spotify;
    popMaxLink.textContent = popularityInput.track_max_popularity.name;
    popMax.appendChild(popMaxLink);

    // min popularity
    const popMin = document.createElement("div");
    popMin.textContent = "Your least popular song is with a popularity of " +
        popularityInput.track_min_popularity.popularity + " is ";
    const popMinLink = document.createElement("a");
    popMinLink.href = popularityInput.track_min_popularity.external_urls.spotify;
    popMinLink.textContent = popularityInput.track_min_popularity.name;
    popMin.appendChild(popMinLink);

    generalPopularityDiv.appendChild(popAvg);
    generalPopularityDiv.appendChild(popMax);
    generalPopularityDiv.appendChild(popMin);

    return generalPopularityDiv;
}

export function createArtistCountChart(name: string) {
    const chartContainer = document.createElement("div");
    chartContainer.className = "chart-container";
    const chartCanvas = document.createElement("canvas");
    chartCanvas.id = name + "-artist-count-canvas";

    const chartDiv = document.createElement("div");
    chartDiv.id = name + "artist-count-div";
    chartDiv.className = "artist-count-class";

    // const trackName = document.createElement("p");
    // trackName.id = "artist-count-track-name";
    // const trackArtists = document.createElement("p");
    // trackArtists.id = "artist-count-track-artist";
    // const trackDate = document.createElement("p");
    // trackDate.id = "artist-count-track-date";

    // chartDiv.appendChild(trackName);
    // chartDiv.appendChild(trackArtists);
    // chartDiv.appendChild(trackDate);

    chartContainer.appendChild(chartCanvas)
    document.body.appendChild(chartContainer)
    document.body.appendChild(chartDiv);
}

export function populateArtistCountBar(name: string, trackArtistStatsInput) {
    const ctx = document.getElementById(name + '-artist-count-canvas') as HTMLCanvasElement;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: trackArtistStatsInput.sortedLabels, // X-axis: artist names
            datasets: [{
                label: 'Number of Tracks',
                data: trackArtistStatsInput.sortedDataValues, // Y-axis: number of tracks per artist
                backgroundColor: '#1DB954', // Bar color
                borderColor: '#1DB954', // Bar border color
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            // responsive: true,
            scales: {
                y: {
                    beginAtZero: true, // Start the Y-axis at 0
                    ticks: {
                        stepSize: 1 // Each tick step is 1 for better readability
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: name.toUpperCase() + ': Number of Tracks for each Artist',
                    font: {
                        size: 20, // Set font size for the title
                        weight: 'bold', // Set font weight (bold)
                    },
                    padding: {
                        top: 10, // Padding above the title
                        bottom: 10, // Padding below the title
                    },
                },
                legend: {
                    display: true // Display the chart legend
                }
            }
        }
    });
}


export function createReleaseDateChart(name: string) {
    const chartContainer = document.createElement("div");
    chartContainer.className = "chart-container";
    const chartCanvas = document.createElement("canvas");
    chartCanvas.id = name + "-canvas";

    const chartDiv = document.createElement("div");
    chartDiv.id = name + "-div";
    chartDiv.className = name + "-class";

    const trackName = document.createElement("p");
    trackName.id = name + "-track-name";
    const trackArtists = document.createElement("p");
    trackArtists.id = name + "-track-artist";
    const trackDate = document.createElement("p");
    trackDate.id = name + "-track-date";

    chartDiv.appendChild(trackName);
    chartDiv.appendChild(trackArtists);
    chartDiv.appendChild(trackDate);

    chartContainer.appendChild(chartCanvas);
    document.body.appendChild(chartContainer);
    document.body.appendChild(chartDiv);
}

export function populateReleaseDateBar(name: string, labels, dataValues) {
    const ctx = document.getElementById(name + "-canvas") as HTMLCanvasElement;
    const chart = new Chart(ctx, {
        type: 'bar', // Change chart type to 'bar' for column graph
        data: {
            labels: labels, // Labels for the x-axis (years)
            datasets: [{
                label: 'Tracks Count',
                data: dataValues, // Number of tracks per year
                backgroundColor: '#1DB954', // Bar color
                borderColor: '#1DB954', // Bar border color
                borderWidth: 1,
            }],
        },
        options: {
            maintainAspectRatio: false,
            // responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Tracks',
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: name.toUpperCase() + ': Number of Tracks Released by Year',
                    font: {
                        size: 20,
                        weight: 'bold',
                    },
                    padding: {
                        top: 10,
                        bottom: 10,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const count = context.raw;
                            return `${label}: ${count} track${count !== 1 ? 's' : ''}`;
                        },
                    },
                },
            },
        },
    });
}

export function populateReleaseDateScatter(data) {
    const ctx = document.getElementById('release-date-canvas') as HTMLCanvasElement;
    const toolTip = document.getElementById('release-date-div') as HTMLDivElement;
    const chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: "Tracks",
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                pointRadius: 5,
                pointHoverRadius: 8,
            }],
        },
        options: {
            maintainAspectRatio: false,
            // responsive: true,
            scales: {
                x: {
                    type: 'time', // Use time scale for release dates
                    time: {
                        unit: 'month', // Adjust the granularity of time
                        tooltipFormat: 'll', // Tooltip format
                    },
                    title: {
                        display: true,
                        text: 'Release Date',
                    },
                },
                y: {
                    min: 0,
                    max: 1,
                    ticks: {
                        display: false, // Hide y-axis since we only care about the points
                    },
                },
            },
            plugins: {
                tooltip: {
                    enabled: false, // Disable the default tooltip
                    external: (context) => {
                        const tooltipEl = document.getElementById(
                            'release-date-div') as HTMLElement;
                        const tooltipName = document.getElementById(
                            'release-date-track-name') as HTMLElement;
                        const tooltipArtists = document.getElementById(
                            'release-date-track-artist') as HTMLElement;
                        const tooltipDate = document.getElementById(
                            'release-date-track-date') as HTMLElement;

                        // Check if there are any data points to show
                        const dataPoints = context.tooltip.dataPoints;
                        if (dataPoints && dataPoints.length > 0) {
                            // The data point being hovered
                            const dataPoint = dataPoints[0];
                            // Get the track from the data array using the index
                            const track = data[dataPoint.dataIndex];

                            if (track) {
                                tooltipName.innerHTML = `Track: ${track.name}`;
                                tooltipArtists.innerHTML = `Artists: ${track.artists}`;
                                tooltipDate.innerHTML = `Release Date: ${track.date}`;

                                tooltipEl.style.display = 'block';
                                tooltipEl.style.left = `${context.chart.canvas.offsetLeft + dataPoint.element.x - tooltipEl.offsetWidth / 2}px`;
                                tooltipEl.style.top = `${context.chart.canvas.offsetTop + dataPoint.element.y - tooltipEl.offsetHeight - 10}px`;
                            } else {
                                console.error('Track not found for index:', dataPoint.dataIndex);
                            }
                        } else {
                            // Hide tooltip if no valid data point
                            tooltipEl.style.display = 'none';
                        }
                    },
                },
            },
            interaction: {
                mode: 'nearest',
                intersect: false,
            },
        }
    });

    // Hide the tooltip when mouse leaves the chart
    ctx.addEventListener('mouseleave', () => {
        toolTip.style.display = 'none';
    });
}




