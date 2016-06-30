var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var siteAssets = archive.paths.siteAssets;
var headers = httpHelpers.headers;
var serveAssets = httpHelpers.serveAssets;
var urlParse = require('url');



// If users submit a page you already have, you should auto-redirect them 
// to either your archived version of that page, or to loading.html 
// if the page has not yet been loaded

// for POST:
// get url
// isUrlInList?
  // true: 
    // isUrlInArchive?
      // error/false (it has not been downloaded by worker)
        // redirect to loading.html
      // true
        // serve asset (might be repetitive...)
  // false:
    // addUrlToList

var serveLoadingPage = function(req, res) {
  serveAssets(res, siteAssets + '/loading.html', function(data) {
    sendRes(req, res, 302, data);
  });
};

var handleGet = function(req, res, pathName) {
  serveAssets(res, pathName, function(data) {
    sendRes(req, res, 200, data);
  });
};

var handlePost = function(req, res) {
  var url = '';
  req.on('data', function(chunk) {
    url += chunk;
  });
  req.on('end', function() {
    url = url.toString().slice(4);
    console.log('req: ', url);

    // is url in list? calling isUrlInList
    archive.isUrlInList(url, function(exists, url) {

      console.log('inList: ', url);

      // if yes
      if (exists) {
        // is url in archive/sites? calling isUrlArchived
        archive.isUrlArchived(url, function(exists, url) {
          console.log('inArchive: ', url);

          if (exists) {
          // if yes,
            // serve archived site
            var pathName = archive.paths.archivedSites + '/' + url;
            console.log('pathname: ', pathName);
            serveAssets(res, pathName, function(data) {
              sendRes(req, res, 302, data);
            });
          } else {
          // if no,
            // serve loading page, we dont' have it yet, check back soon
            serveLoadingPage(req, res); 
          }
        }); 
      } else {
      // if no
        // add url to list. calling addUrlToList
          // serve loading page. 
        archive.addUrlToList(url, function() {
          // error in POST where if you request a page that already exists,
          // it'll load, but then also append other weird requests to sites.txt
          serveLoadingPage(req, res);
        }); 
      }
    });
  });
};

var handleOptions = function(req, res) {
  res.writeHead(200, headers);
  res.end();
};

var handleCSS = function(req, res) {
  serveAssets(res, siteAssets + '/styles.css', function(data) {
    res.writeHead(200, {
      'Content-Type': 'text/css'
    });
    res.end(data);
  });
};

var sendRes = function(req, res, statusCode, data) {
  res.writeHead(statusCode, headers);
  res.end(data);
};

// instead of using variable name for archivedSites, 
// we have to type it all out because of tests
exports.handleRequest = function (req, res) {
  var parts = urlParse.parse(req.url);
  var pathName = parts.pathname;
  var method = req.method;
  // refactor actions to be individual handler functions like handleGet, handlePost, etc. 
  if (method === 'GET') {
    if (pathName === '/') {
      handleGet(req, res, siteAssets + '/index.html');          
    } else if (pathName === '/styles.css') {
      handleCSS(req, res);  
    } else {
      handleGet(req, res, archive.paths.archivedSites + pathName);       
    }
  } else if (method === 'POST') {
    handlePost(req, res);
  } else if (method === 'OPTIONS') {
    handleOptions(req, res);
  } else {
    sendRes(req, res, 404, 'error: wrong path/method');  
  }
};


