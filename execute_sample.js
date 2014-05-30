var BeaconLocationManager = require('./beacon-location-manager');
var circle1 = {x: 1, y: 2, r: 1}; // 円1
var circle2 = {x: 2, y: 1, r: 1}; // 円2
var circle3 = {x: 1, y: 1, r: 1}; // 円3

var currentPosition = BeaconLocationManager.getCurrentPosition([circle1, circle2, circle3]);

console.log(currentPosition);

