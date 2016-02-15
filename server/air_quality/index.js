var http = require('http');
var qs = require('qs');

var aq = {}

function init(sensors, delay) {
	update(sensors, delay)();
}

function update(sensors, delay) {
	return function _update() {
		sensors.forEach(function(s) { fetch_aq(s.sensor, s.metric); });
		setTimeout(_update, next_update(delay));
	};
}

function next_update(delay) {
	return (60 - (new Date().getMinutes()) + delay) * 60 * 1000;
}

function fetch_aq(station, metric) {
	http.request({
		hostname: 'aqi.paiges.net',
		port: 80,
		path: '/data_sets/' + station + '/' + metric + '?' + fetch_aq_query(),
		method: 'GET'})
	.on('response', aq_response(metric))
	.on('error', aq_error)
	.end();
}

function fetch_aq_query() {
	var now = new Date();
	var today = { year: 2016, month: now.getMonth() + 1, date: now.getDate() }
	return qs.stringify({ begin: today, end: today, interval: 'hours' }, { encode: false });
}

function aq_response(metric) {
	return function(response) {
		var data = '';

		response.on('data', function(chunk) {
			data += chunk;
		});

		response.on('end', function() {
			try {
				aq[metric] = JSON.parse(data).data.pop();
				console.log('updated', metric, new Date(), aq);
			} catch(e) {
				console.log('JSON.parse error:', e);
			}
		});
	};
}

function aq_error(error) {
	console.log('fetch_aq error:', error);
}

function current() {
	return aq;
}

exports.init = init;
exports.current = current;
