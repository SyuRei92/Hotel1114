var router=require('express').Router();

const reservationController=require('../controller/ReservationController');
	
// 예약 페이지
router.get('/new',function(req,res){
	res.render('reservation.html');
});

// 예약 실행
//SeqD MakeReservation Step 07 Entrypoint
router.get('/doReserve',function(req,res){
	console.log(req.query);
	reservationController.reserve(req.query.email,req.query.startDate,req.query.endDate,
			{singleRoom: req.query.singleRoom,
				doubleRoom: req.query.doubleRoom,
				suiteRoom: req.query.suiteRoom},
			'Hotel1114', function(id){
					//SeqD MakeReservation Step 14(showForm) Exitpoint (Will be changed later to JSON Response)
					res.redirect('/reservation/list');});
});

// 예약 목록
router.get('/list',function(req,res){
	var d=reservationController.findReservationByAccount('baek449@gmail.com',
			function(documents){console.log(documents); res.render('reservationList.html',{result:documents})});
});

//예약 기간에 대한 방 개수
//SeqD MakeReservation Step 02 Entrypoint
router.get('/duration',function(req,res){
	//SeqD MakeReservation Step 02
	var d=reservationController.availableRooms(req.query.startDate,req.query.endDate,'Hotel1114',
		function(documents){
			//SeqD MakeReservation Step 05(No Available Rooms) Exitpoint (Will be changed later to JSON Response)
			if(documents.singleRoom<=0 && documents.doubleRoom<=0 && documents.suiteRoom<=0){ // opt RoomCheck
				res.render('remainingRooms.html',{result:documents}); // will be changed
				return;
			}
			//SeqD MakeReservation Step 06(Show Available Rooms) Exitpoint (Will be changed later to JSON Response)
			res.render('remainingRooms.html',{result:documents});
		});
});
module.exports = router;