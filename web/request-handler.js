var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var siteAssets = archive.paths.siteAssets;
var headers = httpHelpers.headers;
var serveAssets = httpHelpers.serveAssets;


var actions = {
  GET: function(req, res) {
    serveAssets(res, siteAssets + '/index.html', function(data) {
      sendRes(req, res, 200, data);
    });
  },
  POST: function() {
    // if true, check in archive (isUrlArchived)
      // if in archive (true), then serve HTML asset
      // if false, serve loading.html to tell client to wait; 
    // if false, addUrlToList
  //read sites.txt file (paths.list)
  },
  OPTIONS: function() {

  }
};

var sendRes = function(req, res, statusCode, data) {
  res.writeHead(statusCode, headers);
  res.end(data);
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action) {
    action(req, res);
  }
};


