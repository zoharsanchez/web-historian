var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var siteAssets = archive.paths.siteAssets;
var headers = httpHelpers.headers;
var serveAssets = httpHelpers.serveAssets;
var urlParse = require('url');

var actions = {
  GET: function(req, res, pathName) {
    serveAssets(res, pathName, function(data) {
      sendRes(req, res, 200, data);
    });
  },
  POST: function(req, res) {
    var url = '';
    req.on('data', function(chunk) {
      url += chunk;
    });
    req.on('end', function() {
      url = url.toString().slice(4);
      url = url + '\n';
      fs.appendFile(archive.paths.list, url, function(err) {
        if (err) {
          console.warn('error appending to list: ', err);
        }
      });
      res.writeHead(302, headers);
      res.end();
    });
  },
  OPTIONS: function() {

  }
};

    // if true, check in archive (isUrlArchived)
      // if in archive (true), then serve HTML asset
      // if false, serve loading.html to tell client to wait; 
    // if false, addUrlToList
  //read sites.txt file (paths.list)

var sendRes = function(req, res, statusCode, data) {
  res.writeHead(statusCode, headers);
  res.end(data);
};

exports.handleRequest = function (req, res) {
  var parts = urlParse.parse(req.url);
  var pathName = parts.pathname;
  var action = actions[req.method];
  // refactor actions to be individual handler functions like handleGet, handlePost, etc. 
  if (pathName === '/') {
    if (req.method === 'GET') {
      action(req, res, siteAssets + '/index.html');    
    } else if (req.method === 'POST') {
      action(req, res);
    }
  } else {
    // if any other pathName, we should probably be more specific about what action. 
    action(req, res, archive.paths.archivedSites + pathName);
    // instead of using variable name for archivedSites, 
    // we have to type it all out because of tests
  }
};


