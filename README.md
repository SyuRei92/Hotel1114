

# Hotel1114
This is the hotel1114 web service simulating hotel reservation system.


## Environment Setting for local run
1. Install node.js and mongoDB  
2. Open mongoDB and insert some collections and initial data  
    2-1. Go to the root of the drive where mongoDB installed, and create /data/db directory.  
         This is the play where data is actually stored.  
    2-2. Open mongoDB server(mongod.exe)/client(mongo.exe)  
    2-3. Run following script in mongoDB client to create collections  
         use hotel1114  
         db.createCollection("customer")  
         db.createCollection("member")  
         db.createCollection("coupon")  
         db.createCollection("reservation")  
         db.createCollection("reservedRoomsByDate")  
         db.createCollection("room")  
    2-4. Run following script in mongoDB client to create initial data.  
         This states the number of each rooms in the hotel.  
         db.room.insertOne({"singleRoom" : 10, "doubleRoom" : 5, "suiteRoom" : 3, "hotel" : "Hotel1114"})  
3. In the root directory of the project(where package.js exists),  
   install dependent packages by executing npm -install.  
4. Run node server.js at the root directory. Do not shut down mongoDB server when the server is running.  
5. Use your web browser to connect http://localhost:23400/  
   it will redirect you to reservation page.  
   Note that you must enter correct email address as the server actually sends the mail through a real gmail client.  
6. To access admin page, connect http://localhost:23400/Reservation(admin).html  



## Developing
Sprint 01: Build development environment and structures.
           Implement ‘Make reservation’ for customers.
           Implement ‘Reservation management’ for administrators.


### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
