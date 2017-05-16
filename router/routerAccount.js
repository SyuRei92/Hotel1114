var router=require('express').Router();

const accountController=require('../controller/accountController');

router.get('/login',function(req,res){
    res.render('login.html');
});
router.get('/doLogin',function(req,res){
	accountController.login(req,req.query.memberID,req.query.memberPW);
	// TODO If error do subsequent actions. Currently unconditional success
	
	// If login succeed, redirect to memberpage.
	res.redirect('/memberPage');
});
router.get('/memberPage',function(req,res){
	if(!accountController.check(req,accountController.level.member)){
		// TODO If error redirect to error
		res.redirect('/403');
	}
	else res.render('memberPage.html',{memberID:req.session.memberID});
});
router.get('/doLogout',function(req,res){
	// Perform Logout
	accountController.logout(req);
	// Return to the main page
	res.redirect('/');
});

module.exports = router;