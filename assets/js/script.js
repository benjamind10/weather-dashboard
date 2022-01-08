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
$($).on('submit', function (e) {
  e.preventDefault();

  let searchVal = searchInput.val().trim();
  if (!searchVal) {
    alert('please enter a city');
  } else {
    historyHandler(searchVal);
    searchInput.val('');
  }
});

function historyHandler(val) {
  if (cityList.indexOf(val) === -1) cityList.push(val);

  listHistory();
}

function listHistory() {
  searchHistory.empty();

  cityList.forEach(function (city) {
    let searchItem = $('<li class="list-group-item city-btn">');
    searchItem.attr('data-value', city);
    searchItem.text(city);
    searchHistory.prepend(searchItem);
  });

  localStorage.setItem('cities', JSON.stringify(cityList));
}

function startHistory() {
  if (localStorage.getItem('cities')) {
    cityList = JSON.parse(localStorage.getItem('cities'));
    let lastIndex = cityList.length - 1;
    // console.log(cityList);
    listHistory();
    // Display the last city viewed
    // if page is refreshed
    // if (cityList.length !== 0) {
    //   currentConditionsRequest(cityList[lastIndex]);
    //   weatherContent.removeClass('hide');
    // }
  }
}
