var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');

app.use(require('express-favicon-short-circuit'));
var regexUrl = new RegExp('^(https?|ftp):\/\/[^\\s\/$.?#].[^\\s]*$');
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://dbuser:userpwd@ds129179.mlab.com:29179/ekaraca-urlshortener');

var Schema = mongoose.Schema;

var urlSchema = new Schema ({
  original_url: String,
  short_url: String
});

var Url = mongoose.model('Url', urlSchema);

app.get('/new/*', function(req, res) {
  var newUrl = req.originalUrl.slice(5);
  var coreUrl = req.protocol + '://' + req.get('host');
  console.log(newUrl);
  if (regexUrl.test(newUrl)) {
    console.log('URL OK!');
    Url.count({}, function(err, c) {
        console.log('count is: ' + c);
        //Check if url already exists in DB
        Url.find({original_url: newUrl}, function(err, data) {
          if (err) throw err;
          console.log('count is still: ' + c);

          // Create new entry if it is new
          if (data.length < 1) {
            if (c==0) {
              var code = 1
            }
            else {
              var code = c+1
            }
            console.log('code is: ' + code);
            var addUrl = Url({
              original_url: newUrl,
              short_url: code
            });

            addUrl.save(function(err) {
              if (err) throw err;
              Url.find({short_url: code}, function(err, data) {
                var result = [{}];
                result[0].original_url = data[0].original_url;
                result[0].short_url = coreUrl + '/' + data[0].short_url
                res.json(result);
              })
            })
            }

          // Return already existing short url from DB
          else {
            var result = [{}];
            result[0].original_url = data[0].original_url;
            result[0].short_url = coreUrl + '/' + data[0].short_url
            res.json(result);
          }
        })
    });
  }
  else {
    res.end('URL IS NOT OK!');
  }
})

app.get('/:shortURL', function(req, res) {
  var coreUrl = req.protocol + '://' + req.get('host');
  var enteredCode = req.params.shortURL;
  Url.find({short_url: enteredCode}, function(err, url) {
    if (err) throw err;
    if (url.length < 1) {
      var result = {"error": "This Short-URL is not in the database!"}
      res.json(result)
    }
    else {
      res.redirect(url[0].original_url);
    }
  })
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(port);

/*
CASES:
- O-URLS
-- New O-URL: X
-- Old O-URL: X
- S-URLS
-- Existing S-URLS: X
-- Wrong S-URLS: X

=> Figure out MongoDB Disconnect
=> Implement RegExp Url Filtering X
*/
