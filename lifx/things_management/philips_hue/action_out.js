// http://stackoverflow.com/questions/9768192/sending-data-through-post-request-from-a-node-js-server-to-a-node-js-server
// http://samwize.com/2013/08/31/simple-http-get-slash-post-request-in-node-dot-js/
var c = require('./L_Hue_Constants');
var request = require('request');

//var state = new State();
//var token = 'xxxxxx';
//var bridgeid = 'xxxxx';
//var command = {};


var action_out = function (){
};

action_out.prototype.setOptions = function(token, bridgeid, command) {
    var thpath = c.PATH_SETTER + "token=" + token + "&bridgeid=" + bridgeid;
    
    var clipmessage = JSON.stringify({'bridgeId':bridgeid,'clipCommand':command});
    //console.info(clipmessage);
    var postheaders = {
    	'Content-Type': c.CONTENT_TYPE
	};
    var opt = {
    	url : 'https://' + c.HOST_ADDRESS + thpath,
    	method : 'POST',
    	headers : postheaders,
    	form : {'clipmessage' : clipmessage}
    };
    //console.info(opt); 
    return opt;
};

action_out.prototype.runAction = function (options){
	//console.info(options);
	request(options, function (error, response, body) {
    	if (!error && response.statusCode == 200) {
        	// Print out the response body
        	console.log(body);
        	return "success to set";
    	} else return "failed to set";
	});

};

module.exports = action_out;
 

