//var State = require ('./L_Hue_State');


var _ID = "";
var _endpointID = "";
var _type = "";
var _name = "";
var _modelid = "";
var _swversion = "";


var L_Hue = function (ID){
	this._ID = ID;
	//this._state = new State();
};

L_Hue.prototype.setID = function(ID){
	this._ID = ID;
};

L_Hue.prototype.getID = function(){
	return this._ID;
};

/*
L_Hue.prototype.setState = function(state){
	this._state = state;
};

L_Hue.prototype.getState = function(){
	return this._state;
};
*/

L_Hue.prototype.setEndpointID = function(endpointID){
	this._endpointID = endpointID;
};

L_Hue.prototype.getEndpointID = function(){
	return this._endpointID;
};

L_Hue.prototype.setName = function(name){
	this._name = name;
};

L_Hue.prototype.getName = function(){
	return this._name;
};

L_Hue.prototype.setType = function(type){
	this._type = type;
};

L_Hue.prototype.getType = function(){
	return this._type;
};


module.exports = L_Hue;