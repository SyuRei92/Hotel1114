module.exports = function(app,dao)
{
	const reservationController=require('../controller/reservationController')(dao);
	
	// 예약 페이지
    app.get('/reservation',function(req,res){
    	res.render('reservation.html');
    });
    
    // 예약 실행
	app.get('/doReserve',function(req,res){
		console.log(req.query);
		reservationController.reserve(req.query.email,req.query.startDate,req.query.endDate,
				{singleRoom: req.query.singleRoom,
					doubleRoom: req.query.doubleRoom,
					suiteRoom: req.query.suiteRoom},
				function(id){res.redirect('/reservationList');});
		
	});
	
	// 예약 목록
	app.get('/reservationList',function(req,res){
		var d=reservationController.findReservationByAccount('123',
				function(documents){console.log(documents); res.render('reservationList.html',{result:documents})});
	});
};