// https://www.npmjs.com/package/sync-request

var request = require('request');
var request2 = require('sync-request');

var state = function (){

};

state.prototype.setOptions = function (token, ID){
	
};

// function to get All status of lights
// var thpath = "api.lifx.com:443/v1beta1/lights.json?" + "access_token=" + token;

// function to get All status of specific lights
state.prototype.getStatus = function (token, ID, prop){
	var thpath = "api.lifx.com/v1beta1/lights/"+ ID;
	var postheaders = {
    	'Content-Type': 'x-www-form-urlencoded'
	};
    var options = {
    	url : 'https://' + thpath,
    	method : 'GET',
    	headers : postheaders,
    	oauth:{
    		token: token
    	}
    };
    var result = getResult(opt, prop, function(msg){
		return msg;
	});
	//return JSON.parse(res.getBody().toString());
};

var getResult = function(opt, prop, callback){
    	request(opt, function (error, response, body) {
    		console.info(response.statusCode);
    		if (!error && response.statusCode == 201) {
        		// Print out the response body
        		if(prop == "power"){
        			if(body.power == "on"){
        				return callback(true);	
        			}else return callback(false);
        		}else if(prop == "brightness"){	
        			return callback(body.brightness);
        		}else if(prop == "hue"){
        			return callback(body.color.hue);
        		}else if(prop == "saturation"){
        			return callback(body.color.saturation);
        		}
	      		return callback("Property not found - Lifx");
    		} else return callback(body);
		});
};

module.exports = state;