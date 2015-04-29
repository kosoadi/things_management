var mqtt    = require('mqtt');
var opt = {host:'128.199.236.53', port:1883};
var client  = mqtt.connect('tcp://128.199.236.53', opt);
//console.info(client);
client.publish('lights/2', 'on');
 
client.end();
