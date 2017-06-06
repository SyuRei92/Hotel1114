const Rooms=require('./Rooms');
const CustomerInfo=require('./CustomerInfo');
const Util=require('../controller/HotelUtil');

module.exports=
class Reservation { 
	constructor(cid,timestamp,startDate,endDate,rooms,customerInfo,status,validity,password,id) {
		this.cid=cid;
		this.timestamp=timestamp;
		this.startDate=startDate; // - Date 형식의 체크인 날짜 (ex : “20170531”)
		this.endDate=endDate; // - Date 형식의 체크아웃 날짜 (ex : “20170611”)
		this.rooms=rooms; // - Rooms 형식의 사용할 방 갯수
		this.customerInfo=customerInfo; // 고객 정보
		this.status=status;
		this.validity=validity;
		this.id=id;
		this.password=password;
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
		var v={cid:this.cid,
			timestamp:this.timestamp,
			startDate:this.startDate,
			endDate:this.endDate,
			rooms:this.rooms.toJson(),
			customerInfo:this.customerInfo.toJson(),
			status:this.status,
			validity:this.validity,
			password:this.password};
		if(this.id) v.id=this.id;
		return v;
	}
	arrayForm(){
		//응답의 format은 아래처럼 해주셨으면 합니다.
		// [["김현성", "010-6545-5483", "hskimbusan@kaist.ac.kr"], "12345", ["2017/01/01", "2017/01/02"], 2, [2, 0, 0], 1234];
		return [[this.customerInfo.name,this.customerInfo.phoneNumber,this.customerInfo.email],this.id,
			[Util.date2String(this.startDate),Util.date2String(this.endDate)],0,
			[this.rooms.singleRoom,this.rooms.doubleRoom,this.rooms.suiteRoom],this.password];
	}
	static buildFromJson(obj){
		console.log(obj);
		return new Reservation(obj.cid,obj.timestamp,obj.startDate,obj.endDate,
			Rooms.buildFromJson(obj.rooms),CustomerInfo.buildFromJson(obj.customerInfo),
			obj.status,obj.validity,obj.password,obj._id);
	}
	static buildFromJsonArray(obj){
		for(var i in obj) obj[i]=this.buildFromJson(obj[i]);
		return obj;
	}
	static arrayFormMultiple(obj){
		for(var i in obj) obj[i]=obj[i].arrayForm();
		return obj;
	}
};
