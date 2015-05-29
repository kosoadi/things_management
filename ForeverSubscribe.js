var async = require('async');
var mqtt = require('mqtt');
var client = mqtt.connect("LINK uri mosquitto");
var mongoose = require('mongoose');
var Thing = require('./models/Thing');
var Property = require('./models/Property');

var _topic = "";
var _result = null;
var ForeverSubscribe = function(topic){
	this.topic = topic;
	async.forever(
		function(next){	
			client.on('connect', function () {
  				client.subscribe(this.topic.setter);
			});
			client.on('message', function (topic, message) {
  				var temp = topic.split("/"); //1=USERID, 3=THINGID, 4=PROPNAME
				Thing.findOne({_owner:temp[1], _id:temp[3]},function(err, thing){
					if(err){
						return next(err);
					}
					if(!thing){
						return next(err)
					}
					Property.findOne({_thingid: thing._id, _name: temp[4]},function(err, prop){
						if(err){
							return next(err);
						}
						if(!thing){
							return next(err)
						}
						prop.runControl(message, function(err, data){
							if(err){
								return next(err);
							}
							this._result = data;
							/*
								TODO: save topic and result to database
							*/
						});
					});		
				});
			});
		},
		function(err){
			client.end();
		}
	);
};
//setter:'sot/'+userid+'/'+thing.category+'/'+thingid+'/'+name+'/ctl',
module.exports = ForeverSubscribe;

