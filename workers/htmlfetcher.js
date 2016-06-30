var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var path = require('path');
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

// empty array of URLs to be added
// read list of URLs using readListOfUrls
  // for each URL, check if URL is in archive, using isUrlArchived
    // if exists
      // do nothing
    // if does not exist
      // push to array of URLs
// use downloadURLs of array of URLs