$(document).ready(function(){
	var single_limit = 100, double_limit = 100, suite_limit = 100;
	
	var rsv_list = [];
	var detailed_row = -1;
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
	// [["김현성", "010-6545-5483", "hskimbusan@kaist.ac.kr"], "12345", ["2017/01/01", "2017/01/02"], [2, 0, 0], 1234];
	function search_rsv(data){
		if (data.responseCode !== 0){
			return;
		} else {
			rsv_list = data.result;
		}
		/*rsv_list = [];
		rsv_list.push([["김현성", "010-6545-5483", "hskimbusan@kaist.ac.kr"], "12345", ["2017/01/01", "2017/01/02"], [2, 0, 0], 1234]);
		rsv_list.push([["김현성", "010-6545-5483", "hskimbusan@kaist.ac.kr"], "12345", ["2017/01/01", "2017/01/02"], [2, 0, 0], 1234]);*/
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

			var check_detail = '<input type="button" class="mui-btn mui-btn--raised mui-btn--primary" value="Check details" id="detail" data-selector='+i+'>';
			newCell5.innerHTML = check_detail;
		}
	}
	
	function queryCancel(rid){
		$.getJSON('http://'+document.location.host+'/reservation/cancelReservation'
				  +'?rid='+rid, delete_rsv);
	}
	
	function queryModify(rid, singleRoom, doubleRoom, suiteRoom, phone){
		$.getJSON('http://'+document.location.host+'/reservation/modifyReservation'
				  +'?rid='+rid+'&singleRoom='+singleRoom+'&doubleRoom='+doubleRoom+'&suiteRoom='+suiteRoom+'&phone='+phone, modify_rsv);
	}
	
	function searchReservation(){
		cond = $("#cond").val();
		var search_type;
		
		if (cond.split('@').length == 2) search_type = "e-mail";
		else if (!/[A-Za-z]/.test(cond)) {
			if (cond.length == 24) search_type = "rid";
			else search_type = "phone";
		}
		else search_type = "name"; // 이름엔 숫자가 안 들어간다고 가정했습니다.

		/*$.getJSON('http://'+document.location.host+'/reservation/searchReservation'
				  +'?condition='+cond+'&search_type='+search_type, search_rsv);*/
		search_rsv();
	}
	
	$(document).on("click", "#search", searchReservation);
	
	$("#cond").keyup(function(event){
		if (event.keyCode == 13){
			$("#search").click();
		}
	});
	
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
			queryCancel(rsv_list[i][1]);
			window.location.reload();
		}
	});
	
	$(document).on("click", "#modify", function(){
		rsv_table.deleteRow(detailed_row);
		var newRow = rsv_table.insertRow(detailed_row);
		var i = detailed_row-2;
		var newCell1 = newRow.insertCell(0);
		newCell1.colSpan = 5;
		
		var rsv_detail = 
			"<div><table class='mui-table mui-table' style='font-size:15px; border:1px solid #cccccc; width:400px'>"+
				"<th colspan=2> Reservation Modify </th>"+
				"<tr>"+
					"<td> Dates </td>"+
					"<td>"+ rsv_list[i][2][0] + " ~ " + rsv_list[i][2][1] +"</td></tr>"+
				"<tr>"+
					"<td> Rooms </td>"+
					"<td><div class='mui-textfield mui-col-md-4' style='padding-left:0'><label>Single </label><input type='number' id='newsingle' min=0 max="+single_limit+" value=" + rsv_list[i][3][0] + "></div>"+
						"<div class='mui-textfield mui-col-md-4' style='padding-left:0'><label>Double </label><input type='number' id='newdouble' min=0 max="+double_limit+" value=" + rsv_list[i][3][1] + "></div>"+
						"<div class='mui-textfield mui-col-md-4' style='padding-left:0'><label>Suite </label><input type='number' id='newsuite' min=0 max="+suite_limit+" value=" + rsv_list[i][3][2] + "></div></td></tr>"+
				"<tr>"+
					"<td> Phone number </td>"+
					"<td><div class='mui-textfield'><input type='text' id='newphone' style='width:120px' value=" + rsv_list[i][0][1] + "></div></td></tr>";
			"</table></div>";
		
		newCell1.innerHTML = rsv_detail;
		
		var cancelbutton = "<button class='mui-btn mui-btn--raised mui-btn--primary' id='cancelmodify'>" + '<i class="fa fa-arrow-left" aria-hidden="true"></i>'+ " Back </button>"
		var confirm_modify = "<button class='mui-btn mui-btn--raised mui-btn--primary' value='Confirm' id='confirm'>" + '<i class="fa fa-check" aria-hidden="true"></i>' + " Confirm </button>"
		
		newCell1.innerHTML += confirm_modify;
		newCell1.innerHTML += cancelbutton;
		
		newCell1.style.textAlign = "left";
	});
	
	$(document).on("click", "#confirm", function(){
		var ans = confirm("Do you want to modify the reservation?");
		if (ans){
			var newsingle = $("#newsingle").val();
			var newdouble = $("#newdouble").val();
			var newsuite = $("#newsuite").val();
			var newphone = $("#newphone").val();
			
			if (newsingle != rsv_list[detailed_row-2][3][0] || newdouble != rsv_list[detailed_row-2][3][1] || newsuite != rsv_list[detailed_row-2][3][2]){
				alert("Modified Complete. Your payment before will be refunded.");
				// go to payment page
<<<<<<< HEAD
				window.location.href = "./payment.html?startDate="+rsv_list[detailed_row-2][2][0]+"&endDate="+rsv_list[detailed_row-2][2][1]+
					"&singleRoom="+newsingle+"&doubleRoom="+newdouble+"&suiteRoom="+newsuite+"&rid="+rsv_list[detailed_row-2][1]+"&name="+rsv_list[detailed_row-2][0][0]+
					"&email="+rsv_list[detailed_row-2][0][2]+"&phoneNumber="+rsv_list[detailed_row-2][0][1]+"&password="+rsv_list[detailed_row-2][4];
=======
				window.location.href = "./payment.html?rid="+rsv_list[detailed_row-2][1]+"&startDate="+rsv_list[detailed_row-2][2][0]+"&endDate="+rsv_list[detailed_row-2][2][1]+
					"&singleRoom="+newsingle+"&doubleRoom="+newdouble+"&suiteRoom="+newsuite+"&guest-number=1&name="+rsv_list[detailed_row-2][0][0]+
					"&email="+rsv_list[detailed_row-2][0][2]+"&phoneNumber="+rsv_list[detailed_row-2][0][1]+"&password="+rsv_list[detailed_row-2][5];
>>>>>>> f6455467847fb32c3ad4e56cf98b3bd2c5747c47
			}
			else {
				alert("Modified Complete.");
				window.location.reload();
			}
			
			//queryModify(rsv_list[detailed_row-2][1], newsingle, newdouble, newsuite, newphone);
		}
	});
	
	$(document).on("click", "#cancelmodify", function(){
		rsv_table.deleteRow(detailed_row);
		var i = detailed_row-2;
		var newRow = rsv_table.insertRow(i+2);
		var newCell1 = newRow.insertCell(0);

		var rsv_detail = 
			"<table class='mui-table mui-table' style='font-size:15px; border:1px solid #cccccc; width:400px'>"+
				"<th colspan=2> Reservation Detail </th>"+
				"<tr>"+
					"<td> Dates </td>"+
					"<td>"+ rsv_list[i][2][0] + " ~ " + rsv_list[i][2][1] +"</td></tr>"+
				"<tr>"+
					"<td> Rooms </td>"+
					"<td><div class='mui-textfield mui-col-md-4' style='padding-left:0; margin-bottom:0'><label>Single </label>"+rsv_list[i][3][0]+"</div>"+
						"<div class='mui-textfield mui-col-md-4' style='padding-left:0; margin-bottom:0'><label>Double </label>"+rsv_list[i][3][1]+"</div>"+
						"<div class='mui-textfield mui-col-md-4' style='padding-left:0; margin-bottom:0'><label>Suite </label>"+rsv_list[i][3][2]+"</div></td></tr>"+
			"</table>";
		
		newCell1.innerHTML = rsv_detail;

		var backbutton = "<button class='mui-btn mui-btn--raised mui-btn--primary' id='back'>" + '<i class="fa fa-arrow-left" aria-hidden="true"></i>'+ " Back </button>"
		var modify_rsv = "<button class='mui-btn mui-btn--raised mui-btn--primary' id='modify'>" + '<i class="fa fa-pencil" aria-hidden="true"></i>'+ " Modify </button>"
		var cancel_rsv = "<button style='background-color:#F32176' class='mui-btn mui-btn--raised mui-btn--primary' id='cancel'>" + '<i class="fa fa-times" aria-hidden="true"></i>' + " Cancel </button>"

		newCell1.innerHTML += modify_rsv;
		newCell1.innerHTML += cancel_rsv;
		newCell1.innerHTML += backbutton;
		newCell1.colSpan = 5;
		newCell1.style.textAlign = "left";
	});
	
	function showDetail(i){
		var pwd = prompt("Please enter reservation password:", '');
		
		if (pwd != null){
			if (pwd == rsv_list[i][4]){
				detailed_row = i+2;
				$(":button[id^='detail']").prop('disabled', true);
				var newRow = rsv_table.insertRow(i+2);
    			var newCell1 = newRow.insertCell(0);
				
			var rsv_detail = 
				"<table class='mui-table mui-table' style='font-size:15px; border:1px solid #cccccc; width:400px'>"+
					"<th colspan=2> Reservation Detail </th>"+
					"<tr>"+
						"<td> Dates </td>"+
						"<td>"+ rsv_list[i][2][0] + " ~ " + rsv_list[i][2][1] +"</td></tr>"+
					"<tr>"+
						"<td> Rooms </td>"+
						"<td><div class='mui-textfield mui-col-md-4' style='padding-left:0; margin-bottom:0'><label>Single </label>"+rsv_list[i][3][0]+"</div>"+
							"<div class='mui-textfield mui-col-md-4' style='padding-left:0; margin-bottom:0'><label>Double </label>"+rsv_list[i][3][1]+"</div>"+
							"<div class='mui-textfield mui-col-md-4' style='padding-left:0; margin-bottom:0'><label>Suite </label>"+rsv_list[i][3][2]+"</div></td></tr>"+
				"</table>";
				
				newCell1.innerHTML = rsv_detail;
				
				var backbutton = "<button class='mui-btn mui-btn--raised mui-btn--primary' id='back'>" + '<i class="fa fa-arrow-left" aria-hidden="true"></i>'+ " Back </button>"
				var modify_rsv = "<button class='mui-btn mui-btn--raised mui-btn--primary' id='modify'>" + '<i class="fa fa-pencil" aria-hidden="true"></i>'+ " Modify </button>"
				var cancel_rsv = "<button style='background-color:#F32176' class='mui-btn mui-btn--raised mui-btn--primary' id='cancel'>" + '<i class="fa fa-times" aria-hidden="true"></i>' + " Cancel </button>"
				
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