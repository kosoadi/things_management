// http://stackoverflow.com/questions/9768192/sending-data-through-post-request-from-a-node-js-server-to-a-node-js-server
// http://samwize.com/2013/08/31/simple-http-get-slash-post-request-in-node-dot-js/
// http://www.w3schools.com/json/json_eval.asp
var c = require('./L_Hue_Constants');
var request = require('request');

//var state = new State();
//var token = 'xxxxxx';
//var bridgeid = 'xxxxx';
//var command = {};


var value_in = function (){
};

value_in.prototype.setOptions = function(token, bridgeid) {
    var thpath = c.PATH_STATUS + "token=" + token + "&bridgeid=" + bridgeid;
    //console.info(clipmessage);
    var postheaders = {
    	'Content-Type': c.CONTENT_TYPE
	};
    var opt = {
    	url : 'https://' + c.HOST_ADDRESS + thpath,
    	method : 'GET',
    	headers : postheaders,
    };
    //console.info(opt); 
    return opt;
};

// return JSON Object state
value_in.prototype.getStatus = function (options, ID){
	//console.info(options);
	request(options, function (error, response, body) {
    	if (!error && response.statusCode == 200) {
        	// Print out the response body
        	//console.log(body);
            var toJSON = JSON.parse(body);
            var lights = toJSON.lights;
            //console.info(lights);
            var light = lights[ID];
            //console.info(light);
            if (typeof light == 'undefined'){
                return "failed to get";
            }
            var light_state = light.state;
        	return light_state;
    	} else return "failed to get";
	});

};

module.exports = value_in;
 

