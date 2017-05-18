function makeReservationTable(data) {
	var index = 0;

	for (var reservation in data.result) {
		index ++;

		var rid = reservation.rid;
		var startDate = reservation.startDate;
		var endDate = reservation.endDate;
		var numOfRooms = reservation.rooms;

		// 표를 만드시면 될 듯 합니다.
		// index, rid, startDate ~ endDate, numOfRooms
	}
}

function queryDate(startDate) {
  	$.getJSON(
  		'http://'+document.location.host+'/reservation/listOfDate' +
  		'?startDate='+startDate.format('YYYY-MM-DD'),
		makeReservationTable);
}

$(document).ready(function(){
	var rsv_list = [];
	var rsv_table = document.getElementById("reservation");
	
	// db에서 가지고 와야 함
	rsv_list.push([27914, "2017-05-01", "2017-05-05", 3]);
	rsv_list.push([27915, "2017-05-02", "2017-05-06", 5]);
	rsv_list.push([27916, "2017-05-03", "2017-05-07", 1]);
	rsv_list.push([27917, "2017-05-04", "2017-05-08", 2]);
	rsv_list.push([27918, "2017-05-05", "2017-05-09", 3]);
	
	function bindEvents(){
		$(document).on("change", "#datefilter", function(){
			showFilteredReservation($("#datefilter").val());
		});
	}
	
	function showFilteredReservation(date){
		var numRows = rsv_table.rows.length;
		for (i = 1; i < numRows; i++){
			rsv_table.deleteRow(1);
		}
		var index = 1;
		for (i = 0; i < rsv_list.length; i++){
			if (rsv_list[i][1] <= date && rsv_list[i][2] >= date){
				var newRow = rsv_table.insertRow();
				var newCell1 = newRow.insertCell(0);
				var newCell2 = newRow.insertCell(1);
		    	var newCell3 = newRow.insertCell(2);
		    	var newCell4 = newRow.insertCell(3);
				newCell1.innerHTML = index++;
				newCell2.innerHTML = rsv_list[i][0];
				newCell3.innerHTML = rsv_list[i][1] + "~" + rsv_list[i][2];
				newCell4.innerHTML = rsv_list[i][3];
			}			
		}
		
	}
	
	bindEvents();
});