var express = require('express');

var app = express();

// Every time there's a GET request on '/' route, execute the function.
// If another route besides '/' is used, nothing will happened. 
app.get('/', function(req, res) {
  //res.send('Hello world!');
  res.json({hello: 'world'});
});

var server = app.listen(3000, function() {
  console.log('Server running at http://127.0.0.1:3000/');
});
































