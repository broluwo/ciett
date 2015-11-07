var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOVerride = require('method-override');

// mongoose.connect('mongodb://127.0.0.1:27017/uwO3mypu');
app.use(express.static(__dirname + '/spa'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model =================
// var Sound = mongoose.model('Sound', {
//     data: Buffer,
//     bpm : {type: Number, min: 0, max: 300},
//     contentType: String
// });
// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
