//https://www.npmjs.com/package/color-convert

var request = require('request');
var request2 = require('sync-request');
var color_constants = require('../color_constants');
var color = color_constants;
var Client = require('node-rest-client').Client;
var Sync = require('sync');

var action = function(){

};

action.prototype.setPower = function (token, ID, value){
	if(typeof value != 'boolean'){
		return "failed to set";
	}
	
	var setter = "";
	
	if(value == true){
		setter = "on";
	}else setter = "off";

	var thpath = "api.lifx.com:443/v1beta1/lights/"+ ID +"/power.json?" + "state="+ setter + "&access_token=" + token;
	var postheaders = {
    	'Content-Type': 'x-www-form-urlencoded'
	};
    var options = {
    	url : 'https://' + thpath,
    	method : 'PUT',
    	headers : postheaders
    };
    var data_rec = "";
    /*
    function callback (error, response, body) {
    	if (!error && response.statusCode == 200) {
    		console.info(body);
    		return body;
    	} else  "failed to get";
    }
    request(options, callback);
	*/
	var res = request2('PUT', 'https://'+thpath);
	console.info(res.statusCode);
	if(res.statusCode != 201 ){
		return "failed to set";
	}
	return "success to set";

};

// color state hue 0-360, sat %, bri %
// hue 0-360, sat 0-1, bri 0-1
action.prototype.setColor = function (token, ID, hue, sat, bri){
	if(typeof hue == 'String' || typeof sat == 'String' || typeof bri == 'String'){
		return "invalid input";
	}
	var hsb = "";
	if(typeof hue != 'undefined'){
		if(hue>=color.MIN_HUE && hue<=color.MAX_HUE){
			hsb = hsb + "hue:" + hue + " ";
		} 
	}
	if(typeof sat != 'undefined'){
		if(sat>=color.MIN_SATURATION && sat<=color.MAX_SATURATION){
			hsb = hsb + "saturation:" + sat + "% ";
		}
	}
	if(typeof bri != 'undefined'){
		if(bri>=color.MIN_BRIGHTNESS && bri<=color.MAX_BRIGHTNESS){
			hsb = hsb + "brightness:" + bri + "% ";
		}
	}

	var thpath = "api.lifx.com:443/v1beta1/lights/"+ ID +"/color.json?access_token=" + token;
    
    /////////////////////////////////////////////////////////////////
    
    var postheaders = {
    	'Content-Type': 'x-www-form-urlencoded'
	};
    var opt = {
    	url : 'https://' + thpath,
    	method : 'PUT',
    	headers : postheaders,
    	form : {color : hsb}
    };
  
    /*
    Sync(function(){
    	var msg = getResult.sync(opt);
    	
    	console.info(msg);
    	return msg;
    });
	*/
	var hasil = "";
	getResult(opt, function(msg){
		console.info(msg);
		hasil = msg;
	});
	return hasil;
	///////////////////////////////////////////////////////////////
};

var getResult = function(opt, callback){
    	request(opt, function (error, response, body) {
    		console.info(response.statusCode);
    		if (!error && response.statusCode == 201) {
        		// Print out the response body
        		return callback("success to set");
    		} else return callback("failed to set");
		});
};

action.prototype.runAction = function (){

};

module.exports = action;