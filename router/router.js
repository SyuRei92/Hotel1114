module.exports = function(app,dao)
{
	// Main Page - http://localhost:23400/
	// Login Page - http://localhost:23400/login
	// Member Page - http://localhost:23400/memberPage
	// Error Page - http://localhost:23400/error
	
	app.use('/reservation', require('./routerReservation'));
	//require('./routerAccount')(app,dao);
	//require('./routerReservation')(app,dao);

	// Basic page render
     app.get('/',function(req,res){
        res.render('index.html');
     });
     
     app.get('/error',function(req,res){
    	 res.render('error.html',{message:"Unknown Error"});
     });
     app.get('/400',function(req,res){
    	 res.render('error.html',{message:"400 Bad Request"});
     });
     app.get('/403',function(req,res){
    	 res.render('error.html',{message:"403 Forbidden"});
     });
     app.get('/404',function(req,res){
    	 res.render('error.html',{message:"404 Not Found"});
     });
     app.use(function(req,res){
    	 res.redirect('/404');
     });
};