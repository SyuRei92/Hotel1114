$(document).ready(function(){

	var all_list = [];
	var rsv_list = [];
	
	var detailed_row = -1;
	all_list.push([["김현성", "010-6545-5483", "hskimbusan@kaist.ac.kr"], "12345", ["2017/01/01", "2017/01/02"], 2, [2, 0, 0], 1234]);
	all_list.push([["박기완", "010-1234-5678", "zprime0920@kaist.ac.kr"], "12346", ["2017/01/03", "2017/01/04"], 2, [0, 1, 0], 5678]);
	all_list.push([["김현성", "010-6545-5483", "hskimbusan@naver.com"], "12347", ["2017/01/01", "2017/01/02"], 4, [0, 0, 1], 1234]);	
	
	
	var rsv_table = document.getElementById("reservations");
	
	var numRow = rsv_table.rows.length;

	function delete_rsv(data){
		if (data.responseCode !== 0){
			return;
		} else {
			return;
		}
	}
	
	function modify_rsv(data){
		if (data.responseCode !== 0){
			return;
		} else {
			return;
		}
	}
	
	
	//응답의 format은 아래처럼 해주셨으면 합니다.
	// [["김현성", "010-6545-5483", "hskimbusan@kaist.ac.kr"], "12345", ["2017/01/01", "2017/01/02"], 2, [2, 0, 0], 1234];
	function search_rsv(data){
		if (data.responseCode !== 0){
			return;
		} else {
			rsv_list = data.result;
		}
		
		var numRow = rsv_table.rows.length;
		for (i = 1; i < numRow; i++){
			rsv_table.deleteRow(1);
		}
	
		if (rsv_list.length == 0){
			var newRow = rsv_table.insertRow(1);
			var newCell1 = newRow.insertCell(0);
			newCell1.colSpan = 5;
			
			newCell1.innerHTML = "No results found."
		}
		for (i = 0; i < rsv_list.length; i++){
			var newRow = rsv_table.insertRow(i+1);
			var newCell1 = newRow.insertCell(0);
			var newCell2 = newRow.insertCell(1);
			var newCell3 = newRow.insertCell(2);
			var newCell4 = newRow.insertCell(3);
			var newCell5 = newRow.insertCell(4);

			newCell1.innerHTML = rsv_list[i][1];
			newCell2.innerHTML = rsv_list[i][0][0];
			newCell3.innerHTML = rsv_list[i][0][2];
			newCell4.innerHTML = rsv_list[i][0][1];

			var check_detail = '<input type="button" value="Check details" id="detail" data-selector='+i+'>';
			newCell5.innerHTML = check_detail;
		}
	}
	
	function queryCancel(rid){
		$.getJSON('http://'+document.location.host+'/reservation/cancelReservation'
				  +'?rid='+rid, delete_rsv);
	}
	
	function queryModify(rid, singleRoom, doubleRoom, suiteRoom, phone){
		$.getJSON('http://'+document.location.host+'/reservation/modifyReservation'
				  +'?rid='+rid+'?singleRoom='+singleRoom+'?doubleRoom='+doubleRoom+'?suiteRoom='+suiteRoom+'?phone='+phone, modify_rsv);
	}
	
	$(document).on("click", "#search", function(){
		searchReservation();
	});
	/*
	function searchReservation(){
		rsv_list = [];
		for (i = 0; i < all_list.length; i++){
			if (all_list[i][1] == $("#cond").val())
				rsv_list.push(all_list[i]);
			
			if (all_list[i][0][0] == $("#cond").val())
				rsv_list.push(all_list[i]);
			
			if (all_list[i][0][1] == $("#cond").val())
				rsv_list.push(all_list[i]);
			
			if (all_list[i][0][2] == $("#cond").val())
				rsv_list.push(all_list[i]);
		}
		
		var numRow = rsv_table.rows.length;
		for (i = 1; i < numRow; i++){
			rsv_table.deleteRow(1);
		}
	
		if (rsv_list.length == 0){
			var newRow = rsv_table.insertRow(1);
			var newCell1 = newRow.insertCell(0);
			newCell1.colSpan = 5;
			
			newCell1.innerHTML = "No results found."
		}
		for (i = 0; i < rsv_list.length; i++){
			var newRow = rsv_table.insertRow(i+1);
			var newCell1 = newRow.insertCell(0);
			var newCell2 = newRow.insertCell(1);
			var newCell3 = newRow.insertCell(2);
			var newCell4 = newRow.insertCell(3);
			var newCell5 = newRow.insertCell(4);

			newCell1.innerHTML = rsv_list[i][1];
			newCell2.innerHTML = rsv_list[i][0][0];
			newCell3.innerHTML = rsv_list[i][0][2];
			newCell4.innerHTML = rsv_list[i][0][1];

			var check_detail = '<input type="button" value="Check details" id="detail" data-selector='+i+'>';
			newCell5.innerHTML = check_detail;

		}
	}*/
	
	function searchReservation(){
		cond = $("#cond").val();
		$.getJSON('http://'+document.location.host+'/reservation/searchReservation'
				  +'?condition='+cond, search_rsv);
	}
	
	$(document).on("click", "#detail", function() {
        var selector = $(this).data('selector');
		showDetail(selector);
    });
	
	$(document).on("click", "#back", function() {
		rsv_table.deleteRow(detailed_row);
		$(":button[id^='detail']").prop('disabled', false);
    });
	
	$(document).on("click", "#cancel", function(){
		var ans = confirm("Do you want to cancel this reservation?");
		var i = detailed_row - 2;
		if (ans){
			alert("Cancel complete. You will be refunded.");
			// send query
			queryCancel(rsv_list[i][1]);
			window.location.reload();
		}
	});
	
	$(document).on("click", "#modify", function(){
		rsv_table.deleteRow(detailed_row);
		var newRow = rsv_table.insertRow(detailed_row);
		var i = detailed_row - 2;
		var newCell1 = newRow.insertCell(0);
		newCell1.colSpan = 5;
		
		newCell1.innerHTML = "Reservation Modify"+"</br>";
		newCell1.innerHTML += "Date : " + rsv_list[i][2][0] + "~" + rsv_list[i][2][1] + "</br>";
		newCell1.innerHTML += "Guests : " + rsv_list[i][3] + "</br>";
		
		newCell1.innerHTML += "Single : " + "<input type='text' id='newsingle' value=" + rsv_list[i][4][0] + ">" + "</br>";
		newCell1.innerHTML += "Double : " + "<input type='text' id='newdoublee' value=" + rsv_list[i][4][1] + ">" + "</br>";
		newCell1.innerHTML += "Suite : " + "<input type='text' id='newsuite' value=" + rsv_list[i][4][2] + ">" + "</br>";
		newCell1.innerHTML += "Phone number : " + "<input type='text' id='newsuite' value=" + rsv_list[i][0][1] + ">" + "</br>";
		
		var cancelbutton = "<input type='button' value='Back' id='cancelmodify'>"
		var confirm_modify = "<input type='button' value='Confirm' id='confirm'>"
		
		newCell1.innerHTML += confirm_modify;
		newCell1.innerHTML += cancelbutton;
		
		newCell1.style.textAlign = "left";
	});
	
	$(document).on("click", "#confirm", function(){
		var ans = confirm("Do you want to modify the reservation?");
		if (ans){
			alert("Modified Complete.");
			// go to payment page
			// get refunded and pay
			
			queryModify(rsv_list[i][1]);
			window.location.reload();
		}
	});
	
	$(document).on("click", "#cancelmodify", function(){
		rsv_table.deleteRow(detailed_row);
		var i = detailed_row-2;
		var newRow = rsv_table.insertRow(i+2);
		var newCell1 = newRow.insertCell(0);

		newCell1.innerHTML = "Reservation Detail"+"</br>";
		newCell1.innerHTML += "Date : " + rsv_list[i][2][0] + "~" + rsv_list[i][2][1] + "</br>";
		newCell1.innerHTML += "Guests : " + rsv_list[i][3] + "</br>";
		newCell1.innerHTML += "Single : " + rsv_list[i][4][0] + "</br>";
		newCell1.innerHTML += "Double : " + rsv_list[i][4][1] + "</br>";
		newCell1.innerHTML += "Suite : " + rsv_list[i][4][2] + "</br>";

		var backbutton = "<input type='button' value='Back' id='back'>"
		var modify_rsv = "<input type='button' value='Modify' id='modify'>"
		var cancel_rsv = "<input type='button' value='Cancel' id='cancel'>"

		newCell1.innerHTML += modify_rsv;
		newCell1.innerHTML += cancel_rsv;
		newCell1.innerHTML += backbutton;
		newCell1.colSpan = 5;
		newCell1.style.textAlign = "left";
	});
	
	function showDetail(i){
		var pwd = prompt("Please enter reservation password:", '');
		
		if (pwd != null){
			if (pwd == rsv_list[i][5]){
				detailed_row = i+2;
				$(":button[id^='detail']").prop('disabled', true);
				var newRow = rsv_table.insertRow(i+2);
    			var newCell1 = newRow.insertCell(0);
				
				newCell1.innerHTML = "Reservation Detail"+"</br>";
				newCell1.innerHTML += "Date : " + rsv_list[i][2][0] + "~" + rsv_list[i][2][1] + "</br>";
				newCell1.innerHTML += "Guests : " + rsv_list[i][3] + "</br>";
				newCell1.innerHTML += "Single : " + rsv_list[i][4][0] + "</br>";
				newCell1.innerHTML += "Double : " + rsv_list[i][4][1] + "</br>";
				newCell1.innerHTML += "Suite : " + rsv_list[i][4][2] + "</br>";
				
				var backbutton = "<input type='button' value='Back' id='back'>"
				var modify_rsv = "<input type='button' value='Modify' id='modify'>"
				var cancel_rsv = "<input type='button' value='Cancel' id='cancel'>"
				
				newCell1.innerHTML += modify_rsv;
				newCell1.innerHTML += cancel_rsv;
				newCell1.innerHTML += backbutton;
				newCell1.colSpan = 5;
				newCell1.style.textAlign = "left";
			}
			else{
				alert("Invalid password");
			}
		}
	}
});