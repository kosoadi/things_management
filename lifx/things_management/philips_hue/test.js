var L_Hue = require('./L_Hue');
var State = require('./L_Hue_State');
var Action = require('./action_out');
var Status = require('./value_in');

var bridgeid = "001788fffe106ca5";
var token = "d00yanM1QXBKSHpGSkNvQVpUKzNFUmNkak54TFhqV2ovTlpaRGxtc0dOQT0%3D";

var mylight = new L_Hue("1");
mylight.setEndpointID(bridgeid);

var mystate = new State();
mystate.setOn(true);
var command = mystate.setStateCommand("1");

var myaction = new Action();
var options = myaction.setOptions(token, mylight.getEndpointID(), command);

var mystatus = new Status();
var options2 = mystatus.setOptions(token, mylight.getEndpointID());

//console.info(options);

//myaction.runAction(options);
var information = mystatus.getStatus(options2, "1");
console.info(information);
//console.info(testvar1);