var c = require('./L_Hue_Constants');

//var _on = "";
//var _hue = "";
//var _brightness = "";
//var _saturation = "";

var L_Hue_State = function(){
};

L_Hue_State.prototype.setOn = function(value){
	if(typeof value == "boolean"){
		this._on = value; 
	} 
};

L_Hue_State.prototype.setHue = function(value){
	if(Number.isInteger(value)){
		if(c.MIN_HUE<=value && value<=c.MAX_HUE){	
			this._hue = value; 
		} 
	} 
};

L_Hue_State.prototype.setBrightness = function(value){
	if(Number.isInteger(value)){
		if(c.MIN_BRIGHTNESS<=value && value<=c.MAX_BRIGHTNESS){
			this._brightness = value; 
		}
	} 
};

L_Hue_State.prototype.setSaturation = function(value){
	if(Number.isInteger(value)){
		if(c.MIN_SATURATION<=value && value<=c.MAX_SATURATION){
			this._saturation = value; 
		} 
	} 
};

L_Hue_State.prototype.setStateCommand = function(ID){
	
	if(typeof this._on == 'undefined'){
		this._on = '';
	}
	if(typeof this._hue == 'undefined'){
		this._hue = '';
	}
	if(typeof this._saturation == 'undefined'){
		this._saturation = '';			
	}
	if(typeof this._brightness == 'undefined'){
		this._brightness = '';
	}
	
	var state ={
		"on" : this._on,
		"hue" : this._hue,
		"sat" : this._saturation,
		"bri" : this._brightness		
	};
	//if(state == ''){
	//	return "not a valid command";
	//}
	//state = {"on": false};
	//dstate = {"on": true};
	var body = {
		"url" : "/api/socmedofthings/lights/"+ID+"/state",
		"method" : "PUT",
		"body": state
	};
	//console.info(body); 
	return body;
};

module.exports = L_Hue_State;