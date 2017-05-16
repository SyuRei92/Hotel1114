$(document).ready(function () {
  var remaining_single = 30;
  var remaining_double = 15;
  var remaining_suite = 10;
  var totalPrice = 0;
  
  function setRemainingRoom() {
    $("#single").children(".remain_room").html("Remain: " + remaining_single);
    $("#double").children(".remain_room").html("Remain: " + remaining_double);
    $("#suite").children(".remain_room").html("Remain: " + remaining_suite);

    $("#single").children(".room-number").children("input").attr({
      "max" : remaining_single
    });
    $("#double").children(".room-number").children("input").attr({
      "max" : remaining_double
    });
    $("#suite").children(".room-number").children("input").attr({
      "max" : remaining_suite
    });
  }

  function bindEvents(){
    // click payment confirm button
    $(document).on("click", "#payment_confirm", function() {
      alert("Success!");
      location.href="./mainpage.html";
    });

    // click reserve confirm button
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
  
  setRemainingRoom();
  bindEvents();
});