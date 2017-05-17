var router=require('express').Router();
const Rooms=require('../model/Rooms');
const util=require('../controller/HotelUtil');

const reservationController=require('../controller/ReservationController');
	
// 예약 페이지
router.get('/new',function(req,res){
	res.render('reservation.html');
});

// 예약 실행
//SeqD MakeReservation Step 07 Entrypoint
router.get('/doReserve',function(req,res){
	reservationController.reserve(req.query.email,
			util.string2Date(req.query.startDate),
			util.string2Date(req.query.endDate),
			new Rooms(Number(req.query.singleRoom),
					Number(req.query.doubleRoom),
					Number(req.query.suiteRoom)),
			'Hotel1114', function(id){
					//SeqD MakeReservation Step 14(showForm) Exitpoint (Will be changed later to JSON Response)
					res.redirect('/reservation/list');});
});

// 예약 목록
router.get('/list',function(req,res){
	reservationController.findReservationByAccount('baek449@gmail.com',
			function(documents){res.render('reservationList.html',{result:documents})});
});

//예약 기간에 대한 방 개수
//SeqD MakeReservation Step 02 Entrypoint
router.get('/available',function(req,res){
	//SeqD MakeReservation Step 02
	var d=reservationController.availableRooms(util.string2Date(req.query.startDate),
			util.string2Date(req.query.endDate),'Hotel1114',
		function(documents){
			
			if(!documents.isValid()){ // opt RoomCheck
				// 사용 가능한 방이 없는 경우
				//SeqD MakeReservation Step 05(No Available Rooms) Exitpoint
				res.json(util.buildResponse(util.responseCode.NO_ROOM,null));
				return;
			}
			//SeqD MakeReservation Step 06(Show Available Rooms) Exitpoint
			res.json(util.buildResponse(util.responseCode.SUCCESS,documents.toJson()));
			//res.render('remainingRooms.html',{result:documents});
		});
});
module.exports = router;