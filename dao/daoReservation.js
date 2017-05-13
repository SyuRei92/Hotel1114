module.exports=function(collection){
	
	/* Status-validity Table
	 * Status		| Valid					| Invalid
	 * -------------+-----------------------+-------------
	 * Not Paid		| Currently Holding		| Hold Timeout
	 * Paid			| Currently Paid		| Cancelled
	 * Checked In	| Currently Checked In	| No Show
	 * Checked Out	| N/A					| Checked out
	 */
	var reservationDao={cName:'reservation',
						status:{notPaid:'Not Paid',
								paid:'Paid',
								checkedIn:'Checked In',
								checkedOut:'Checked Out'},
						validity:{valid:'Valid',
								invalid:'Invalid'}};
	
	// CRUD on reservation table
	// 1. Create
	// Input: data(reservation data), nextJob(function(_id of inserted data))
	reservationDao.insert=function(data,nextJob){
		collection(reservationDao.cName).insertOne(data).then(nextJob);
	};
	
	// 2. Read
	// 2A. Read by reservation number(rid)
	// Input: rid(reservation number), nextJob(function(document))
	reservationDao.queryRid=function(rid,nextJob){
		collection(reservationDao.cName).findOne({_id:rid}).then(nextJob);
	};
	// 2B. Read by reservation customer ID(cid)
	// Input: cid(customer ID), nextJob(function(document[]))
	reservationDao.queryCid=function(cid,nextJob){
		collection(reservationDao.cName).find({customerID:cid}).toArray().then(
				function(result){nextJob(result);});
	};
	// 2C. Read by reservation start date(startDate)
	// Input: cid(customer ID), nextJob(function(document[]))
	reservationDao.queryCid=function(startDate,nextJob){
		collection(reservationDao.cName).find({startDate:{$gte:startDate}}).toArray().then(
				function(result){nextJob(result);});
	};
	// 3. Update
	// 3A. Update reservation information
	// Update email and name for the reservation with the given ID.
	// Input: rid, name(new name), email(new email), nextJob(function(_id of updated data))
	reservationDao.updateInfo=function(rid,name,email,nextJob){
		collection(reservationDao.cName).updateOne(
				{_id: rid},
				{$set: { name: name, email: email },
				    $currentDate: { lastModified: true }}).then(nextJob);
	};
	// 3B. Invalidate reservation by reservation number(rid)
	// Set the validity flag invalid, for the reservation with the given ID.
	// Input: rid, nextJob(function(_id of updated data))
	reservationDao.invalidate=function(rid,nextJob){
		collection(reservationDao.cName).updateOne(
				{_id: rid},
				{$set: { validity: reservationDao.validity.invalid },
				    $currentDate: { lastModified: true }}).then(nextJob);
	};
	// 4. Delete (N/A)
	// 5. Aggregation
	/* Testing
	reservationDao.readRoomsInUse=function(startDate,endDate,hotel){
		collection(reservationDao.cName).mapReduce(
			// For each reservations, first generate the list of (date,room) pair s by
			function(){
				// from the reservation startDate capped by the entered startDate
				var reservationStart=this.startDate<startDate?startDate:this.startDate;
				// to the reservation endDate capped by the entered endDate
				var reservationEnd=this.endDate>endDate?endDate:this.endDate;
				// for each day within the period, produce such pair.
				for(var today=reservationStart;today<reservationEnd;today.setDate(today.getDate() + 1))
					emit({day:today},this.room);
				},
			// Then, obtain the sum of the reserved rooms for each day.
			function(k, values) {
			    var result = {};
			    for(i in values){
			    	for (attrname in values[i]) {
			    		if(!result[attrname]) result[attrname] = 0;
			    		result[attrname]+=values[i][attrname];
			    	}
			    }
			    return result;
			},
			{query:{validity:reservationDao.validity.valid, // These operations are performed for valid reservations
					hotel:hotel, // in the specified hotel
					startDate: { $lt: endDate }, // such that its startDate is less than the specified endDate,
					endDate: { $gt: startDate }}, // and its endDate is greater than the specified startDate.
			 out:'emptyRoomByDate'}); // with the results in the collection emptyRoomByDate.
	};
	*/
	
	return reservationDao;
};