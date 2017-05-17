const Rooms=require('../model/Rooms');
const Reservation=require('../model/Reservation');
const CustomerInfo=require('../model/CustomerInfo');

module.exports=function(){
	var db=global.db.collection('account');
	var accountDao={};
	
	// CRUD on account table
	// 1. Create
	// Input: data(type Reservation), nextJob(function(_id of inserted data))
	accountDao.insert=function(data,nextJob){
	};
	
	return accountDao;
};