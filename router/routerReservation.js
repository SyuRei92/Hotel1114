var router=require('express').Router();
const Rooms=require('../model/Rooms');
const CustomerInfo=require('../model/CustomerInfo');
const util=require('../controller/HotelUtil');
const Reservation = require('../model/Reservation')

const reservationController=require('../controller/ReservationController');
	
// 예약 페이지
router.get('/new',function(req,res){
	res.render('reservation.html');
});

// 예약 실행
//SeqD MakeReservation Step 09 Entrypoint
router.get('/doReserve',function(req,res){
	console.log("/doReserve");
	console.log(req.query);
	// 예약을 위한 컨트롤러를 실행하면서 입력받은 값들을 넘겨줍니다. 이 때 필요한 경우 클리스로 묶거나 형변환을 시켜 줍니다.
	reservationController.reserve(
		new CustomerInfo(req.query.name,req.query.email,req.query.phoneNumber),			// 고객 정보 클래스입니다.
		util.string2Date(req.query.startDate),										// 체크인 날짜입니다.
		util.string2Date(req.query.endDate),										// 체크아웃 날짜입니다.
		new Rooms(Number(req.query.singleRoom),										// 예약한 방의 개수 클래스입니다.
			Number(req.query.doubleRoom),
			Number(req.query.suiteRoom)),
		'Hotel1114',req.query.password,												// 호텔명입니다.
		function(result){															// 예약이 등록되었을 경우 수행할 작업입니다.
			console.log("Reserving Succeed");
			reservationController.pay(result.insertedId,null,						// ID를 이용하여 지불 절차에 들어갑니다.
				function(documents){												// 지불 절차가 끝났을 경우 수행할 작업입니다.
					res.json(util.buildResponse(util.responseCode.SUCCESS,null));	// 클라이언트에 성공했음을 알려줍니다.
				}
			);
		}
	);
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
	var d=reservationController.availableRooms(util.string2Date(req.query.startDate),	// 날짜로부터 예약 가능한 방 개수를 가져옵니다.
			util.string2Date(req.query.endDate),'Hotel1114',
		function(documents){															// 방 개수를 가져온 다음에 수행할 작업입니다.
			if(!documents.isValid()){													// 사용 가능한 방이 없는 경우(opt RoomCheck)
				//SeqD MakeReservation Step 07(No Available Rooms) Exitpoint
				res.json(util.buildResponse(util.responseCode.NO_ROOM,null));			// 클라이언트에 방이 없음을 알려줍니다.
				return;
			}
			//SeqD MakeReservation Step 08(Show Available Rooms) Exitpoint
			res.json(util.buildResponse(util.responseCode.SUCCESS,documents.toJson()));	// 클라이언트에 남은 방의 개수를 알려줍니다.
			//res.render('remainingRooms.html',{result:documents});
		});
});

// 결졔 (직접 사용되지 않음)
//SeqD MakeReservation Step 18 Entrypoint
router.get('/pay',function(req,res){
	reservationController.pay(req.query.id,null,
			function(documents){res.redirect('/')}); // json 형식으로 뿌리도록 나중에 바꿔야 함
});


//시작날짜에 해당하는 예약 목록
router.get('/listOfDate',function(req,res){
	reservationController.findReservationByStartDate(									// 오늘 체크인하는 예약의 목록을 가져옵니다.
		util.string2Date(req.query.startDate),
		function(documents){
			console.log("type");
			console.log(util.buildResponse(util.responseCode.SUCCESS,documents));
			res.json(util.buildResponse(util.responseCode.SUCCESS,documents));
		});
});

// 예약 취소
router.get('/cancelReservation',function(req,res){
	reservationController.cancelReservation(									// 1. 취소 시도를 합니다.
		req.query.id,															// 입력받은 id는 req.query.id로 넘어옵니다.
		function(r){
			console.log(r);
			if (r == null){
				res.json(util.buildResponse(util.responseCode.FAILURE,null));	// 2-1. 실패
				return;
			}
			res.json(util.buildResponse(util.responseCode.SUCCESS,null));		// 2-2. 성공
		}
	);
});


// 예약 변경
router.get('/modifyReservation', function(req, res) {
	// 0. 입력값을 변환하고 검증합니다.
	var rooms_new=new Rooms(Number(req.query.singleRoom),						// 새롭게 예약한 방의 개수 클래스입니다.
		Number(req.query.doubleRoom),
		Number(req.query.suiteRoom));
	if(!rooms.isValid()){														// 0-1. 음수 방이 있거나 방의 총 개수가 0이면
		res.json(util.buildResponse(util.responseCode.FAILURE, null));			// 클라이언트에 실패했음을 알려줍니다.
		return;
	}
	reservationController.modifyReservation(req.query.id,						// 1. 해당 id에 대한 예약 변경을 시도합니다.
			rooms_new,req.query.phoneNumber,function(r){
		res.json(r);															// 그 결과를 클라이언트에 전달합니다.
	});

});

// 예약 검색
// query.condition : 검색어
// query.search_type : {"rid", "name", "e-mail", "phone"} 중 하나
// search_type을 확인하여 맞는 컨트롤러 함수를 실행
router.get('/searchReservation', function(req,res) {
	switch(req.query.search_type) {
		case 'rid':
			reservationController.findReservationById(req.query.condition, fucntion(resultArray) {
				res.json(util.buildResponse(util.responseCode.SUCCESS, Reservation.arrayFormMultiple(resultArray)));
			});
			break;
		case 'name':
			reservationController.findReservationByName(req.query.condition, fucntion(resultArray) {
				res.json(util.buildResponse(util.responseCode.SUCCESS, Reservation.arrayFormMultiple(resultArray)));
			});
			break;
		case 'e-mail':
			reservationController.findReservationByEmail(req.query.condition, fucntion(resultArray) {
				res.json(util.buildResponse(util.responseCode.SUCCESS, Reservation.arrayFormMultiple(resultArray)));
			});
			break;
		case 'phone':
			reservationController.findReservationByPhone(req.query.condition, fucntion(resultArray) {
				res.json(util.buildResponse(util.responseCode.SUCCESS, Reservation.arrayFormMultiple(resultArray)));
			});
			break;
		default:
			res.json(util.buildResponse(util.responseCode.FAILURE, null));
			return;
	}
});

//예약 번호에 대한 내역 가져오기
router.get('/get/:rid',function(req,res){
	reservationController.findReservationById(req.params.rid,
		function(document){res.json({result:document});});
});

module.exports = router;