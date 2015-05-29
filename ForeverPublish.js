var async = require('async');
var mqtt = require('mqtt');
var client = mqtt.connect("LINK uri mosquitto");
var mongoose = require('mongoose');
var Thing = require('./models/Thing');
var Property = require('./models/Property');

function runAllAccess(callback){
	Property.find({$or:[{access.func:{$ne: null}}}, {access.func:{$ne: 'undefined'}}}], 'access topic', function(err, props){
		if(err){
			throw err;
		}
		async.forEachLimit(props, 100, 
			function(prop, next){
				prop.runAccess(function(err,data){
					if(err){
						client.on('connect', function () {
  							client.publish(this.topic.getter, data+"");
						});
					}
					client.on('connect', function () {
  						client.publish(this.topic.getter, data+"");
					});
				});
			},
			function(err){
				callback();
			}
		);
	});
}

function wait10sec(){
    setTimeout(function(){
        runAllAccess(wait10sec);
    }, 30000); // run every 30 seconds
}

// runAllAccess(wait10sec);