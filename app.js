var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');

app.use(require('express-favicon-short-circuit'));
var regexUrl = new RegExp('@^(https?|ftp)://[^\\s/$.?#].[^\\s]*$@iS');
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://dbuser:userpwd@ds129179.mlab.com:29179/ekaraca-urlshortener');

var Schema = mongoose.Schema;

var urlSchema = new Schema ({
  original_url: String,
  short_url: String
});

var Url = mongoose.model('Url', urlSchema);

// DONT KNOW HOW TO RETURN COUNT-VALUE
/*Url.count({}, function(err, c) {
    count = c;
    console.log(count);
});

var count = Url.count({}, function(err, c) {
  return JSON.parse(c);
});
var count2 = count;
*/

//dbCount(postCount);

app.get('/new/:newUrl', function(req, res) {
  var newUrl = req.params.newUrl;
  if (port) {
//if (regexUrl.test(newUrl)) {
    console.log('URL OK!');
    Url.count({}, function(err, c) {
        console.log('count is: ' + c);

        Url.find({original_url: newUrl}, function(err, url) {
          if (err) throw err;
          console.log('count is still: ' + c);
          if (url.length < 1) {
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
              res.end(newUrl + ' was saved \nThe short_url-code is: ' + code)
            })
            }
          else {
            res.end(url[0].original_url + ' is already saved! \nIts short_url-code is: ' + url[0].short_url);
          }
        })




    });


  }
  else {
    res.send('URL IS NOT OK!')
  }
})

app.get('/:shortURL', function(req, res) {
  var enteredCode = req.params.shortURL;
  Url.find({short_url: enteredCode}, function(err, url) {
    if (err) throw err;
    if (url.length < 1) {
      res.end("This Short-URL is not in the database!")
    }
    else {
      res.end('Your requested URL is: ' + url[0].original_url);
    }
  })
});

app.get('/', function(req, res) {
  //res.sendFile(path.join(__dirname + '/index.html'));
  var count = (Url.count({}, function(err, c) {
    return c
  }));
  console.log(count);
})

app.listen(port);
