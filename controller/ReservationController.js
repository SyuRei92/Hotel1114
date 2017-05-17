var reservationController={};
var dao=require('../dao/daoReservation')();

const Rooms=require('../model/Rooms');
const Reservation=require('../model/Reservation');
const CustomerInfo=require('../model/CustomerInfo');
const util=require('./HotelUtil');

// 예약 기록 만들기
//SeqD MakeReservation Step 07 arrives here
// room: Rooms 객체, 예약할 종류별 방의 개수
reservationController.reserve=
	function(email,startDate,endDate,rooms,hotel,nextJob){
	// TODO Check variables here

	// 객체 만들기
	var reservation=new Reservation(0,0,new Date(startDate.getTime()),endDate,rooms,
			new CustomerInfo("홍길동",email,"000-0000"),"","");
	reservation.setNew();
	//SeqD MakeReservation Step 08(tryBlock)
	// TODO test total rooms again
	
	//SeqD MakeReservation Step 09 arrives here
	//SeqD MakeReservation Step 10
	
	
	// Insert
	//var obj={customerID:customerID,room:room,startDate:startDate,endDate:endDate,hotel:hotel};
	var updater=function(date,endDate_,nextJob_){
		if(date<endDate_){
			dao.updateRoomsByDate(date,rooms,'Hotel1114',function(){
				updater(util.incrementDate(date),endDate_,nextJob_);
			});
		}
		else nextJob_();
	};
	updater(startDate,endDate,function(){
		//SeqD MakeReservation Step 13(createReservation)
		dao.insert(reservation,function(id){nextJob(id);});
	});
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
	dao.queryStartDate(startDate,function(documents){nextJob(documents);});
};
// 방 개수 가져오기
//SeqD MakeReservation Step 02 arrives here
//startDate:체크인 날짜, endDate:체크아웃 날짜, hotel:호텔, nextJob:다음에 처리할 일(인자 1개: 방 개수가 들어있는 Rooms)
reservationController.availableRooms=function(startDate,endDate,hotel,nextJob){
	//SeqD MakeReservation Step 03(queryRoom)
	dao.queryRoomsByDate(startDate,endDate,hotel,function(result){
		// Additional query for the total room count
		dao.queryTotalRooms(hotel,function(rooms){
			//SeqD MakeReservation Step 04(rooms[]) arrives here
			if(typeof result=='undefined') nextJob(rooms);
			else nextJob(rooms.subtract(result));
		});
	});
};


// 예약 취소하기
// rid: 예약 번호
//다음에 처리할 일(nextJob)이라는게 뭐가 있을까?
reservationController.cancelReservation=function(rid, nextJob){
	dao.invalidate(rid, function(something){nextJob(something);});
};

module.exports=reservationController;