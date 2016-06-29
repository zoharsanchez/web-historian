var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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
      // example1.com\nexample2.com
      data = data.split('\n');
      callback(data);
      // what do we do with this data? 
    }
  });
};

exports.isUrlInList = function(url) {
  // for web to check if new url from POST 
  // readListOfUrls to read sites.txt file
  // return true or false based on match of list; 


};

exports.addUrlToList = function(url) {
  // for web to use to add
  // appendFile url to sites.txt
};

exports.isUrlArchived = function(url) {
  // for web to check & also for worker to check
  // check for file in /archives/sites (paths.archivedSites)
  // return true if found
  // serve asset as response
};

exports.downloadUrls = function() {
  // for workers/htmlfetcher.js
  // used to download the urls from sites.txt list
  // writeFile of HTML to archives/sites
};
