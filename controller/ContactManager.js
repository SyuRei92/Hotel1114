const util=require('./HotelUtil');
var ContactManager={};
const connArg={  
	    service: 'Gmail',
	    auth: {
	        user: 'baek449.test',
	        pass: '^t4e4s9t^'
	    }};

ContactManager.sendComfirmMail=
	function(result){
	//SeqD MakeReservation Step 20(Send Email)
	var conn = require('nodemailer').createTransport(connArg);

	console.log('Sendmail');
	console.log(result);
	// TODO Write mail contents here
	var mailOptions = {  
	    from: 'Hotel1114 <baek449.test@gmail.com>',
	    to: result.customerInfo.email,
	    subject: 'Hotel1114 Reservation Receipt',
	    text: 'Thank you for reserving Hotel1114.'
	    	+'\nReservation ID: '+result.id
	    	+'\nName: '+result.customerInfo.name
	    	+'\nEmail: '+result.customerInfo.email
	    	+'\nPeriod: '+util.date2String(result.startDate)+'~'+util.date2String(result.endDate)
	    	+'\nRooms: '+result.rooms.toString()
	    	+'\nPayment: TBD'
	};

	conn.sendMail(mailOptions, function(error, response){
	    if (error) console.log(error);
	    else console.log("Message sent : " + response.message);
	    conn.close();
	});
};

ContactManager.sendCancelMail=
	function(email){
	//SeqD CancelReservation Step 6(Send Cancel Mail)
	var conn = require('nodemailer').createTransport(connArg);

	// TODO Write mail contents here
	var mailOptions = {  
	    from: 'Hotel1114 <baek449.test@gmail.com>',
	    to: email,
	    subject: 'Hotel1114 Reservation Test',
	    text: 'Your reservation on Hotel1114 was successfully cancelled.'
	    	+'\nReservation ID: '+rid
	    	+'\nName: '+'Insert name here'
	    	+'\nEmail: '+'Insert mail here'
	    	+'\nPeriod: '+'Insert period here'
	    	+'\nRooms: '+'Insert room here'
	    	+'\nTimestamp: '+'Insert time here'
	    	+'\nRefund: TBD'
	};

	conn.sendMail(mailOptions, function(error, response){
	    if (error) console.log(error);
	    else console.log("Message sent : " + response.message);
	    conn.close();
	});
};

module.exports=ContactManager;