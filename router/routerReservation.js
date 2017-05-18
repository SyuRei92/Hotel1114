var router=require('express').Router();
const Rooms=require('../model/Rooms');
const CustomerInfo=require('../model/CustomerInfo');
const util=require('../controller/HotelUtil');

const reservationController=require('../controller/ReservationController');
	
// 예약 페이지
router.get('/new',function(req,res){
	res.render('reservation.html');
});

// 예약 실행
//SeqD MakeReservation Step 07 Entrypoint
router.get('/doReserve',function(req,res){
	reservationController.reserve(
			new CustomerInfo(req.query.name,req.query.email,req.query.phone),
			util.string2Date(req.query.startDate),
			util.string2Date(req.query.endDate),
			new Rooms(Number(req.query.singleRoom),
					Number(req.query.doubleRoom),
					Number(req.query.suiteRoom)),
			'Hotel1114', function(result){
					//SeqD MakeReservation Step 14(showForm) Exitpoint (Will be changed later to JSON Response)
					res.redirect('/payment.html?id='+result.insertedId);},
					function(responseCode){
						//SeqD MakeReservation Step 10
						// TODO notify the code to the customer
						console.log(responseCode);
					});
});

// 계정의 예약 목록
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

<<<<<<< HEAD
// 결졔
router.get('/pay',function(req,res){
	reservationController.pay(req.query.id,null,
			function(documents){res.redirect('/')}); // json 형식으로 뿌리도록 나중에 바꿔야 함
});


//시작날짜에 해당하는 예약 목록
router.get('/listOfDate',function(req,res){
	reservationController.findReservationByStartDate(
		req.startDate,
		function(documents){res.json(util.buildResponse(util.responseCode.SUCCESS,documents.toJson()));});
});

//예약 취소
=======
// 시작날짜에 해당하는 예약 목록
router.get('/listOfDate',function(req,res){
	reservationController.findReservationByStartDate(
		req.startDate,
		function(documents){res.json(util.buildResponse(util.responseCode.SUCCESS,documents.toJson()));});
});

// 예약 취소
>>>>>>> refs/remotes/origin/master
router.get('/cancelReservation',function(req,res){
	// 1. 해당 req.rid에 대한 예약이 있는지 확인
	// 2-1. req.rid에 대한 예약이 없다면 res에 해당 번호의 예약이 없음을 보내고 종료
	// 2-2. 정상적으로 있다면 reservationController에 있는 함수 cancelReservation을 실행
	// 3-1. 성공했다면 res에 성공했다고 보냄
	// 3.2. 실패했다면 res에 실패한 이유를 보냄. 실패하는 경우가 있는지 모르겠어서 일단 안 함.

	// part 1
	reservationController.findReservationById(
		req.rid,
		function(reservationObj){
			// part 2-1
			if (reservationObj == null) {
				res.json(util.buildResponse(util.responseCode."그런 예약 없음 or 실패",null)); //정확한 문구 아직 모름
			}
			// part 2-2
			else {
				reservationController.cancelReservation(
					req.rid,
					function(documents) {
						// part 3-1
						res.json(util.buildResponse(util.responseCode."성공",null)); //정확한 문구 아직 모름
					});
			}
		}
	);
});

module.exports = router;