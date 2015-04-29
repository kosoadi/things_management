// https://www.npmjs.com/package/sync
var info = require('./info');
var action = require('./action');
var Sync = require('sync');


var instance = new info();
var token = "cded286274d09c6be6b121eca773dab0afca51145ad0ab50107d21b62e772df3";
var ID = "d073d500249c";
//var raw = instance.getAllStatus(token);

//var raw = instance.getStatus(token, ID);
/*
for(var ii = 0; ii < raw.length ; ii++){
	console.info("1");
	console.info(raw[ii]);
}
*/
//console.info(raw);

var instance2 = new action();

//var raw2 = instance2.setPower(token, ID, false);
var raw4 = instance2.setColor(token, ID, 75, 5, 10);
console.info(raw4);