const Rooms=require('./Rooms');
const CustomerInfo=require('./CustomerInfo');

module.exports=
class Reservation { 
	constructor(cid,timestamp,startDate,endDate,rooms,customerInfo,status,validity,id) {
		this.cid=cid;
		this.timestamp=timestamp;
		this.startDate=startDate; // - Date 형식의 체크인 날짜 (ex : “20170531”)
		this.endDate=endDate; // - Date 형식의 체크아웃 날짜 (ex : “20170611”)
		this.rooms=rooms; // - Rooms 형식의 사용할 방 갯수
		this.customerInfo=customerInfo; // 고객 정보
		this.status=status;
		this.validity=validity;
		this.id=id;
	}
	/* Status-validity Table
	 * Status		| Valid					| Invalid
	 * -------------+-----------------------+-------------
	 * Not Paid		| Currently Holding		| Hold Timeout
	 * Paid			| Currently Paid		| Cancelled
	 * Checked In	| Currently Checked In	| No Show
	 * Checked Out	| N/A					| Checked out
	 */
	static statusList() {return {notPaid:'Not Paid',
		paid:'Paid',
		checkedIn:'Checked In',
		checkedOut:'Checked Out'};}
	static validityList() {return {valid:'Valid',
		invalid:'Invalid'};}
	setNew(){
		this.status=Reservation.statusList().notPaid;
		this.validity=Reservation.validityList().valid;
	}
	calculatePrice(coupon){
		// TODO Make check of coupon and price loading
		var p=this.rooms.singleRoom*10.0+this.rooms.doubleRoom*15.0+this.rooms.suiteRoom*20.0;
		if(coupon) p=p*0.8;
		return p;
	}
	toString() {
		return "Reservation ID: "+this.id+
			"\nCustomer: "+this.customerInfo.toString()+
			
			"\Rooms: "+this.rooms.toString()+			
			"\nCheckin Date: "+ this.startDate+
			"\nCheckout Date: "+this.endDate+
			"\nReserved At: "+this.timestamp;
	}
	toJson(){
		return {cid:this.cid,
			timestamp:this.timestamp,
			startDate:this.startDate,
			endDate:this.endDate,
			rooms:this.rooms.toJson(),
			customerInfo:this.customerInfo.toJson(),
			status:this.status,
			validity:this.validity};
	}
	static buildFromJson(obj){
		console.log(obj);
		return new Reservation(obj.cid,obj.timestamp,obj.startDate,obj.endDate,
			Rooms.buildFromJson(obj.rooms),CustomerInfo.buildFromJson(obj.customerInfo),
			obj.status,obj.validity,obj._id);
	}
	static buildFromJsonArray(obj){
		for(var i in obj) obj[i]=this.buildFromJson(obj[i]);
		return obj;
	}
};
