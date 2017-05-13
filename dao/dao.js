var dao={url:'mongodb://localhost:27017/hotel1114'};
dao.init=function(app,nextJob){
	// MongoDB Use
	var mongoClient = require('mongodb').MongoClient;
	var assert = require('assert');
	mongoClient.connect(dao.url, function(err, db) {
	    if(err){
	        console.log(err);
	        db.close();
	        return;
	    }
	    console.log("Successfully connected with MongoDB server.");
	
	    dao.collection=function(c){return db.collection(c);};
	    
	    // Attach DAO submodules here
	    dao.reservation=require('./daoReservation')(dao.collection);

		// Do the next job(ex:server setting) after DB connection established
		nextJob(app,dao);
		// db.close();
	});
};

module.exports=dao;