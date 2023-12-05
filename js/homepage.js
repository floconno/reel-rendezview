// these are the options for the fetch request
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYjA2NjM0ZDZlNmM2NThiZDdlYmFiNjMxY2QyNjJjMyIsInN1YiI6IjY1NWQ3ZTMxN2YyZDRhMDBhYzYzZDBlOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MAWl7LPPo9FuZ5GSBSiA97DeOPPrBrK1xMJEMjBUt34'
    }
};

// Function to generate and display movies based on the birth year
function generateAndDisplayMovies() {
    var birthYear = document.getElementById('birth-year').value;
    var apiUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_year=${birthYear}&sort_by=popularity.desc`;

    updateRecentSearches(birthYear); // Update local storage with recent search
    displayRecentSearches(); // this displays the recent search

    fetch(apiUrl, options) // Fetches the api data
        .then(response => {
            console.log("First Response");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            var movies = data.results;
            var movieContainerEl = document.getElementById('movie-container');
            movieContainerEl.innerHTML = ''; // Clear existing content
        // line 31-45 should provide the elements to display in the returning list along with the trailer button
            movies.forEach(movie => {
                var movieEl = document.createElement('div');
                movieEl.classList.add('movie');
                movieEl.classList.add('movie');
                var titleEl = document.createElement('h3');
                titleEl.textContent = movie.original_title;
                movieEl.appendChild(titleEl);
                var languageEl = document.createElement('p');
                languageEl.textContent = `Language: ${movie.original_language}`;
                movieEl.appendChild(languageEl);
                var overviewEl = document.createElement('p');
                overviewEl.textContent = movie.overview;
                movieEl.appendChild(overviewEl);
                var trailerButton = document.createElement('button');
                trailerButton.textContent = 'View Trailer';
                // this stores the movie title to allow functionality to every trailer button
                trailerButton.setAttribute('data-movie-title', movie.original_title);

                trailerButton.addEventListener('click', function() {
                    // Retrieve movie title or ID from the button
                    var movieTitle = this.getAttribute('data-movie-title');
                    fetchYouTubeFirstData(movieTitle + " " + movie.release_date.split('-')[0]);
                });

                movieEl.appendChild(trailerButton);
                movieContainerEl.appendChild(movieEl);
            });
        })
        .catch(function (error) {
            console.error('Fetch error:', error);
        });
}
// Update recent year search in local storage
function updateRecentSearches(year) {
    localStorage.setItem('recentYear', year); // Store the most recent year
}
// Display the most recent search year
function displayRecentSearches() {
    var recentContainerEl = document.querySelector('#recent-movie-container');
    var recentYear = localStorage.getItem('recentYear');

    // Display only if there is a recent year
    if (recentYear) {
        recentContainerEl.innerHTML = ''; // Clear existing content
        // Create and append the element to display the recent year
        var yearEl = document.createElement('div');
        yearEl.textContent = recentYear;
        yearEl.classList.add('recent-year');
        yearEl.onclick = () => {
            document.getElementById('birth-year').value = recentYear;
            generateAndDisplayMovies(); 
        };
        recentContainerEl.appendChild(yearEl);
    }
}
// Fetch movies for a specific year
function fetchMoviesForYear(year, container) {
    var apiUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_year=${year}&sort_by=popularity.desc`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYjA2NjM0ZDZlNmM2NThiZDdlYmFiNjMxY2QyNjJjMyIsInN1YiI6IjY1NWQ3ZTMxN2YyZDRhMDBhYzYzZDBlOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MAWl7LPPo9FuZ5GSBSiA97DeOPPrBrK1xMJEMjBUt34'
        }
    })
        .then(response => response.json())
        .then(data => {
            var movies = data.results;
            // Loop through movies and append them to the container
            for (let i = 0; i < Math.min(5, movies.length); i++) {
                var movie = movies[i];
                var movieEl = document.createElement('div');
                // ... create and append movie details as before ...
                container.appendChild(movieEl);
            }
        })
        .catch(function (error) {
            console.error('Fetch error:', error);
        });
}
// Event listener for DOMContentLoaded to display recent searches
document.addEventListener('DOMContentLoaded', displayRecentEntries);
// YouTube API related functions
var apiKey = 'AIzaSyCj0GhIQ-k8K-It9MQil4huikcndbOUDW4'; // Replace with your actual API key

function fetchYouTubeFirstData(movie) {
    var apiUrl = createYouTubeApiUrl(movie, apiKey);
        // Fetch first data from YouTube API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response error');
            }
            return response.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                var firstVideoId = data.items[0].id.videoId;
                fetchYouTubeSecondData(firstVideoId);
            } else {
                console.log("No results found");
            }
        })
        .catch(error => {
            console.error('There has been a problem with the fetch:', error);
        });
}

function fetchYouTubeSecondData(videoId) {
    openYouTubeVideo(videoId); // Open video in a popup window
}

function createYouTubeApiUrl(movie, apiKey) {
    var query = `${movie} Trailer`;
    return `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=AIzaSyCj0GhIQ-k8K-It9MQil4huikcndbOUDW4`;
}

function openYouTubeVideo(videoId) {
        // Open a popup window with the YouTube video
    var width = 640;
    var height = 390;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);

    var videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    var popupWindow = window.open(videoUrl, 'YouTube Video', `width=${width}, height=${height}, top=${top}, left=${left}`);

    if (window.focus) {
        popupWindow.focus();
    }
}

// Event listener for the form submission
document.querySelector('#birth-year-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var birthYear = document.getElementById('birth-year').value;
    updateRecentSearches(birthYear);
    displayRecentSearches();
    generateAndDisplayMovies(birthYear);
});
document.addEventListener('DOMContentLoaded', function() {
    displayRecentSearches();
});