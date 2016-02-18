var config = require('../config/air_quality.js');
var request = require('./request.js');
var calculate = require('./calculate.js');

var aq = {}

function init() {
	request.hourlyRequest(config.sensors, config.delay, update)();
}

function update(metric, values) {
	aq[metric] = calculate.average(values, 24);
	console.log(metric, 'update', new Date(), aq[metric]);
}

function current() {
	return aq;
}

exports.init = init;
exports.current = current;
