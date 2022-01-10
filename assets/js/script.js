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

// Initializes App
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
    showCurrent(searchVal);
    searchInput.val('');
  }
});

// Handles the clear history button
historyButton.on('click', function () {
  localStorage.clear();
  cityList = [];
  searchHistory.empty();
});

searchHistory.on('click', function (e) {
  let city = e.target.innerHTML;

  showCurrent(city);
});

// Will save the searches to the local array and display results on sidebar
function saveHistory(val) {
  let lowered = val.toLowerCase();
  if (cityList.indexOf(lowered) === -1) cityList.push(lowered);

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
  const queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${param}&units=imperial&appid=${keyAPI}`;

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
      let lon = r.coord.lon;
      let lat = r.coord.lat;

      // Calls the function that calculates UV Index & five day cast
      uvIndex(lon, lat);
      fiveDay(lon, lat);
    })
    .catch(function (e) {
      console.log(e);
      alert('Your request could not be complete');
    });
}

function uvIndex(lon, lat) {
  // Formats URL for uv call
  const queryUrl = `https://api.openweathermap.org/data/2.5/uvi?&lat=${lat}&lon=${lon}&appid=${keyAPI}`;

  // Performs the ajax fetch call
  $.ajax({
    url: queryUrl,
    method: 'GET',
  })
    .then(function (r) {
      indexUV.text(r.value);

      // This conditional will add background to the uv index depending on exposure
      if (indexUV.text() >= 8)
        indexUV.addClass('bg-danger text-white p-1 rounded');
      else if (indexUV.text() > 3 && indexUV.text() <= 7)
        indexUV.addClass('bg-warning text-white p-1 rounded');
      else indexUV.addClass('bg-success text-white p-1 rounded');
    })
    .catch(function (e) {
      console.log(e);
      alert('There was a problem with your request');
    });
}

function fiveDay(lon, lat) {
  // Format query URL for 5 day cast
  const queryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${keyAPI}`;

  fiveDayCast.removeClass('hide');

  $.ajax({
    url: queryUrl,
    method: 'GET',
  })
    .then(function (r) {
      fiveDayCast.empty();
      console.log(r);
      let data = r.daily;

      for (let i = 1; i < data.length - 2; i++) {
        let forecastDate = moment
          .unix(data[i].dt)
          .format('MM/DD/YYYY');

        let col = $(
          "<div class='col-12 col-md-6 col-lg forecast-day mb-3'>"
        );
        let card = $("<div class='card'>");
        let cardBody = $("<div class='card-body'>");
        let fDate = $("<h5 class='card-title'>");
        let fIcon = $('<img>');
        let temp = $("<p class='card-text mb-0'>");
        let humidity = $("<p class='card-text mb-0'>");

        fiveDayCast.append(col);
        col.append(card);
        card.append(cardBody);

        cardBody.append(fDate);
        cardBody.append(fIcon);
        cardBody.append(temp);
        cardBody.append(humidity);

        fIcon.attr(
          'src',
          'https://openweathermap.org/img/w/' +
            data[i].weather[0].icon +
            '.png'
        );

        fIcon.attr('alt', data[i].weather[0].main);
        fDate.text(forecastDate);
        temp.text(data[i].temp.day);
        temp.prepend('Temp: ');
        temp.append('&deg;F');
        humidity.text(data[i].humidity);
        humidity.prepend('Humidity: ');
        humidity.append('%');
      }
    })
    .catch(function (e) {
      console.log(e);
      alert('Your request could not be complete');
    });
}
