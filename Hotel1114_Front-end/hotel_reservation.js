function setRemainingRoom(data) {
	if(data.responseCode!=0){ // No available rooms
		alert("예약 가능한 방이 없습니다.");
		data={singleRoom:0,doubleRoom:0,suiteRoom:0};
	}
	else data=data.result;
	$("#single").children(".remain_room").html("Remain: " + data.singleRoom);
	$("#double").children(".remain_room").html("Remain: " + data.doubleRoom);
	$("#suite").children(".remain_room").html("Remain: " + data.suiteRoom);

	$("#single").children(".room-number").children("input").attr({
		"max" : data.singleRoom
	});
	$("#double").children(".room-number").children("input").attr({
		"max" : data.doubleRoom
	});
	$("#suite").children(".room-number").children("input").attr({
		"max" : data.suiteRoom
	});
	$('input[name="startDate"]').val($('input[name="daterange"]').data('daterangepicker').startDate.format("YYYY-MM-DD"));
	$('input[name="endDate"]').val($('input[name="daterange"]').data('daterangepicker').endDate.format("YYYY-MM-DD"));
}

function queryDate(startDate, endDate) {
	$.getJSON('http://'+document.location.host+'/reservation/available'+'?startDate='+startDate.format('YYYY-MM-DD')+'&endDate='+endDate.format('YYYY-MM-DD'),
						setRemainingRoom);
}

// return the list of set of room type and number
// input: room-number of room, guest-number of guest
// list of [single: num, double: num, suite, num]
function calculateRoom(room, guest) {
	var single, double, suite;
	
	
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
	$('input[name="daterange"]').on('apply.daterangepicker', function(ev, picker) {
		var start = picker.startDate;
		var end = picker.endDate;
		
		$('input[name="startDate"]').val(start.format("YYYY-MM-DD"));
		$('input[name="endDate"]').val(end.format("YYYY-MM-DD"));

		queryDate(start,end);
	});
	
  function bindEvents(){
    // click payment confirm button
    $(document).on("click", "#payment_confirm", function() {
      alert("Success!");
      location.href="./mainpage.html";
    });
   }
	
  function changePrice(){
    totalPrice = 10*$("#single").children(".room-number").children("input").val() +15*$("#double").children(".room-number").children("input").val() +20*$("#suite").children(".room-number").children("input").val();
    $("#total_price").html("Total: $"+totalPrice);
    $("#price").html("Price: $"+totalPrice);
  }
  
  // update room number real time
  $(".room-number").click(function (){
    changePrice();
  });
  $(".room-number").change(function(){
    changePrice();
  });
  
	// initialization
	$('input[name="startDate"]').val(moment().format("YYYY-MM-DD"));
	$('input[name="endDate"]').val(moment().add('days', 1).format("YYYY-MM-DD"));
  queryDate(moment(), moment().add('days', 1));
  bindEvents();
});