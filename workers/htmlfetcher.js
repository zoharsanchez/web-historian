var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var path = require('path');
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.


var htmlFetcher = function(urlArray) {
  for (var i = 0; i < urlArray.length; i++) {
    var url = urlArray[i];
    archive.isUrlArchived(url, function(exists, url) {      
      if (!exists) {
        archive.downloadUrls([url]);
      }
    });
  }
}; 

archive.readListOfUrls(function(data) {
  htmlFetcher(data);
});

// Write a script in workers/htmlfetcher.js that uses 
// the code in helpers/archive-helpers.js to download 
// files when it runs (and then exit)