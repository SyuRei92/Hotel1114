// calculate the sum of total price
function sumPrice() {
	totalPrice = 10 * $("#single").children(".room-number").children("input").val() + 15 * $("#double").children(".room-number").children("input").val() + 20 * $("#suite").children(".room-number").children("input").val();
	$("#total_price").html("Total: $" + totalPrice);
	$("#price").html("Price: $" + totalPrice);
}

$(document).ready(function () {
	var reserve_info;
	// Read a page's GET URL variables and return them as an associative array.
	function getUrlVars() {
			var vars = [], hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for(var i = 0; i < hashes.length; i++) {
					hash = hashes[i].split('=');
//					vars.push(hash[0]);
					vars[hash[0]] = hash[1];
			}
			return vars;
	}
	function sendReserveInfo (reserveInfo) {
		var query = 'http://' + document.location.host + '/reservation/doReserve';
		query = query + '?startDate=' + reserveInfo["startDate"];
		query = query + '&endDate=' + reserveInfo["endDate"];
		query = query + '&singleRoom=' + reserveInfo["singleRoom"];
		query = query + '&doubleRoom=' + reserveInfo["doubleRoom"];
		query = query + '&suiteRoom=' + reserveInfo["suiteRoom"];
		query = query + '&name=' + reserveInfo["name"];
		query = query + '&email=' + reserveInfo["email"];
		
		if (typeof reserveInfo["phoneNumber"] !== "undefined") {
			query = query + '&phoneNumber=' + reserveInfo["phoneNumber"];
		}
		query = query + '&password=' + reserveInfo["password"]; // should be encrypted..
		$.getJSON(query, function() {
			$("#to_complete").click();
		});
	}
	
	function bindEvents() {
		$("#payment_complete").on("click", function() {
			sendReserveInfo(reserve_info);
		});
	}
	
	reserve_info = getUrlVars();
	bindEvents();
	console.log(reserve_info);
});