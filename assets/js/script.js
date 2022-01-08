// JQuery Selectors
let searchInput = $('#search-city');
let searchHistory = $('#search-history-list');
let cityButton = $('#search-city-button');
let historyButton = $('#clear-history');
let city = $('#current-city');
let temp = $('#current-temp');
let humidity = $('#current-humidity');
let windSpeed = $('#current-wind-speed');
let indexUV = $('#uv-index');
let wContent = $('#weather-content');

// Global Variables
const cityList = [];
let currentDate = new Date().toLocaleDateString();

// API Key
const keyAPI = '6a3fe9ad9cae721016566b17c55f3ba7';

// Handles the form submission when city is entered
$($).on('submit', function (e) {
  e.preventDefault();

  let searchVal = searchInput.val().trim();
  getConditions(searchVal);
  searchInput.val('');
});

function getConditions(searchVal) {
  let queryUrl =
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    searchVal +
    '&units=imperial&appid=' +
    keyAPI;

  if (!searchVal) {
    alert('You need to enter a city');
  } else {
    $.ajax({
      url: queryUrl,
      method: 'GET',
    }).then(function (response) {
      console.log(response);
      city.text(response.name);
      city.append("<small class='text-muted' id='current-date'>");
      $('#current-date').text('(' + currentDate + ')');
      city.append(
        "<img src='https://openweathermap.org/img/w/" +
          response.weather[0].icon +
          ".png' alt='" +
          response.weather[0].main +
          "' />"
      );
      temp.text(response.main.temp);
      temp.append('&deg;F');
      humidity.text(response.main.humidity + '%');
      windSpeed.text(response.wind.speed + 'MPH');

      let lat = response.coord.lat;
      let lon = response.coord.lon;

      let urlUV =
        'https://api.openweathermap.org/data/2.5/uvi?&lat=' +
        lat +
        '&lon=' +
        lon +
        '&appid=' +
        keyAPI;

      $.ajax({
        url: urlUV,
        metho: 'GET',
      }).then(function (response) {
        indexUV.text(response.value);
      });
    });
  }
}
