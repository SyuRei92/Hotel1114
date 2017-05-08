module.exports = function(app)
{
	// Main Page - http://localhost:23400/
	// Login Page - http://localhost:23400/login
	// Member Page - http://localhost:23400/memberPage
	// Error Page - http://localhost:23400/error
	
	require('./routerAccount')(app);

	// Basic page render
     app.get('/',function(req,res){
        res.render('index.html');
     });
     
     app.get('/error',function(req,res){
    	 res.render('error.html');
     });
     
     // Examples: Embed arguments in web page
     app.get('/login1',function(req,res){
        res.render('login2.html',{message:'myId'});
     });
     app.get('/login2/:id',function(req,res){
    	// Access by http://localhost:23400/login2/myId2
         res.render('login2.html',{message:req.params.id});
     });
     app.get('/login3',function(req,res){
    	 // Access by http://localhost:23400/login3?id=myId3
         res.render('login2.html',{message:req.query.id});
     });
};