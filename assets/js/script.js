// JQuery Selectors
var searchInput = $('#search-city');

$($).on('submit', function (e) {
  e.preventDefault();
  var searchVal = searchInput.val().trim();
  console.log(searchVal);
  searchInput.val('');
});
