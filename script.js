
/* <form id="birth-year-form">
    <label for="birthYear">Enter Birth Year:</label>
    <input type="number" id="birth-year" name="birthYear"/>
    <button type="button" onclick="fetchMovies()">Generate Movies</button>
</form> */

var birthYearFormEl = document.querySelector('#birth-year-form');
var yearInputEl = document.querySelector('#birth-year');
var movieContainerEl = document.querySelector('#movie-container');

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjY2ZWRlNWUxNGIyYWEyMzM3YjJiN2UwZDc0NTZmNCIsInN1YiI6IjY1NWQ3ZjA3MjY2Nzc4MDEwYzFmNjYzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VN4gchLL4mhYBHwvjI8lalh-LWaIhHCltxCMT8ripp8'
    }
  };

var generateMovies = function fetchMovies() {
    var birthYear = document.getElementById('birth-year').value;
    var apiUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_year=${birthYear}&sort_by=popularity.desc`

    fetch(apiUrl, options)
        .then(response.json())
        .then(data => {
            var movies = data.results;

            for (let i = 0; i < 5; i++) {
                var movie = movies[i];
                var title = movie.title;
            }
        })
        .catch(function (error) {
            alert('Unable to generate movies');
        });
};

formSubmitHandler.addEventListener('submit', function(event) {
    event.preventDefault();

    var user = {
        birthYear
    };

    let userInputs = JSON.parse(localStorage.getItem('userInputs')) || [];
    userInputs.push(user);
    
    if (userInputs.length > 5) {
        userInputs = userInputs.slice(-5); 
    }

    localStorage.setItem('userInputs', JSON.stringify(userInputs));
    birthYear = '';
    displayUserInputs(userInputs);
});

function displayUserInputs(userInputs) {
    var lastFiveInputs = document.querySelector('#lastFiveInputs');
    lastFiveInputs.innerHTML = '';

    for (var user of userInputs) {
        var listItem = document.createElement('li');
        listItem.textContent = `Years Searched: ${user}`;
        lastFiveInputs.appendChild(listItem);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var userInputs = JSON.parse(localStorage.getItem('userInputs')) || [];
    displayUserInputs(userInputs);
});


