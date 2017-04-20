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
    sendResponse()
    // return the asset defined in req.url from the archive
      // fs.readFile
    // if that asset does not exist, throw a 404 status code
  },
  'POST': function(req, res) {

  }
};

exports.handleRequest = function (req, res) {

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200);
    // TODO replace path with archive.paths.siteAssets
    fs.readFile('./web/public/index.html', function(error, content) {
      if (error) {
        console.error('FAIL inside GET / !', error);
      }
      console.log('GET request incoming!');
      // res.write();
      res.end(content);
    });

  } else if (req.method === 'GET' && req.url === '/web/public/loading.html') {
    // TODO replace path with archive.paths.siteAssets
    res.writeHead(200);
    fs.readFile('./web/public/loading.html', function(error, content) {
      if (error) {
        console.error('FAIL inside GET loading.html!', error);
      }
      console.log('GET request incoming!');
      // res.write();
      res.end(content);
    });

  } else if (req.method === 'GET' && req.url !== '/') {
    res.writeHead(200);
    var archivedSitePath = archive.paths.archivedSites + req.url;
    fs.readFile(archivedSitePath, function(error, content) {
      if (error) {
        res.writeHead(404);
        console.error('FAIL inside GET with url!', error);
      }
      console.log('GET request incoming!');
      // res.write();
      res.end(content);
    });

  } else if (req.method === 'POST') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      // console.dir(qs.parse(body));
      var newSite = qs.parse(body).url + '\n';
      fs.writeFile(archive.paths.list, newSite, function(error) {
        if (error) {
        console.error('FAIL! inside POST', error);
        } else {
          // res.writeHead(302, {'Location': archive.paths.siteAssets + '/loading.html'});
          res.writeHead(302, {'Location': './web/public/loading.html'});
          // res.writeHead(302, {'Location': './web/POTATO.html'});
          console.log('REDIRECTING!');
          res.end();
        }
        // res.write();


      })
    });

  } else {
    res.end(archive.paths.list);
  }
};
