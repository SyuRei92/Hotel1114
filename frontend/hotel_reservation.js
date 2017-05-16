// click payment confirm button
$(document).on("click", "#payment_confirm", function() {
  alert("Success!");
  location.href="./mainpage.html"
});

// click reserve confirm button
$(document).on("click", "#reserve_confirm", function() {
  location.href="./payment.html";
});