
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
	  	$.getJSON('http://'+document.location.host+'/reservation/available'
	  			+'?startDate='+startDate.format('YYYY-MM-DD')
	  			+'&endDate='+endDate.format('YYYY-MM-DD'),
	  			setRemainingRoom);
  }

$(document).ready(function () {
  var remaining_single = 30;
  var remaining_double = 15;
  var remaining_suite = 10;
  var totalPrice = 0;

  function bindEvents(){
    // click payment confirm button
    $(document).on("click", "#payment_confirm", function() {
      alert("Success!");
      location.href="./mainpage.html";
    });

    // click reserve confirm button
    /*
    $(document).on("click", "#reserve_confirm", function() {
      var room_check = $("#single").children(".room-number").children("input").val() + $("#double").children(".room-number").children("input").val() + $("#suite").children(".room-number").children("input").val() == 0;
      var name_check = $("#name").val() == "";
      console.log($("#name").val());
      var mail_check = $("#email").val() == "";
      if (room_check && name_check && mail_check){
        var problem = [];
        if (room_check) {
          problem.push("room");
        }
        if (name_check) {
          problem.push("name");
        }
        if (mail_check) {
          problem.push("e-mail");
        }
        var i;
        var msg = "";
        for (i = 0; i < problem.length; i++) {
          if (i == 0) {
            msg = problem[i];
          } else {
            msg = msg + ", " + problem[i];
          }
        }

        alert("You have not selected a " + msg + ".");
      }
      else{
        location.href="./payment.html";
      }

    });
      */ 
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
  
  //setRemainingRoom();
  queryDate(moment(),moment().add('days', 1));
  bindEvents();
});