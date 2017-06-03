var single_limit = 100, double_limit = 100, suite_limit = 100;
var toggleEls = document.querySelectorAll('[data-mui-controls^="pane-events-"]');

function setRemainingRoom(data) {
	if (data.responseCode !== 0) { // No available rooms
		$("#room_number").after('<div class="mui-col-md-8"> NO Room available </div>');
		$("#room_number").remove();
		console.log("예약 가능한 방이 없습니다.");
		data = {singleRoom: 0, doubleRoom: 0, suiteRoom: 0};
	} else {
		data = data.result;
	}
	single_limit = data.singleRoom;
	double_limit = data.doubleRoom;
	suite_limit = data.suiteRoom;
}

function queryDate(startDate, endDate) {
	$.getJSON('http://' + document.location.host + '/reservation/available' + '?startDate=' + startDate.format('YYYY-MM-DD') + '&endDate=' + endDate.format('YYYY-MM-DD'),
						setRemainingRoom);
}

// return the list of set of room type and number
// input: guest-number of guest
// list of [single: num, double: num, suite, num]
function calculateRoom(guest) {
	var single, double, suite;
	single = guest;
	double = Math.floor(guest / 2);
	if (guest % 2 !== 0) {
		double += 1;
	}
	suite = Math.floor(guest / 4);
	if (guest % 4 !== 0) {
		suite += 1;
	}
	return {"single": single, "double": double, "suite": suite};
}

