var db = require('../db')
var layers = {};
var wktparse = require('wellknown');

function visibilityLayer(timestamp, landmark) {
	return layers[landmark] || {};
}

function initVisibilityLayer(timestamp, landmark) {
	getCheckinsForDay(timestamp, landmark, updateVibilityLayerWithCheckins(timestamp, landmark));
}

function updateVisibilityLayer(timestamp, landmark, checkin, next) {
	db.nearLandmark(checkin.coords.latitude, checkin.coords.longitude, landmark, function(err, near, area) {
    next = next || function() {};
    console.log(near);
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

function cellForCheckin(checkin, area) {
  var areaPolygon = areaFromWKT(area);
  var interval = 0.002;
  
  var lat = checkin.coords.latitude;
  var lng = checkin.coords.longitude;
  
  var left = areaPolygon[0][1] + (Math.abs((lng - areaPolygon[0][1]) / interval)* interval);
  var top = areaPolygon[0][0] + (Math.abs((lat - areaPolygon[0][0]) / interval)* interval);
  
  console.log('areaPolygon', areaPolygon);
  console.log("calculated lat", top);
  console.log("calculated lng:", left);

  return [ [top,left], [top, left+interval], [top-interval, left+interval], [top+interval, left] ];
}

function areaFromWKT(area) {
  return wktparse(area).coordinates[0].slice(0,4);
}

updateVisibilityLayer(new Date().getTime(), 1, { 
  coords: {
      accuracy: 25000,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      latitude: 18.75,
      longitude: 99,
      speed: null
      },
    timezone: -7,
    landmark_id: 1,
    visibility: 50
  });

exports.visibilityLayer = visibilityLayer;
