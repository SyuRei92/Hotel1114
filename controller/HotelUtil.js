module.exports={
	zeroIfNull:function(a){return (typeof a =='number')?a:0;},
	checkNumber:function(a){return (typeof a =='number');},
	checkString:function(a){return (typeof a =='string');},
	date2String:function(date){return date.format('yyyy-MM-dd');},
	string2Date:function(str){var t=str.split("-"); return new Date(t[0],t[1]-1,t[2]);},
	string2number:function(str){return Number(str);},
	incrementDate:function(date){date.setDate(date.getDate() + 1); return date;}
};