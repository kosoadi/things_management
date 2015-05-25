var https = require('https');
var request = require('request');
var Client = require('node-rest-client').Client;

module.exports.validateToken = function(params, next){
	var options = {
		baseUrl: 'https://api.lifx.com/v1beta1/',
		uri: '/lights/all', 
		method: 'GET',
		auth: {user: params}
	};

	request(options, function(error, response, body){
		return next(body, response)
	});
};

/*
if(res.statusCode <= 207){
			return next();
		}else if(res.statusCode == 401){
			return next(new Error("Invalid Token"));
		}else if(res.statusCode == 429){
			return next(new Error("Too many request"));
		}else if(res.statusCode >= 500){
			return next(new Error("Lifx server error"));
		}

*/

module.exports.discoverThing = function(params, next){
	var options = {
		baseUrl: 'https://api.lifx.com/v1beta1/',
		uri: '/lights/all', 
		method: 'GET',
		auth: {user: params}
	};

	request(options, function(error, response, body){
		var data = [];
		var temp = null;
		for(var i = 0; i<body.length; i++){
			temp = {
				id: body[i].id+"|"+body[i].uuid,
				name: body[i].label,
				connection: body[i].connected
			};
			data.push(temp);
		}
		return next(data, response)
	});
};

module.exports.getState = function(params, next){
	var options = {
		baseUrl: 'https://api.lifx.com/v1beta1/',
		uri: '/lights/'+params, 
		method: 'GET',
		auth: {user: params}
	};

	request(options, function(error, response, body){
		var data = false;
		if(body.power == "on"){
			data = true;
		}
		return next(data, response)
	});
};

module.exports.getSaturation = function(params, next){
	var options = {
		baseUrl: 'https://api.lifx.com/v1beta1/',
		uri: '/lights/'+params, 
		method: 'GET',
		auth: {user: params}
	};

	request(options, function(error, response, body){
		var data = body.color.saturation;
		return next(data, response)
	});
};

module.exports.getHue = function(params, next){
	var options = {
		baseUrl: 'https://api.lifx.com/v1beta1/',
		uri: '/lights/'+params, 
		method: 'GET',
		auth: {user: params}
	};

	request(options, function(error, response, body){
		var data = body.color.hue;
		return next(data, response)
	});
};

module.exports.getBrightness = function(params, next){
	var options = {
		baseUrl: 'https://api.lifx.com/v1beta1/',
		uri: '/lights/'+params, 
		method: 'GET',
		auth: {user: params}
	};

	request(options, function(error, response, body){
		var data = body.brightness;
		return next(data, response)
	});
};

module.exports.setState = function(params, next){
	var options = {
		baseUrl: 'https://api.lifx.com/v1beta1/',
		uri: '/lights/'+params.id+'/power', 
		method: 'PUT',
		form: {state:params.value},
		auth: {user: params.token}
	};

	request(options, function(error, response, body){
		return next(body, response)
	});
};

module.exports.setHue = function(params, next){
	var options = {
		baseUrl: 'https://api.lifx.com/v1beta1/',
		uri: '/lights/'+params.id+'/color', 
		method: 'PUT',
		form: {hue:params.value},
		auth: {user: params.token}
	};

	request(options, function(error, response, body){
		return next(body, response)
	});
};

module.exports.setSaturation = function(params, next){
	var options = {
		baseUrl: 'https://api.lifx.com/v1beta1/',
		uri: '/lights/'+params.id+'/color', 
		method: 'PUT',
		form: {saturation:params.value},
		auth: {user: params.token}
	};

	request(options, function(error, response, body){
		return next(body, response)
	});
};

module.exports.setBrightness = function(params, next){
	var options = {
		baseUrl: 'https://api.lifx.com/v1beta1/',
		uri: '/lights/'+params.id+'/color', 
		method: 'PUT',
		form: {brightness:params.value},
		auth: {user: params.token}
	};

	request(options, function(error, response, body){
		return next(body, response)
	});
};