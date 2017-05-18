module.exports={
	zeroIfNull:function(a){return (typeof a =='number')?a:0;},
	checkNumber:function(a){return (typeof a =='number');},
	checkString:function(a){return (typeof a =='string');},
	checkObject:function(a){return (typeof a =='object');},
	date2String:function(date){return ''+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();},
	string2Date:function(str){
		if(typeof str!='string') return str;
		var t=str.split("-"); return new Date(t[0],t[1]-1,t[2]);},
	string2number:function(str){return Number(str);},
	incrementDate:function(date){date.setDate(date.getDate() + 1); return date;},
	buildResponse:function(responseCode_,result){return {responseCode:responseCode_,result:result};},
	responseCode:{
		SUCCESS:0,
		FAILURE:1,
		NO_ROOM:2,
		NO_AUTH:3,
		ID_DUPL:4
	}
};