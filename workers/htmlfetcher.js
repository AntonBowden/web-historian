// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

// read the urls in sites.txt
archive.readListOfUrlsAsync().then(function(urls) {
  // download all urls that are not already archived
  archive.downloadUrlsAsync(urls);
});
