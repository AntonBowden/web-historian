var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

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
  // read the sites.txt file
  var siteList = '';
  fs.readFile(exports.paths.list, function(error, data) {
    if (error) {
      console.error('FAIL inside readListOfUrls! ', error);
    }
    siteList += data;
    var siteArray = siteList.split('\n');
    // console.log('readListOfUrls: siteArray: ', siteArray, siteArray.length);
    callback(siteArray);
  });
  // split the resulting string into an array
  // invoke callback with array
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(siteArray) {
    callback(siteArray.indexOf(url) !== -1);
  });
};

exports.addUrlToList = function(url, callback) {
  var fd = fs.open(exports.paths.list, 'w', function(error, fd) {
    if (error) {
      console.error('FAIL inside addUrlToList fs.open', error);
    } else {
      fs.write(fd, url, function(error) {
        if (error) {
          console.error('FAIL!');
        }
        callback();
        //done();
      });

    }
    fs.close(fd, function() {});
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readFile(exports.paths.archivedSites + '/' + url, function(error, content) {
    if (error) {
      console.error('FAIL!');
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach( function(url) {
    exports.isUrlArchived(url, function(exists) {
      if (!exists) {
        console.log(`Non-archived url: ${url}`);
        var file = fs.createWriteStream(exports.paths.archivedSites + '/' + url);
        var request = http.get('http://' + url, function(response) {
          console.log(`response.statusCode: ${response.statusCode}`);
          response.pipe(file);
        });
      }
    });
  });
  // var file = fs.createWriteStream("file.jpg");
  // var request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
  //   response.pipe(file);
  // });
};
