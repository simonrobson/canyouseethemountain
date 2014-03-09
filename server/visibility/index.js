var wktparse = require('wellknown'),
	db = require('../db');

var layers = {};

function visibilityLayer(timestamp, landmark) {
	return layers[landmark] || {};
}

function initVisibilityLayer(timestamp, landmark) {
	getCheckinsForDay(timestamp, landmark, updateVibilityLayerWithCheckins(timestamp, landmark));
}

function updateVisibilityLayer(timestamp, landmark, checkin, next) {
	db.nearLandmark(checkin.coords, landmark, function(err, near) {
		next = next || function() {};

		if( !near ) {
			next(null, layers[landmark]);
			return;
		}

		cell = cellForCheckin(checkin, area);

/*		getCheckinsInCellForDay(timestamp, landmark, cell, function(err, checkins) {
			updateLayer(layers[landmark], checkins.reduce(weightedAverage));
			next(null, layers[landmark]);
    });*/
	});
}

function updateVisibilityLayerWithCheckins(timestamp, landmark) {
	return function(err, checkins) {
		checkins.each(function(checkin) {
			updateVisibilityLayer(timestamp, landmark, checkin);
		});
	};
}

function cellForCheckin(checkin, precision) {
	var left = roundDown(checkin.coords.longitude, precision),
		right = roundDown(left + Math.pow(10, precision * -1), precision),
		bottom = roundDown(checkin.coords.latitude, precision),
		top = roundDown(bottom +  Math.pow(10, precision * -1), precision);
	return {
		type: "Polygon",
		coordinates: [
			[[left, top], [right, top], [right, bottom], [left, bottom], [left, top]]
		]
	};
}

function areaFromWKT(area) {
  return wktparse(area).coordinates[0].slice(0,4);
}

function roundDown(number, precision) {
	var mantissa = Math.pow(10, precision);
	return Math.floor(number * mantissa) / mantissa;
}

exports.visibilityLayer = visibilityLayer;
exports.cellForCheckin = cellForCheckin;
