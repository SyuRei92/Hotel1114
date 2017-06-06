var reservationController={};
var dao=require('../dao/daoReservation')();

const Rooms=require('../model/Rooms');
const Reservation=require('../model/Reservation');
const CustomerInfo=require('../model/CustomerInfo');
const util=require('./HotelUtil');
const ContactManager=require('./ContactManager');

// 예약 기록 만들기
//SeqD MakeReservation Step 09 arrives here
// room: Rooms 객체, 예약할 종류별 방의 개수
reservationController.reserve=
	function(customerInfo, startDate,endDate,rooms,hotel,nextJob,failJob){
	// TODO Check variables here

	var startDate_reservation=new Date(startDate.getTime());
	var endDate_reservation=new Date(endDate.getTime());
	if(!rooms.isValid()){
		// SeqD MakeReservation Step 10
		// 선택한 방의 개수가 올바르지 않음
		failJob(util.responseCode.NO_ROOM);
		return;
	}

	//SeqD MakeReservation Step 11
	// Test total rooms again (이 부분은 critical section을 걸어줘야 안전함)
	reservationController.availableRooms(startDate,endDate,hotel,function(result){
		//SeqD MakeReservation Step 12 arrives here
		if(!result.subtract(rooms).isValid0()){
			//SeqD MakeReservation Step 13
			// 날짜 선택 시점과 방 예약 시점 사이에 예약할 방이 꽉 찼음
			failJob(util.responseCode.FAILURE);
			return;
		}
		
		
		// Insert
		//var obj={customerID:customerID,room:room,startDate:startDate,endDate:endDate,hotel:hotel};
		var updater=function(date,endDate_,nextJob_){
			if(date<endDate_){
				//SeqD MakeReservation Step 14
				dao.updateRoomsByDate(date,rooms,'Hotel1114',function(){
					updater(util.incrementDate(date),endDate_,nextJob_);
				});
			}
			else nextJob_();
		};
		updater(startDate,endDate,function(){
			// 객체 만들기
			var reservation=new Reservation(0,0,startDate_reservation,endDate_reservation,rooms,
					customerInfo,"","");
			reservation.setNew();
			//SeqD MakeReservation Step 16(createReservation)
			dao.insert(reservation,function(id){nextJob(id);});
		});		
	});
	// critical section의 끝
};

// 예약 번호로 찾기
reservationController.findReservationById=function(rid,nextJob){
	dao.queryRid(rid,function(document){nextJob(document);});
};

// 계정으로 찾기
reservationController.findReservationByAccount=function(cid,nextJob){
	dao.queryCid(cid,function(documents){nextJob(documents);});
};

//시작일로 찾기
reservationController.findReservationByStartDate=function(startDate,nextJob){
	dao.queryStartDate(startDate,function(documents){
		nextJob(documents);});
};

//아무거나 찾기
reservationController.findReservation=function(x,nextJob){
	dao.queryAnything(startDate,function(documents){
		nextJob(documents);});
};

// 방 개수 가져오기
//SeqD MakeReservation Step 04 arrives here
//startDate:체크인 날짜, endDate:체크아웃 날짜, hotel:호텔, nextJob:다음에 처리할 일(인자 1개: 방 개수가 들어있는 Rooms)
reservationController.availableRooms=function(startDate,endDate,hotel,nextJob){
	//SeqD MakeReservation Step 05(queryRoom)
	dao.queryRoomsByDate(startDate,endDate,hotel,function(result){
		// Additional query for the total room count
		dao.queryTotalRooms(hotel,function(rooms){
			//SeqD MakeReservation Step 06(availableRoom) arrives here
			if(typeof result=='undefined') nextJob(rooms);
			else nextJob(rooms.subtract(result));
		});
	});
};

// 지불하기(TBD)
reservationController.pay=function(id,coupon,nextJob){
	// TODO Virtual Payment Logic (TBD)
	console.log("Pay started: "+id);
	
	reservationController.findReservationById(id,function(result){
		if(result==null || typeof result == 'undefined') {
			nextJob(null);
			return;
		}
		//SeqD MakeReservation Step 19
		console.log("Price: "+result.calculatePrice());
		

		reservationController.makePayment();
		
		//SeqD MakeReservation Step 20
		dao.setPaid(result.id,function(id_){
			console.log("Corresponding reservation found: "+result.id);
			console.log("Sending Email to: "+result);
			//SeqD MakeReservation Step 21
			ContactManager.sendComfirmMail(result);
			//SeqD MakeReservation Step 22
			nextJob(result.id);
		});
	});
};
reservationController.makePayment=function(){
	// TODO Payment function will be determined later
}

// 예약 취소하기
// rid: 예약 번호
// 컨트롤러 단에서 처리할 일은 특별히 없으며, DAO의 invalidate를 릴레이합니다.
reservationController.cancelReservation=function(rid, nextJob){
	dao.invalidate(rid, function(documents){nextJob(documents);});
};


// 예약 변경하기
// rid: 예약 번호
reservationController.modifyReservation = function(rid, rooms_new, phoneNumber, nextJob) {
	// 1. 해당 req.rid에 해당하는 예약이 있는지 확인
	// 2. req.rid에 대한 예약이 없다면 res에 해당 번호의 예약이 없음을 보내고 종료
	// 3-1. 기존 예약의 시작날짜/종료날짜, 각 방의 갯수를 획득.
	// 3-2. 해당 날짜의 남은 방 갯수를 획득 후 기존 예약의 방 갯수를 가산.(예약 가능한 방의 갯수를 계산)
	// 4-1. 방의 갯수가 너무 많아서 예약이 불가능하면 불가능하다고 응답하고 종료.
	// 4-2. 정상적인 방 갯수라면 reservationController에 있는 함수 modifyReservation을 실행. 근데 Rooms는 어떻게 넘겨줘야 할 지 고민중.
	// 5-1. 성공했다면 res에 성공했다고 보냄
	// 5-2. 실패했다면 res에 실패한 이유를 보냄. 실패하는 경우가 있는지 모르겠어서 일단 안 함.
	reservationController.findReservationById(									// 1. 해당 id에 대한 예약이 있는지 확인합니다.
		rid,															// 입력받은 id는 req.query.id로 넘어옵니다.
		function(reservationObj) {
			if (reservationObj == null){										// 2. 예약이 없다면 실패
				nextJob(util.buildResponse(util.responseCode.FAILURE, null));
				return;
			}
			var rooms_old=reservationObj.rooms;									// 3-1. 기존 예약의 방의 갯수를 획득합니다.
			var startDate=reservationObj.startDate;								// 체크인, 체크아웃 날짜도 가져옵니다.
			var endDate=reservationObj.endDate;
			reservationController.availableRooms(startDate,endDate,'Hotel1114',	// 3-2. 날짜로부터 예약 가능한 방 개수를 가져옵니다.
				function(rooms_remain){
					if(!rooms_remain.subtract(rooms_new.subtract(rooms_old)).isValid0()){	// 4-1. 방의 개수가 많으면 실패
						nextJob(util.buildResponse(util.responseCode.FAILURE, null));
						return;
					}
					dao.modifyReservation(rid, rooms, phoneNumber, function(){				// 4-2. DAO를 불러서 실제 예약을 진행합니다.
						nextJob(util.buildResponse(util.responseCode.SUCCESS, null));		// 성공
					});	
			});
		}
	);
};

module.exports=reservationController;