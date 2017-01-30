var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');

var regexUrl = new RegExp('@^(https?|ftp)://[^\\s/$.?#].[^\\s]*$@iS');


var port = process.env.PORT || 3000;

mongoose.connect('mongodb://dbuser:userpwd@ds129179.mlab.com:29179/ekaraca-urlshortener');

var Schema = mongoose.Schema;

var urlSchema = new Schema ({
  original_url: String,
  short_url: String
});

var Url = mongoose.model('Url', urlSchema);

app.get('/new/:newUrl', function(req, res) {
  var newUrl = req.params.newUrl;
  var regUrl = ('');
  //Url.find({ short_url: /^fluff/ }, callback);
  console.log(newUrl);
  if (regexUrl.test(newUrl)) {
    res.send('URL OK!')
  }
  else {
    res.send('URL NOT OK!')
  }


  //if (/* req.params.newUrl in correct format */) {
    /* GENERATE SHORTENED URL */
    /* STORE BOTH URLS IN DB */
    /* RETURN JSON WITH BOTH URLS */
  /*}
  else {
    res.json({"error":"Wrong url format, make sure you have a valid protocol and real site."})
  }
  */
})



app.get('/:shortURL', function(req, res) {
  /*if (
    //req.params.shortUrl IS PRESENT IN DB
  ) {
    // FETCH ORIGINAL URL
  }*/
  //else {
    res.end("This URL is not in the database!")
  //}
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})


app.listen(port);
