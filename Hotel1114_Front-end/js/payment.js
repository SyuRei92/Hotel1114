// calculate the sum of total price
// returns the total price
function sumPrice(single, double, suite) {
	var single_price = 10, double_price = 18, suite_price = 25;
	var totalPrice = single_price * single + double_price * double + suite_price * suite;
	return totalPrice;
}
// convert YYYY-MM-DD date form into natural words
function convertDate(date) {
	var date_form = date.split("-");
	var year = date_form[0];
	var month = date_form[1];
	var day = date_form[2];
	var month_dic = {"01": "January", "02": "Febuary", "03": "March", "04": "April", "05": "May", "06": "June", "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"};
	return month_dic[month] + " " + day + ", " + year;
	
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
		$.getJSON(query);
	}
	function bindEvents() {
		$("#payment_complete").on("click", function() {
			sendReserveInfo(reserve_info);
		});
	}
	reserve_info = getUrlVars();
	bindEvents();
	console.log(reserve_info);
	
	var single = reserve_info["singleRoom"], double = reserve_info["doubleRoom"], suite = reserve_info["suiteRoom"];
	var rooms = [];
	if (single !== "0") {
		rooms.push("single");
	}
	if (double !== "0") {
		rooms.push("double");
	} 
	if (suite !== "0"){
		rooms.push("suite");
	}
	var start = reserve_info["startDate"], end = reserve_info["endDate"];
	var price = sumPrice(single, double, suite);
	// show reservation info
	var msg = `${reserve_info["name"]}, You are reserving `;
	// add room number and type to message
	for (var i = 0; i < rooms.length; i++) {
		var room = rooms[i];
		var num = reserve_info[`${room}Room`];
		if (i === 0) {
			msg += `${num} ${room} room`;
		} else if (i === (rooms.length - 1)) {
			msg += `, and ${num} ${room} room`;
		} else {
			msg += `, ${num} ${room} room`;
		}
	}
	msg += ` from ${convertDate(start)}, to ${convertDate(end)}.`;
	msg += `<br> Your total price is USD ${price}.`;
	
	$("#reservationInfo").append(`<div class="mui--text-body2"> ${msg} </div>`);
});