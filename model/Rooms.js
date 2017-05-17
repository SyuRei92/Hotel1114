var util=require('../controller/HotelUtil');

module.exports=
class Rooms { 
	constructor(singleRoom,doubleRoom,suiteRoom) {
		this.singleRoom=singleRoom; // - 사용할 single 방 갯수 (0 이상, 상한선 이하의 정수)
		this.doubleRoom=doubleRoom; // - 사용할 double 방 갯수 (0 이상, 상한선 이하의 정수)
		this.suiteRoom=suiteRoom; // - 사용할 suite 방 갯수 (0 이상, 상한선 이하의 정수)
	}
	toString() {
		return "Single("+this.singleRoom+"), Double("+this.doubleRoom+"), Suite("+this.suiteRoom+")";
	}
	isValid(){
		return this.singleRoom>=0 && this.doubleRoom>=0 && this.suiteRoom>=0
			&& (this.singleRoom+this.doubleRoom+this.suiteRoom)>0;
	}
	subtract(r){
		return new Rooms(this.singleRoom-util.zeroIfNull(r.singleRoom),
				this.doubleRoom-util.zeroIfNull(r.doubleRoom),
				this.suiteRoom-util.zeroIfNull(r.suiteRoom));
	}
	toJson(){
		return {singleRoom:this.singleRoom,
			doubleRoom:this.doubleRoom,
			suiteRoom:this.suiteRoom};
	}
	static buildFromJson(obj){
		return new Rooms(obj.singleRoom,obj.doubleRoom,obj.suiteRoom);
	}
};

