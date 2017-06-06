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
//SeqD MakeReservation Step 09 Entrypoint
router.get('/doReserve',function(req,res){
	console.log("/doReserve");
	reservationController.reserve(
			new CustomerInfo(req.query.name,req.query.email,req.query.phone),
			util.string2Date(req.query.startDate),
			util.string2Date(req.query.endDate),
			new Rooms(Number(req.query.singleRoom),
					Number(req.query.doubleRoom),
					Number(req.query.suiteRoom)),
			'Hotel1114', function(result){
				console.log("Reserving Succeed");
				reservationController.pay(result.insertedId,null,
					function(documents){
						res.json(util.buildResponse(util.responseCode.SUCCESS,null));
					}); // json 형식으로 뿌리도록 나중에 바꿔야 함
				/*
					//SeqD MakeReservation Step 17(showPaymentForm) Exitpoint (Will be changed later to JSON Response)
					res.redirect('/payment.html?id='+result.insertedId);},
					function(responseCode){
						console.log("Reserving Failed");
						//SeqD MakeReservation Step 10 and 13
						// TODO notify the code to the customer
						console.log(responseCode);
					});*/
			});
});

// 계정의 예약 목록
router.get('/list',function(req,res){
	reservationController.findReservationByAccount('baek449@gmail.com',
			function(documents){res.render('reservationList.html',{result:documents})});
});

//예약 기간에 대한 방 개수
//SeqD MakeReservation Step 04 Entrypoint
router.get('/available',function(req,res){
	//SeqD MakeReservation Step 04
	var d=reservationController.availableRooms(util.string2Date(req.query.startDate),
			util.string2Date(req.query.endDate),'Hotel1114',
		function(documents){
			
			if(!documents.isValid()){ // opt RoomCheck
				// 사용 가능한 방이 없는 경우
				//SeqD MakeReservation Step 07(No Available Rooms) Exitpoint
				res.json(util.buildResponse(util.responseCode.NO_ROOM,null));
				return;
			}
			//SeqD MakeReservation Step 08(Show Available Rooms) Exitpoint
			res.json(util.buildResponse(util.responseCode.SUCCESS,documents.toJson()));
			//res.render('remainingRooms.html',{result:documents});
		});
});

// 결졔
//SeqD MakeReservation Step 18 Entrypoint
router.get('/pay',function(req,res){
	reservationController.pay(req.query.id,null,
			function(documents){res.redirect('/')}); // json 형식으로 뿌리도록 나중에 바꿔야 함
});


//시작날짜에 해당하는 예약 목록
router.get('/listOfDate',function(req,res){
	reservationController.findReservationByStartDate(
		util.string2Date(req.query.startDate),
		function(documents){console.log("type");console.log(util.buildResponse(util.responseCode.SUCCESS,documents));res.json(util.buildResponse(util.responseCode.SUCCESS,documents));});
});

// 예약 취소
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
				res.json(util.buildResponse(util.responseCode.FAILURE,null)); //정확한 문구 아직 모름
			}
			// part 2-2
			else {
				reservationController.cancelReservation(
					req.rid,
					function(documents) {
						// part 3-1
						res.json(util.buildResponse(util.responseCode.SUCCESS,null)); //정확한 문구 아직 모름
					});
			}
		}
	);
});


// 예약 변경
router.get('/modifyReservation', function(req, res) {
	// 1. 해당 req.rid에 해당하는 예약이 있는지 확인
	// 2-1. req.rid에 대한 예약이 없다면 res에 해당 번호의 예약이 없음을 보내고 종료
	// 2-2. 보내온 방 갯수가 사용 가능한 방 갯수인지 확인. 불가능하면 response하고 종료
	// 3-1. 기존 예약의 시작날짜/종료날짜, 각 방의 갯수를 획득.
	// 3-2. 해당 날짜의 남은 방 갯수를 획득 후 기존 예약의 방 갯수를 가산.(예약 가능한 방의 갯수를 계산)
	// 4-1. 방의 갯수가 너무 많아서 예약이 불가능하면 불가능하다고 응답하고 종료.
	// 4-2. 정상적인 방 갯수라면 reservationController에 있는 함수 modifyReservation을 실행. 근데 Rooms는 어떻게 넘겨줘야 할 지 고민중.
	// 5-1. 성공했다면 res에 성공했다고 보냄
	// 5-2. 실패했다면 res에 실패한 이유를 보냄. 실패하는 경우가 있는지 모르겠어서 일단 안 함.

	// part 1
	reservationController.findReservationById(
		req.rid,
		function(reservationObj) {
			// part 2-1
			if (reservationObj == null) {
				res.json(util.buildResponse(util.responseCode.FAILURE, null)); // 정확한 문구 아직 모름
			}
			// part 2-2
			/*
			else {
				// part 3-1
				startDate = 
				endDate = 
				singleRoom = 
				doubleRoom = 
				suiteRoom = 

				// part 3-2
				reservationController.availableRooms(startDate, endDate); // 변수 더 필요하니 확인
				singleRoom += 
				doubleRoom += 
				suiteRoom += 

				// part 4-1
				if (싱글룸 > singleRoom || 더블룸 > doubleRoom || 스위트룸 > suiteRoom) {
					res.json(util.buildResponse(util.responseCode.FAILURE, null)); // 방을 너무 많이 선택했다!
				}
				// part 4-2
				else {
					reservationController.modifyReservation(
						reservationController.modifyReservation(
							reservationObj,
							전화번호,
							변경된 방,
							function(documents) {
								// part 5-1
								res.json(util.buildResponse(util.responseCode.SUCCESS, null));
							}
						)
					);
				}
			}
			*/
		}
	)
});

module.exports = router;