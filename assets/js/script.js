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

$($).on('submit', function (e) {
  e.preventDefault();

  var searchVal = searchInput.val().trim();
  searchInput.val('');
});
