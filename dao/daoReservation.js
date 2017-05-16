module.exports=function(){
	
	/* Status-validity Table
	 * Status		| Valid					| Invalid
	 * -------------+-----------------------+-------------
	 * Not Paid		| Currently Holding		| Hold Timeout
	 * Paid			| Currently Paid		| Cancelled
	 * Checked In	| Currently Checked In	| No Show
	 * Checked Out	| N/A					| Checked out
	 */
	var reservationDao={status:{notPaid:'Not Paid',
								paid:'Paid',
								checkedIn:'Checked In',
								checkedOut:'Checked Out'},
						validity:{valid:'Valid',
								invalid:'Invalid'}};
	var db=global.db.collection('reservation');
	
	
	// CRUD on reservation table
	// 1. Create
	// Input: data(reservation data), nextJob(function(_id of inserted data))
	reservationDao.insert=function(data,nextJob){
		db.insertOne(data).then(nextJob);
	};
	
	// 2. Read
	// 2A. Search by reservation number(rid)
	// Input: rid(reservation number), nextJob(function(document))
	reservationDao.queryRid=function(rid,nextJob){
		db.findOne({_id:rid}).then(nextJob);
	};
	// 2B. Search by reservation customer ID(cid)
	// Input: cid(customer ID), nextJob(function(document[]))
	reservationDao.queryCid=function(cid,nextJob){
		db.find({customerID:cid}).toArray().then(
				function(result){nextJob(result);});
	};
	// 2C. Search by reservation start date(startDate)
	// Input: cid(customer ID), nextJob(function(document[]))
	reservationDao.queryStartDate=function(startDate,nextJob){
		db.find({startDate:startDate}).toArray().then(
				function(result){nextJob(result);});
	};
	// 3. Update
	// 3A. Update reservation information
	// Update email and name for the reservation with the given ID.
	// Input: rid, name(new name), email(new email), nextJob(function(_id of updated data))
	reservationDao.updateInfo=function(rid,name,email,nextJob){
		db.updateOne(
				{_id: rid},
				{$set: { name: name, email: email },
				    $currentDate: { lastModified: true }}).then(nextJob);
	};
	// 3B. Invalidate reservation by reservation number(rid)
	// Set the validity flag invalid, for the reservation with the given ID.
	// Input: rid, nextJob(function(_id of updated data))
	reservationDao.invalidate=function(rid,nextJob){
		db.updateOne(
				{_id: rid},
				{$set: { validity: reservationDao.validity.invalid },
				    $currentDate: { lastModified: true }}).then(nextJob);
	};
	
	// 4. Delete (N/A)
	
	// 5. Aggregation
	// 5A. 호텔의 전체 방 개수를 질의한다.
	// hotel:호텔, nextJob:다음에 처리할 일(인자 1개: 결과값)
	reservationDao.queryTotalRooms=function(hotel,nextJob){
		global.db.collection('room').findOne({hotel:hotel}).then(
				function(result){console.log(result);nextJob(result);});
	};
	
	// 5B. 해당 기간에 예약된 방 개수의 종류별 최대값을 확인한다.
	// startDate:체크인 날짜, endDate:체크아웃 날짜, hotel:호텔, nextJob:다음에 처리할 일(인자 1개: 결과값)
	reservationDao.queryRoomsByDate=function(startDate,endDate,hotel,nextJob){
		global.db.collection('reservedRoomsByDate').aggregate([
			{$match : {date:{ $gte: startDate, $lt: endDate }, hotel:hotel}},
			{$group : {
				_id: null,
				singleRoom: { $max: "$singleRoom" },
				doubleRoom: { $max: "$doubleRoom" },
				suiteRoom: { $max: "$suiteRoom" }}
			}
		]).toArray().then(function(result){nextJob(result);});
	};
	
	// 5C. 해당 날짜에 예약된 방 개수를 증가시킨다.
	// date: 날짜, rooms:새로 예약한 방 목록, hotel:호텔, nextJob:다음에 처리할 일(인자 0개)
	reservationDao.updateRoomsByDate=function(date,rooms,hotel,nextJob){
		console.log("Update Call:"+date+","+rooms);
		global.db.collection('reservedRoomsByDate').update(
			{ date:date,hotel:hotel },
			{
				$setOnInsert:{date:date,hotel:hotel},
				$inc: rooms
			},
			{ upsert: true }
			).then(function(result){nextJob();});
	};
	
	return reservationDao;
};