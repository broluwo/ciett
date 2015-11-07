var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Scheme = mongoose.Schema;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// MongoDB stuff
mongoose.connect('mongodb://127.0.0.1:27017/uwO3mypu');
var db = mongoose.connection;

db.on('error', console.err.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Mongo database opened');
});

/* var Sound = mongoose.model('Sound', {
    data: Buffer,
    bpm : {type: Number, min: 0, max: 300},
    contentType: String
});
*/

// Express stuff
app.use(express.static(__dirname + '/spa'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// Start server
app.listen(8080);
console.log("App listening on port 8080");