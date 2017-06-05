var single_limit = 100, double_limit = 100, suite_limit = 100;
var toggleEls = [];

// set the limits of rooms
function setRemainingRoom(data) {
	if (data.responseCode !== 0) { // No available rooms
//		$("#room_number").after('<div class="mui-col-md-8"> NO Room available </div>');
//		$("#room_number").remove();
		console.log("예약 가능한 방이 없습니다.");
		data = {singleRoom: 0, doubleRoom: 0, suiteRoom: 0};
	} else {
		data = data.result;
	}
	single_limit = data.singleRoom;
	double_limit = data.doubleRoom;
	suite_limit = data.suiteRoom;
}

// send query to get available rooms for input dates period.
function queryDate(startDate, endDate) {
	var query = 'http://' + document.location.host + '/reservation/available';
	query = query + '?startDate=' + startDate.format('YYYY-MM-DD');
	query = query + '&endDate=' + endDate.format('YYYY-MM-DD');
	$.getJSON(query, setRemainingRoom);
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

// stores the room number of each room type
function setRoomNumber (single, double, suite) {
	// clear old values
	$('input[name="singleRoom"]').val("0");
	$('input[name="doubleRoom"]').val("0");
	$('input[name="suiteRoom"]').val("0");
	//store new value
	$('input[name="singleRoom"]').val(single);
	$('input[name="doubleRoom"]').val(double);
	$('input[name="suiteRoom"]').val(suite);
	// for debug
	console.log("========");
	console.log($('input[name="singleRoom"]').val());
	console.log($('input[name="doubleRoom"]').val());
	console.log($('input[name="suiteRoom"]').val());
}

// this function is called when user select room type tab
function setRoom (ev) {
	// make not click sold out tab.
	if ($(`[data-mui-controls=${ev.paneId}]`).parent().attr("class") == "sold-out mui--is-active") {
		// add warning when there is no other warning messages
		if (typeof $("div#warning").attr("id") == "undefined") {
			$(".mui-tabs__bar").before('<div id="warning" style="color: #FF0800; text-align: center; font-weight: 700; font-size: 15px; line-height: 15px; height: 0px;"> Please, select other rooms! </div>');
			$("#warning").animate({
				height: "15px"
			}, 300).delay(500).animate({
				height: "0px"
			}, 500, function () {
				// clear all warnings
				$("div#warning").remove();
			});
		}
		mui.tabs.activate(ev.relatedPaneId);
		return;
	}
	var roomNumber = $(`[data-mui-controls=${ev.paneId}]`).data('room');
	if (ev.paneId == "single") {
		setRoomNumber(roomNumber, 0, 0);
	} else if (ev.paneId == "double") {
		setRoomNumber(0, roomNumber, 0);
	} else if (ev.paneId == "suite") {
		setRoomNumber(0, 0, roomNumber);
	}
}

// when page is loaded
$(document).ready(function () {
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
		// bind input of guest number
		$('input[name="guest-number"]').bind('input', function () {
			$("#room_number").children().remove();
			if ($(this).val()!= "") {
				var guest = Number($(this).val());
				var roomRec = calculateRoom(guest);
				var single = roomRec.single;
				var double = roomRec.double;
				var suite = roomRec.suite;
				var single_flag = false, double_flag = false, suite_flag = false;
				var single_result, double_result, suite_result;
				var single_class = "", double_class = "", suite_class = "", custom_class = "";
				var new_tab = "";
				if (single > single_limit) {
					single_flag = true;
					single_result = "Sold Out";
					single_class = "sold-out";
				} else {
					single_class = "mui--is-active";
					single_result = String(single) + " Single";
				}
				if (double > double_limit) {
					double_flag = true;
					double_result = "Sold Out";
					double_class = "sold-out";
				} else {
					if (single_flag == true) {
						double_class = "mui--is-active";
					}
					double_result = String(double) + " Double";
				}
				if (suite > suite_limit) {
					suite_flag = true;
					suite_result = "Sold Out";
					suite_class = "sold-out";
				} else {
					if (single_flag == true && double_flag == true) {
						suite_class = "mui--is-active";
					}
					suite_result = String(suite) + " Suite";
				}

				if (single_flag == true && double_flag == true && suite_flag == true) {
						custom_class = "mui--is-active";
				}

				new_tab = `
					<ul class="mui-tabs__bar mui-tabs__bar--justified">
						<li class="${single_class}"><a data-mui-toggle="tab" data-mui-controls="single" data-room="${single}"> ${single_result} </a></li>
						<li class="${double_class}"><a data-mui-toggle="tab" data-mui-controls="double" data-room="${double}"> ${double_result} </a></li>
						<li class="${suite_class}"><a data-mui-toggle="tab" data-mui-controls="suite" data-room="${suite}"> ${suite_result} </a></li>
						<li class="${custom_class}"><a data-mui-toggle="tab" data-mui-controls="custom"> Custom </a></li>
					</ul>
					<div class="mui-tabs__pane ${single_class}" id="single"></div>
					<div class="mui-tabs__pane ${double_class}" id="double"></div>
					<div class="mui-tabs__pane ${suite_class}" id="suite"></div>
					<div class="mui-tabs__pane ${custom_class}" id="custom">
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
				// make sold out text to red
				$(".sold-out").children().css("color", "#FF0800");
				$(".sold-out").children().css("font-weight", "700");
				// store the room number to input in form tag
				if (single_class == "mui--is-active") {
					setRoomNumber(single, 0, 0);
				} else if (double_class == "mui--is-active") {
					setRoomNumber(0, double, 0);
				} else if (suite_class == "mui--is-active"){
					setRoomNumber(0, 0, suite);
				}
				// get toggle elements
				var toggleNames = ["single", "double", "suite", ]
				var toggleEls = [];
				toggleEls.push(document.querySelector('[data-mui-controls="single"]'));
				toggleEls.push(document.querySelector('[data-mui-controls="double"]'));
				toggleEls.push(document.querySelector('[data-mui-controls="suite"]'));
				toggleEls.push(document.querySelector('[data-mui-controls="custom"]'));
				// attach event handlers
				for (var i=0; i < toggleEls.length; i++) {
					toggleEls[i].addEventListener('mui.tabs.showend', setRoom);
				}
				// bind inputs in custom tabs
				$('#custom_single').bind('input', function () {
					setRoomNumber($("#custom_single").val(), $("#custom_double").val(), $("#custom_suite").val());
				});
				$('#custom_double').bind('input', function () {
					setRoomNumber($("#custom_single").val(), $("#custom_double").val(), $("#custom_suite").val());
				});
				$('#custom_suite').bind('input', function () {
					setRoomNumber($("#custom_single").val(), $("#custom_double").val(), $("#custom_suite").val());
				});
			}
		});
	}
	// initialization
	$('input[name="startDate"]').val(moment().format("YYYY-MM-DD"));
	$('input[name="endDate"]').val(moment().add('days', 1).format("YYYY-MM-DD"));
  queryDate(moment(), moment().add('days', 1));
  bindEvents();
});