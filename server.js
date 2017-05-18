var express = require('express');
var app = express();
app.use(express.static('Hotel1114_Front-end'));

// Session Use
var session = require('express-session');
app.use(session({
 secret: '*2fe23f@#T80v$$5(dEWgeG#f^7',
 resave: false,
 saveUninitialized: true
}));

// Configuring view directory and engine
app.set('views', __dirname + '/views'); // View pages are in /views directory
app.set('view engine', 'ejs'); // Use EJS as view engine
app.engine('html', require('ejs').renderFile);

// Mail
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// MongoDB Use
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
mongoClient.connect('mongodb://localhost:27017/hotel1114', function(err, db) {
    if(err){
        console.log(err);
        return;
    }
    console.log("Successfully connected with MongoDB server.");

    global.db=db;
    global.db.ObjectID=require('mongodb').ObjectID;
    
	// Router Setting
    require('./router/router')(app);

	// Run server
	var server = app.listen(23400, function(){
	    console.log("Server Started 23400");
	});
});
