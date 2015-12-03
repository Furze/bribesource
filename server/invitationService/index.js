'use strict';

var _ = require('lodash');
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'bribesource@gmail.com',
        pass: 'SuperPassword'
    }
});
 
exports.sendInvitations = function(game,done) {
	var link = 'http://localhost:9000/game/' + game._id + '';
	
	if(game && game.invitations.length > 0 && game.gamePlayDate) {
		var emails = [];
		_.forEach(game.invitations,function(invitation){
			if(!invitation.sent) {
				invitation.sent = true;
				emails.push(invitation.email);
			}
		})
	
		var output = '<b>Game: </b>' + game.name + '<br/>';
		output += '<b>Date: </b>' + game.gamePlayDate  + '<br/>';
		output += '<b>Game Creator: </b>' + game.gameCreator + '<br/>';
		output += '<a href="' + link + '">Click here</a> to view the game or we will send you an email closer to the time!';
	
		var mailOptions = {
	    from: 'Bribe Source ✔ <bribesource@gmail.com>',
	    to: emails.join(','),
	    subject: 'Bribe Source: A new game is playing soon',
	    html: output
		};
		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }
		 	done(game);
		});
	} else {
		done();
	}
	
	
};
