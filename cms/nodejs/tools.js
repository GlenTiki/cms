// tools.js
// ========
var https     = require('https');
		// google give you these
		var gSECRET    = "you need a secret key here"; 
		var gPublicKey = "you need a public key here";
module.exports = {
 			
 
					 // Helper function to make API call to recatpcha and check response
					verifyRecaptcha : function (key, callback) {

									https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + gSECRET + "&response=" + key, function(res) {
													var data = "";
													res.on('data', function (chunk) {
																	data += chunk.toString();
													});
													res.on('end', function() {
																	try {
																					var parsedData = JSON.parse(data);
																					callback(parsedData.success);
																	} catch (e) {
																		       console.log(e);
																					callback(false);
																	}
													});
									});
							
					}  
   
};
