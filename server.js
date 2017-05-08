var express = require('express');
var app = express();

// Bring Router
var router = require('./router/router')(app);

// Configuring view directory and engine
app.set('views', __dirname + '/views'); // View pages are in /views directory
app.set('view engine', 'ejs'); // Use EJS as view engine
app.engine('html', require('ejs').renderFile);

// Run server
var server = app.listen(23400, function(){
    console.log("Server Started 23400");
})