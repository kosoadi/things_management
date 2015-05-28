//var Property = require("./models/Property");
var mongoose = require('mongoose');
var async = require('async');
console.log(typeof mongoose.Types.ObjectId().toString());
/*
//http://mongoosejs.com/docs/2.7.x/docs/finding-documents.html
//http://stackoverflow.com/questions/21461132/running-a-node-js-script-every-10-seconds
//http://stackoverflow.com/questions/27262503/javascript-execute-function-every-x-seconds-but-only-execute-function-3-times
function runAllAccess(callback){
	Property.find({}, 'access', function(err, props){
		if(err){
			throw err;
		}
		for(i=0; i<props.length; i++){
			if(props[i].access.func typeof 'undefined'){
				continue;
			}
			props[i].runAccess(err,data);
			// throw data to topic
		}
		callback();
	});
}

function wait10sec(){
    setTimeout(function(){
        runAllAccess(wait10sec);
    }, 10000);
}

runAllAccess(wait10sec);
*/