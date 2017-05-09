var express = require('express');
var app = express();

// Body Parser Use
/*
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
*/

// Session Use
var session = require('express-session');
app.use(session({
 secret: '*2fe23f@#T80v$$5(dEWgeG#f^7',
 resave: false,
 saveUninitialized: true
}));

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