module.exports=

class CustomerInfo { 
	constructor(name,email,phoneNumber) {
		this.name=name; // - 이름
		this.email=email; // - 이메일
		this.phoneNumber=phoneNumber; // - 핸드폰 번호. (optional)
	}
	toString() {
		return ""+this.name+"("+this.email+") "+this.phoneNumber;
	}
	changeName(name) {this.name=name;}
	changeEmail(email) {this.email=email;}
	changePhone(phoneNumber) {this.phoneNumber=phoneNumber;}
	toJson(){
		return {name:this.name,
			email:this.email,
			phoneNumber:this.phoneNumber};
	}
	static buildFromJson(obj){
		return new CustomerInfo(obj.name,obj.email,obj.phoneNumber);
	}
};