var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var qs = require('qs');
// require more modules/folders here!

var sendResponse = function(res, data, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(data));
};


var actions = {
  'GET': function(req, res) {
    console.log(`  GET request for ${req.url}`);
  },
  'POST': function(req, res) {
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      var requestedUrl = qs.parse(data).url;
      console.log(`  POST request contains url: "${requestedUrl}"`);
      console.log(`    ADDING "${requestedUrl}" to list of sites at ${archive.paths.list}`);
      archive.addUrlToList(requestedUrl, function() {
        console.log(`    REDIRECTING to ${archive.paths.siteAssets}\\loading.html`);
        res.writeHead(302, {'Location': archive.paths.siteAssets + '/loading.html'});
        res.end();
      });
    });
  }
};

exports.handleRequest = function (req, res) {

  console.log(`SERVER: Serving ${req.method} request`);

  if (actions[req.method]) {
    actions[req.method](req, res);
  } else {
    // Method type not found in actions
    // Bad request, return 400 status code
  }

};
