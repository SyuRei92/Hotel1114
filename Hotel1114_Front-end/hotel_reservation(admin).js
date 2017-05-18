var rsv_list = [];
var rsv_table = document.getElementById("reservation");

function makeReservationTable(data) {
	var index = 1;
	var numRows = rsv_table.rows.length;
	for (i = 1; i < numRows; i++){
		rsv_table.deleteRow(1);
	}
	
	for (var reservation in data.result) {
		var rid = data.result[reservation].id;
		var startDate = data.result[reservation].startDate;
		var endDate = data.result[reservation].endDate;
		var numOfRooms = data.result[reservation].rooms;
		console.log(startDate);

		// index, rid, startDate ~ endDate, numOfRooms
		var newRow = rsv_table.insertRow();
		var newCell1 = newRow.insertCell(0);
		var newCell2 = newRow.insertCell(1);
		var newCell3 = newRow.insertCell(2);
		var newCell4 = newRow.insertCell(3);
		newCell1.innerHTML = index++;
		newCell2.innerHTML = rid;
		newCell3.innerHTML = startDate + "~" + endDate;
		newCell4.innerHTML = "single: "+ numOfRooms.singleRoom + "\ndouble: "+ numOfRooms.doubleRoom + "\nsuite: "+ numOfRooms.suiteRoom;
	}
}

function queryDate(startDate) {
  	$.getJSON(
  		'http://'+document.location.host+'/reservation/listOfDate' +
  		'?startDate='+startDate, makeReservationTable);
}


$(document).ready(function(){
	rsv_table = document.getElementById("reservation");
	// db에서 가지고 와야 함
	rsv_list.push([27914, "2017-05-01", "2017-05-05", "single: 3\n double: 0\n suite: 0"]);
	rsv_list.push([27915, "2017-05-02", "2017-05-06", "single: 1\n double: 0\n suite: 0"]);
	rsv_list.push([27916, "2017-05-03", "2017-05-07", "single: 1\n double: 2\n suite: 0"]);
	rsv_list.push([27917, "2017-05-04", "2017-05-08", "single: 1\n double: 0\n suite: 2"]);
	rsv_list.push([27918, "2017-05-05", "2017-05-09", "single: 0\n double: 0\n suite: 0"]);
	
	function bindEvents(){
		today = new Date();
		dd = today.getDate();
		mm = today.getMonth()+1;
		yyyy = today.getFullYear();
		
		if (dd < 10) dd = '0'+dd;
		if (mm < 10) mm = '0'+mm;
		
		//today = mm+'/'+dd+'/'+yyyy;
		today = yyyy + '-' + mm + '-' + dd;
		$("#datefilter").val(today);
		queryDate(today);
		
		$(document).on("change", "#datefilter", function(){
			queryDate($("#datefilter").val());
		});
	}
	
	bindEvents();
});
