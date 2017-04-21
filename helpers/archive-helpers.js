var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var url = require('url');
var request = require('request');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

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

// exports.readListOfUrls = function(callback) {
//   // read the sites.txt file
//   var siteList = '';
//   fs.readFile(exports.paths.list, function(error, data) {
//     if (error) {
//       console.error('FAIL inside readListOfUrls! ', error);
//     }
//     siteList += data;
//     var siteArray = siteList.split('\n');
//     // console.log('readListOfUrls: siteArray: ', siteArray, siteArray.length);
//     callback(siteArray);
//   });
//   // split the resulting string into an array
//   // invoke callback with array
// };

exports.readListOfUrlsAsync = function() {
  // read the sites.txt file
  var siteList = '';
  return fs.readFileAsync(exports.paths.list, 'utf8')
  .then(function(data) {
    siteList += data;
    var siteArray = siteList.split('\n');
    if (siteArray[siteArray.length - 1] === '') {
      siteArray.pop();
    }
    // console.log('readListOfUrls: siteArray: ', siteArray, siteArray.length);
    return (siteArray);
  });
};

exports.isUrlInListAsync = function(url) {
  return exports.readListOfUrlsAsync()
  .then(function(siteArray) {
    return (siteArray.indexOf(url) !== -1);
  });
};

// exports.isUrlInList = function(url, callback) {
//   exports.readListOfUrls(function(siteArray) {
//     callback(siteArray.indexOf(url) !== -1);
//   });
// };

exports.addUrlToListAsync = function(url) {
  // TODO CHECK IF ISURLINLIST BEFORE ADDING, DUPLICATES
  return exports.isUrlInListAsync(url).then(function(exists) {
    if (!exists) {
      return fs.openAsync(exports.paths.list, 'a+')
      .then(function(fd) {
        return fs.writeAsync(fd, url + '\n');
      });
    }
  });
};

// exports.addUrlToListAsync('www.avocados.com')
// .then(function() { return exports.readListOfUrlsAsync() }).then(function(siteArray) { console.log('>>>>>>>>>', siteArray) });

// exports.addUrlToList = function(url, callback) {
//   // TODO CHECK IF ISURLINLIST BEFORE ADDING, DUPLICATES
//   var fd = fs.open(exports.paths.list, 'a+', function(error, fd) {
//     if (error) {
//       console.error('FAIL inside addUrlToList fs.open', error);
//     } else {
//       fs.write(fd, url + '\n', function(error) {
//         if (error) {
//           console.error('write method FAILS! ', error);
//         }
//         callback();
//         //done();
//       });

//     }
//     fs.close(fd, function() {});
//   });
// };

// exports.isUrlArchived = function(url, callback) {
//   fs.readFile(exports.paths.archivedSites + '/' + url, function(error, content) {
//     if (error) {
//       console.error('Url not found in archives!');
//       callback(false);
//     } else {
//       callback(true);
//     }
//   });
// };

exports.isUrlArchivedAsync = function(url) {
  return fs.readFileAsync(exports.paths.archivedSites + '/' + url)
  .then(function() {
    return true;
  })
  .catch(function(error) {
    return false;
  });
};

// exports.isUrlArchivedAsync('wwww.google.com').then(function(exists) {console.log('isUrlArchivedAsync ======>',exists)});

exports.downloadUrlsAsync = function(urls) {
  urls.forEach(function(url) {
    exports.isUrlArchivedAsync(url).then(function(exists) {
      if (!exists) {
        request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
      }
    });
  });
};




// exports.downloadUrls = function(urls) {

//   urls.forEach( function(url) {
//     exports.isUrlArchived(url, function(exists) {
//       if (!exists) {
//         console.log(`Non-archived url: ${url}`);
//         var file = fs.createWriteStream(exports.paths.archivedSites + '/' + url);
//         // TODO prepend 'http://' conditionally, maybe using 'url' module?
//         if(url.substring(0, 7) !== 'http://') {
//           url = 'http://' + url;
//         }
//         console.log(`GETTING url: ${url}`);
//         var request = http.get(url, function(response) {
//           console.log(`response.statusCode: ${response.statusCode}`);
//           response.pipe(file);
//           response.on('end', function() {
//             file.end();
//           })
//         });
//       }
//     });

//   });
// };

// request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));

exports.downloadUrlsAsync(['www.google.com']);
// console.log(url.parse('http://www.google.com'));
