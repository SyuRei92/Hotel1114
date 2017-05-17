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
		return singleRoom>=0 && doubleRoom>=0 && suiteRoom>=0 && (singleRoom+doubleRoom+suiteRoom)>0;
	}
	subtract(r){
		return new Rooms(this.singleRoom-r.singleRoom,this.doubleRoom-r.doubleRoom,this.suiteRoom-r.suiteRoom);
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

