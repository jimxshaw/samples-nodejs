var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cats');

// If my application type is json coming across a form submit, parse the body 
// and add it to the request form. 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Require cats and passing in the app. 
// When I require cats it's going to make the cats 
// variable equal to the returned function from cats.js module.exports.
// The reason app has to be passed in to the require is because within 
// cats.js, the function uses app as an argument for the HTTP methods 
// like app.get, app.post, app.put, app.delete.  
var cats = require('./routes/cats.js')(app);

var server = app.listen(3000, function() {
  console.log('Server running at http://127.0.0.1:3000/');
});
































