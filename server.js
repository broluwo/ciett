var express = require('express');
var app = express();
var fs = require('fs');
var FileReader = require('filereader');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var morgan = require('morgan');
var BusBoy = require('busboy');
var methodOverride = require('method-override');

// MongoDB stuff
mongoose.connect('mongodb://localhost');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', function (callback) {
  console.log('Mongo database opened');
});

// Mongo Models
// TODO Not currently used
var Sound = mongoose.model('Sound', {
    data: Buffer,
    bpm : {type: Number, min: 0, max: 300},
    contentType: String
});

// Express stuff
app.use(express.static('spa'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
/*
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
*/
app.use(methodOverride());

// ROUTE: /process
//  POST: Receives Blob of WAV audio data as 'audio' in request body
app.route('/process')
    .post(function(req, res) {
        var busboy = new BusBoy({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimeType) {
            // Saves the blob received as audio.wav
            file.pipe(fs.createWriteStream('julia/audio.wav'));
        });
        busboy.on('finish', function() {
            res.writeHead(200, { 'Connection': 'close' });
            res.end();
        });
        req.pipe(busboy);
    });

// Start server
app.listen(8080);
console.log("App listening on port 8080");
