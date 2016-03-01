var wktparse = require('wellknown');

var db = null;
var grid_size = 2;
var layers = {};
var layerTmpl = {
	type: 'FeatureCollection',
	features: []
}

function init(database) {
  db = database;
  genLayerHourly();
}

function genLayerHourly() {
	var now = Math.round((new Date()).getTime() / 1000);

	initVisibilityLayer(now, 1, function(err, layer){
		if( err ) {
			console.log('error generating visibility layer: ', new Date() , err);
		} else {
			console.log('generated fresh visibility layer', new Date());
		}
		setTimeout(genLayerHourly, next_update(0));
	});
}

function next_update(delay) {
	return (60 - (new Date().getMinutes()) + delay) * 60 * 1000;
}

function visibilityLayer(timestamp, landmark) {
  return layers[landmark] || {};
}

function initVisibilityLayer(timestamp, landmark, next) {
  var processCheckins;

  layers[landmark] = layerTmpl;
  processCheckins = updateVisibilityLayerWithCheckins(timestamp, landmark, next);
  db.getCheckinsForDay(timestamp, landmark, processCheckins);
}

function updateVisibilityLayerWithCheckins(timestamp, landmark, next) {
  return function(err, checkins) {
    var i = 0;

    if( err ) {
      next(err,null);
      return;
    }

    if( checkins.length === 0 ) {
      next(null, layers[landmark]);
    }

    checkins.forEach(function(checkin) {
      checkin.coords = {
        longitude: wktparse(checkin.location).coordinates[0],
        latitude: wktparse(checkin.location).coordinates[1]
      };
      updateVisibilityLayer(timestamp, landmark, checkin, done);
    });

    function done() {
      if( ++i === checkins.length ) {
        next(null, layers[landmark]);
      }
    }
  };
}

function updateVisibilityLayer(timestamp, landmark, checkin, next) {
  db.nearLandmark(checkin.coords, landmark, function(err, near) {
    var cell;

    next = next || function() {};

    if( err ) {
      next(err);
      return;
    }

    if( !near ) {
      next(null, layers[landmark]);
      return;
    }

    cell = cellForCheckin(checkin, grid_size);

    db.getCheckinsForDayInCell(timestamp, landmark, cell, function(err, checkins) {
      if( err ) {
        next(err, null);
        return;
      }
      if( checkins.length ) {
        updateGeoJSON(layers[landmark], cell, aggregateVisibility(checkins), aggregateAccuracy(checkins));
      }
      next(null, layers[landmark]);
    });
  });
}

function aggregateAccuracy(checkins){
  var acc = Math.max.apply(null, checkins.map(function(c) { return 100 - (c.age * 10); }));
  return acc < 0 ? 0 : acc;
}

function cellForCheckin(checkin, precision) {
  var left = roundDown(checkin.coords.longitude, precision),
    right = roundDown(left + Math.pow(10, precision * -1), precision),
    bottom = roundDown(checkin.coords.latitude, precision),
    top = roundDown(bottom + Math.pow(10, precision * -1), precision);
  return {
    type: "Polygon",
    coordinates: [
      [[left, top], [right, top], [right, bottom], [left, bottom], [left, top]]
    ]
  };
}

function aggregateVisibility(checkins) {
  var weights = [10, 9, 8 , 7, 6, 5, 4, 3, 2 , 1, 0];
  var recent = Math.min.apply(null, checkins.map(function(c) { return c.age; }));

  var values = checkins.map(function(c) {
    return { visibility: c.visibility, age: c.age - recent };
  }).reduce(function(memo, value) {
    memo.visibility += value.visibility * weights[value.age];
    memo.weight += weights[value.age];
	return memo;
  }, { visibility: 0, weight: 0 });

  return values.visibility / values.weight;
}

function updateGeoJSON(layer, cell, visibility, accuracy) {
  var clientCell, index, id;

  clientCell = {
    type: 'Polygon',
    coordinates: [cell.coordinates[0]]
  };

  id =  cellId(clientCell);

  existing = objById(layer.features, id);

  if( existing === null ) {
    layer.features.push({
      type: 'Feature',
      id: id,
      properties: {visibility: visibility, accuracy: accuracy},
      geometry: clientCell
    });
  } else {
    existing.properties.visibility = visibility;
    existing.properties.accuracy = accuracy;
  }
}

function cellId(cell) {
  return cell.coordinates[0].map(function(coord) { return coord.join('|'); }).join('||');
}

function objById(collection, id) {
  var result = null;
  collection.forEach(function(obj) {
    if( result === null && obj.id === id ) {
      result = obj;
    }
  });
  return result;
}

function roundDown(number, precision) {
  var mantissa = Math.pow(10, precision);
  return Math.floor(number * mantissa) / mantissa;
}

exports.init = init;
exports.updateVisibilityLayer = updateVisibilityLayer;
exports.cellForCheckin = cellForCheckin;
exports.aggregateVisibility = aggregateVisibility;
exports.aggregateAccuracy = aggregateAccuracy;
