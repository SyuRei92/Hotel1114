var reservationController={};
var dao={};

// Fetch the number of available rooms in the given period
// Request: {startDate:date, endDate:date}
// Response: {single:Int, double:Int, suite:Int}
/*
reservationController.availableRooms=
	function(startdate,enddate){
	return reservationDao.availableRooms();
};
reservationController.getRooms=function(){
	return reservationDao.findReservation(123);
};
*/

// 예약 기록 추가
reservationController.reserve=
	function(customerID,startDate,endDate,room,nextJob){
	// TODO Check variables here
	
	// Insert
	var obj={customerID:customerID,room:room,startDate:startDate,endDate:endDate,hotel:'Hotel1114'};
	dao.reservation.insert(obj,function(id){nextJob(id);});
};

// 예약 번호로 찾기
reservationController.findReservationById=function(rid,nextJob){
	dao.reservation.queryRid(rid,function(document){nextJob(document);});
};

// 계정으로 찾기
reservationController.findReservationByAccount=function(cid,nextJob){
	dao.reservation.queryCid(cid,function(documents){nextJob(documents);});
};

module.exports=function(dao_){
	dao=dao_;
	return reservationController;
};