$(document).ready(function () {
  var totalPrice = 0;
	
	// draw date range picker
	$('input[name="daterange"]').daterangepicker({
		locale: {
			format: 'YYYY-MM-DD'
		},
		startDate: moment(),
		endDate: moment().add('days', 1),
		minDate: moment(),
		"autoApply": true,
		"opens": "embed"
	});
	
	// send query when user select dates
	$('input[name="daterange"]').on('apply.daterangepicker', function (ev, picker) {
		var start = picker.startDate, end = picker.endDate;
		
		$('input[name="startDate"]').val(start.format("YYYY-MM-DD"));
		$('input[name="endDate"]').val(end.format("YYYY-MM-DD"));

		queryDate(start, end);
	});
	
  function bindEvents() {
    // click payment confirm button
    $(document).on("click", "#payment_confirm", function () {
      alert("Success!");
      location.href = "./mainpage.html";
    });
		
		// enters guest number
		$('input[name="guest-number"]').bind('input', function () {
			var guest = Number($(this).val());
			var roomRec = calculateRoom(guest);
			var single = roomRec.single;
			var double = roomRec.double;
			var suite = roomRec.suite;

			$("#room_number").children().remove();
			var single_flag = false, double_flag = false, suite_flag = false;
			var single_result, double_result, suite_result;
			var single_class = "", double_class = "", suite_class = "", custom_class = "";
			var new_tab = "";
			if (single > single_limit) {
				single_flag = true;
				single_result = "Sold Out";
			} else {
				single_class = "mui--is-active";
				single_result = String(single) + " Single";
			}
			if (double > double_limit) {
				double_flag = true;
				double_result = "Sold Out";
			} else {
				if (single_flag == true) {
					double_class = "mui--is-active";
				}
				double_result = String(double) + " Double";
			}
			if (suite > suite_limit) {
				suite_flag = true;
				suite_result = "Sold Out";
			} else {
				if (single_flag == true && double_flag == true) {
					suite_class = "mui--is-active";
				}
				suite_result = String(suite) + " Suite";
			}
			
			if (single_flag == true && double_flag == true && suite_flag == true) {
					custom_class = "mui--is-active"
			}
			
			new_tab = `
				<ul class="mui-tabs__bar mui-tabs__bar--justified">
					<li class="${single_class}"><a id="single" data-mui-toggle="tab" data-mui-controls="pane-events-1" data-room="${single}"> ${single_result} </a></li>
					<li class="${double_class}"><a id="double" data-mui-toggle="tab" data-mui-controls="pane-events-2" data-room="${double}"> ${double_result} </a></li>
					<li class="${suite_class}"><a id="suite" data-mui-toggle="tab" data-mui-controls="pane-events-3" data-room="${suite}"> ${suite_result} </a></li>
					<li class="${custom_class}"><a data-mui-toggle="tab" data-mui-controls="pane-events-4"> Custom </a></li>
				</ul>
				<div class="mui-tabs__pane ${single_class}" id="pane-events-1"></div>
				<div class="mui-tabs__pane ${double_class}" id="pane-events-2"></div>
				<div class="mui-tabs__pane ${suite_class}" id="pane-events-3"></div>
				<div class="mui-tabs__pane ${custom_class}" id="pane-events-4">
					<div class="mui-textfield mui-col-md-4">
						<label> Single Room </label>
						<input id="custom_single" type="number" min="0" max="${single_limit}" value="0">
					</div>
					<div class="mui-textfield mui-col-md-4">
						<label> Double Room </label>
						<input id="custom_double" type="number" min="0" max="${double_limit}" value="0">
					</div>
					<div class="mui-textfield mui-col-md-4">
						<label> Suite Room </label>
						<input id="custom_suite" type="number" min="0" max="${suite_limit}" value="0">
					</div>
				</div>`;
			$("#room_number").append(new_tab);
			if (single_class == "mui--is-active") {
				$('input[name="singleRoom"]').val(single);
			} else if (double_class == "mui--is-active") {
				$('input[name="doubleRoom"]').val(double);
			} else if (suite_class == "mui--is-active"){
				$('input[name="suiteRoom"]').val(suite);
			}
			// get toggle elements
			var toggleEls = document.querySelectorAll('[data-mui-controls^="pane-events-"]');
			function setRoom (ev) {
				if (ev.paneId == "pane-events-1") {
					$('input[name="singleRoom"]').val($("#single").data('room'));
					$('input[name="doubleRoom"]').val("0");
					$('input[name="suiteRoom"]').val("0");
				} else if (ev.paneId == "pane-events-2") {
					$('input[name="singleRoom"]').val("0");
					$('input[name="doubleRoom"]').val($("#double").data('room'));
					$('input[name="suiteRoom"]').val("0");
				} else if (ev.paneId == "pane-events-3") {
					$('input[name="singleRoom"]').val("0");
					$('input[name="doubleRoom"]').val("0");
					$('input[name="suiteRoom"]').val($("#suite").data('room'));
				} else if (ev.paneId == "pane-events-4") {
					$('input[name="singleRoom"]').val("0");
					$('input[name="doubleRoom"]').val("0");
					$('input[name="suiteRoom"]').val("0");
				}
			}

			// attach event handlers
			for (var i=0; i < toggleEls.length; i++) {
				toggleEls[i].addEventListener('mui.tabs.showstart', setRoom);
			}
			
			function setCustom() {
				$('input[name="singleRoom"]').val($("#custom_single").val());
				$('input[name="doubleRoom"]').val($("#custom_double").val());
				$('input[name="suiteRoom"]').val($("#custom_suite").val());
			}

			$('#custom_single').bind('input', setCustom);
			$('#custom_double').bind('input', setCustom);
			$('#custom_suite').bind('input', setCustom);
		});
	}
	
  function changePrice() {
    totalPrice = 10 * $("#single").children(".room-number").children("input").val() + 15 * $("#double").children(".room-number").children("input").val() + 20 * $("#suite").children(".room-number").children("input").val();
    $("#total_price").html("Total: $" + totalPrice);
    $("#price").html("Price: $" + totalPrice);
  }
  
  // update room number real time
  $(".room-number").click(function () {
    changePrice();
  });
  $(".room-number").change(function () {
    changePrice();
  });
  
	// initialization
	$('input[name="startDate"]').val(moment().format("YYYY-MM-DD"));
	$('input[name="endDate"]').val(moment().add('days', 1).format("YYYY-MM-DD"));
  queryDate(moment(), moment().add('days', 1));
  bindEvents();
});