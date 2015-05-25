var lifx = require('./LifxController');
var token = "c87c73a896b554367fac61f71dd3656af8d93a525a4e87df5952c6078a89d192";
/*
lifx.validateToken(token,function(err){
	if(err){
		console.log(err);
	} else
	console.log("success");
});
*/
//
lifx.validateToken(token, function(data, response){
	console.info(data);
	console.info(response.statusCode);
});


lifx.setState({id:"d3b2f2d97452", token:token, value:"on"}, function(data, response){
	console.info(data);
	console.info(response.statusCode);
});