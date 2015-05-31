var Lifx = require('./LifxController');
var token = "c1900480e66c84ab123490fb4af470081596d5011ec73e09c15e17b521fc2506";
//var token = "c1900480e66c84ab123490fb4af470081596d5011ec73e09c15e17b521fc9999";

/*
Lifx.validateToken(token, function(err){
	console.log(err);
	console.log("success");
});
*/
/*
Lifx.discoverThing(token, function(err, data){
	console.log(err);
	console.log(data);
});
*/
/*
Lifx.getState({token: token, id: "d073d500249c"}, function(data, response){
	console.log(data);
});
*/

/*
Lifx.setState({token: token, id: "d073d500249c", value:true}, function(data, response){
	console.log(data);
});
*/

function getState(params, next){
	var options = {
		baseUrl: 'https://api.lifx.com/v1beta1/',
		uri: '/lights/'+params.id, 
		method: 'GET',
		auth: {user: params.token}
	};
	request(options, function(error, response, body){
		body = JSON.parse(body);
		if(error){
			return next(error, null);
		}
		if(body.error){
			return next(new Error(body.error), null);
		}
		var data = false;
		if(body.power == 'on'){
			data = true;
		}else if(body.power == 'off'){
			data = false;
		}else return next(new Error("invalid"), null);
		return next(null, data)
	});
};

