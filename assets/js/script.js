// JQuery Selectors
let searchInput = $('#search-city');
let searchHistory = $('#search-history-list');
let cityButton = $('#search-city-button');
let historyButton = $('#clear-history');
let fiveDayCast = $('#five-day-forecast');
let city = $('#current-city');
let temp = $('#current-temp');
let humidity = $('#current-humidity');
let windSpeed = $('#current-wind-speed');
let indexUV = $('#uv-index');
let wContent = $('#weather-content');

// Global Variables
let cityList = [];
let currentDate = moment().format('L');

// API Key
const keyAPI = '6a3fe9ad9cae721016566b17c55f3ba7';

$(function () {
  startHistory();
});

// Handles the form submission when city is entered
$(document).on('submit', function (e) {
  e.preventDefault();

  let searchVal = searchInput.val().trim();
  if (!searchVal) {
    alert('please enter a city');
  } else {
    saveHistory(searchVal);
    searchInput.val('');
  }
});

historyButton.on('click', function () {
  localStorage.clear();
  cityList = [];
  searchHistory.empty();
});

searchHistory.on('click', function (e) {
  console.log(e.target.innerHTML);
});

// Will save the searches to the local array and display results on sidebar
function saveHistory(val) {
  let lowered = val.toLowerCase();
  if (cityList.indexOf(val) === -1) cityList.push(lowered);

  listHistory();
}

function listHistory() {
  searchHistory.empty();

  cityList.forEach(function (city) {
    let searchItem = $('<li class="list-group-item city-btn">');
    searchItem.attr('data-value', city);
    let modedString = city.charAt(0).toUpperCase() + city.slice(1);
    searchItem.text(modedString);
    searchHistory.prepend(searchItem);
  });

  localStorage.setItem('cities', JSON.stringify(cityList));
}

function startHistory() {
  if (localStorage.getItem('cities')) {
    cityList = JSON.parse(localStorage.getItem('cities'));
    listHistory();
  }
}

function showCurrent(param) {
  // Formats the URL that we are using to query the API
  let queryUrl =
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    param +
    '&units=imperial&appid=' +
    keyAPI;

  // Fetch Data
  $.ajax({
    url: queryUrl,
    method: 'GET',
  })
    .then(function (r) {
      city.text(r.name);
      // Appends the current date after the city name
      city.append(' <span class="text-muted" id="date">');
      $('#date').text('(' + currentDate + ')');
      // Appends Icon to city name
      city.append(
        "<img src='https://openweathermap.org/img/w/" +
          r.weather[0].icon +
          ".png' alt='" +
          r.weather[0].main +
          "' />"
      );
      // This section controls the temp/humidity/windspeed display
      temp.text(r.main.temp);
      temp.append('&deg;F');
      humidity.text(r.main.humidity + '%');
      windSpeed.text(r.wind.speed + 'MPH');

      // Stores latitude and longitude for uv-index
      let lat = r.coord.lat;
      let lon = r.coord.lon;
    })
    .catch(function (r) {
      alert('Your request could not be complete');
    });

  uvIndex(lat, lon);
  fiveDayCast(lat, lon);
}

function uvIndex(lat, lon) {
  // Formats URL for uv call
  let queryUrl =
    'https://api.openweathermap.org/data/2.5/uvi?&lat=' +
    lat +
    '&lon=' +
    lon +
    '&appid=' +
    keyAPI;

  // Performs the ajax fetch call
  $.ajax({
    url: queryUrl,
    method: 'GET',
  }).then(function (r) {
    indexUV.text(r.value);
  });
}
