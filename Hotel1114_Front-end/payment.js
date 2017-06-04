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
	function sendQuery (reserveInfo) {
		console.log();
		var query = 'http://' + document.location.host + '/reservation/doReserve' + '?startDate=' + reserveInfo["startDate"] + '&endDate=' + reserveInfo["endDate"] + '&singleRoom=' + reserveInfo["singleRoom"] + '&doubleRoom=' + reserveInfo["doubleRoom"] + '&suiteRoom=' + reserveInfo["suiteRoom"] + '&name=' + reserveInfo["name"] + '&email=' + reserveInfo["email"];
		
		if (typeof reserveInfo["phoneNumber"] !== "undefined") {
			query = query + '&phoneNumber=' + reserveInfo["phoneNumber"];
		}
		$.getJSON(query, function() {
			$("#to_complete").click();
		});
	}
	
	function bindEvents() {
		$("#payment_complete").on("click", function() {
			sendQuery(reserve_info);
		});
	}
	
	reserve_info = getUrlVars();
	bindEvents();
	console.log(reserve_info);
});