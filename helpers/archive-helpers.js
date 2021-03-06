var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var validUrl = require('valid-url');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  // maybe for both web & worker, at least definitely for worker to check for what urls to download
  // read sites.txt file (paths.list)
  fs.readFile(this.paths.list, function(err, data) {
    if (err) {
      console.warn('readListOfUrls error: ', err);
    } else {
      data = data.toString();
      data = data.split('\n');
      callback(data);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(this.paths.list, function(err, data) {
    if (err) {
      console.warn('isUrlInList error: ', err);
    } else {
      var exists = false;
      data = data.toString();
      data = data.split('\n');
      for (var i = 0; i < data.length; i++) {
        if (url === data[i]) {
          exists = true;
        }
      }
      callback(exists, url);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  // for web/basic-server to use to add url to sites.txt
  var url = '\n' + url;
  fs.appendFile(this.paths.list, url, function(err) {
    if (err) {
      console.warn('addUrlToList error: ', err);
    } else {
      callback();
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  // for web to check & also for worker to check
  // check for file in /archives/sites (paths.archivedSites)
  // return true if found
  // serve asset as response
  // var pathName = this.paths.archivedSites + '/' + url;
  // File is not saved as HTML filetype... 
  fs.readdir(this.paths.archivedSites, function(err, fileNames) {
    if (err) {
      console.warn('readdir error: ', err);
    } else {
      var exists = false;
      if (fileNames.indexOf(url) !== -1) {
        exists = true;
        callback(exists, url);
      } else {
        callback(exists, url);
      }
    }
  });
};

exports.downloadUrls = function(urlArray) {
  // for workers/htmlfetcher.js
  // used to download the urls from sites.txt list
  // writeFile of HTML to archives/sites
  var archivedSites = this.paths.archivedSites;
  var htmlBody = '';
  for (var i = 0; i < urlArray.length; i++) {
    var pathName = archivedSites + '/' + urlArray[i];
    var url = 'http://' + urlArray[i];
    // (if first letter is w, then it's www. )
    if (validUrl.isUri(url)) {
      console.log(url);
      console.log(validUrl.isUri(url));
      request.get(url).on('error', function(err) {
        console.warn('downloadUrls stream error', err);
      }).pipe(fs.createWriteStream(pathName));
    } else {
      console.warn('Invalid url for download: ', url);
    }
  }
};
