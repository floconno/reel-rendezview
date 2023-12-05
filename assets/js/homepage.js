var yearFormEl = document.querySelector('#year-form');
var languageButtonsEl = document.querySelector('#language-buttons');
var nameInputEl = document.querySelector('#year');
var repoContainerEl = document.querySelector('#movies-container');
var movieSearchTerm = document.querySelector('#movie-search-term');

var formSubmitHandler = function (event) {
  event.preventDefault(); 
// submit event
  var year = nameInputEl.value.trim();
  }
  if (year) {
    getYearMovies(year);

    repoContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please enter a GitHub year');
  }
};

var buttonClickHandler = function (event) {
  var language = event.target.getAttribute('data-language');

  if (language) {
    getFeaturedMovies(language);

    repoContainerEl.textContent = '';
  }
};

var getYearMovies = function (year) {
  var apiUrl = 'https://api.github.com/users/' + year + '/Movies';

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayMovies(data, year);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
};

var getFeaturedMovies = function (language) {
  var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayMovies(data.items, language);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  });
};

var displayMovies = function (movies, searchTerm) {
  if (movies.length === 0) {
    repoContainerEl.textContent = 'No Movies found.';
    return;
  }

  movieSearchTerm.textContent = searchTerm;

  for (var i = 0; i < movies.length; i++) {
    var repoName = movies[i].owner.login + '/' + movies[i].name;

    var repoEl = document.createElement('div');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (movies[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + movies[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

yearFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);
