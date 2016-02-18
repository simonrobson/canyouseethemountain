var http = require('http');
var qs = require('qs');

function hourlyRequest(sensors, delay, next) {
	return function _update() {
		sensors.forEach(function(s) { fetch_aq(s.sensor, s.metric, next); });
		setTimeout(_update, next_update(delay));
	};
}

function next_update(delay) {
	return (60 - (new Date().getMinutes()) + delay) * 60 * 1000;
}

function fetch_aq(sensor, metric, next) {
	http.request({
		hostname: 'aqi.paiges.net',
		port: 80,
		path: '/data_sets/' + sensor + '/' + metric + '?' + fetch_aq_query(),
		method: 'GET'})
	.on('response', aq_response(metric, next))
	.on('error', aq_error(metric))
	.end();
}

function fetch_aq_query() {
	var now = new Date();
	var today = { year: 2016, month: now.getMonth() + 1, date: now.getDate() }
	return qs.stringify({ begin: today, end: today, interval: 'hours' }, { encode: false });
}

function aq_response(metric, next) {
	return function(response) {
		var data = '';

		response.on('data', function(chunk) {
			data += chunk;
		});

		response.on('end', function() {
			try {
				next(metric, JSON.parse(data).data);
			} catch(e) {
				console.log('JSON.parse error:', e);
			}
		});
	};
}

function aq_error(metric) {
	return function(error) {
		console.log('fetch_aq(', metric, ') error', new Date(), error);
	};
}

exports.hourlyRequest = hourlyRequest;
