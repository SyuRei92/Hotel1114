var reservationController={};
var dao=require('../dao/daoReservation')();
var util=require('./HotelUtil');

// 예약 기록 만들기
//SeqD MakeReservation Step 07 arrives here
reservationController.reserve=
	function(customerID,startDate,endDate,room,hotel,nextJob){
	// TODO Check variables here
	for (var property in room) {
	    if (room.hasOwnProperty(property)) {
	        room[property]=Number(room[property]);
	    }
	}
	startDate=util.string2Date(startDate);
	endDate=util.string2Date(endDate);
	
	//SeqD MakeReservation Step 08(tryBlock)
	// TODO test total rooms again
	
	//SeqD MakeReservation Step 09 arrives here
	//SeqD MakeReservation Step 10
	
	
	// Insert
	var obj={customerID:customerID,room:room,startDate:startDate,endDate:endDate,hotel:hotel};
	var updater=function(date,endDate_,nextJob_){
		if(date<endDate_){
			dao.updateRoomsByDate(date,room,'Hotel1114',function(){
				updater(util.incrementDate(date),endDate_,nextJob_);
			});
		}
		else nextJob_();
	};
	updater(startDate,endDate,function(){
		//SeqD MakeReservation Step 13(createReservation)
		var obj={customerID:customerID,room:room,startDate:startDate,endDate:endDate,hotel:hotel};
		dao.insert(obj,function(id){nextJob(id);});
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
//startDate:체크인 날짜, endDate:체크아웃 날짜, hotel:호텔, nextJob:다음에 처리할 일(인자 1개: 결과값)
reservationController.availableRooms=function(startDate,endDate,hotel,nextJob){
	startDate=util.string2Date(startDate);
	endDate=util.string2Date(endDate);
	//SeqD MakeReservation Step 03(queryRoom)
	dao.queryRoomsByDate(startDate,endDate,hotel,function(result){
		// Additional query for the total room count
		dao.queryTotalRooms(hotel,function(rooms){
			//SeqD MakeReservation Step 04(rooms[]) arrives here
			if(typeof result[0]=='undefined') nextJob(rooms);
			else{
				var r={ singleRoom: rooms.singleRoom-result[0].singleRoom,
						doubleRoom: rooms.doubleRoom-result[0].doubleRoom,
						suiteRoom: rooms.suiteRoom-result[0].suiteRoom};
				nextJob(r);
			}
		});
	});
};

module.exports=reservationController;