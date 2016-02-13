var pg = require('pg'),
  geojson = require('../../node_modules/geojson2wkt/Geojson2Wkt.js'),
  config = require('../config/db.js');

function connect(next) {
	pg.connect(connectionString(config.db), connected(next));
}

function connectionString(conf) {
	return "postgres://" + conf.user + ":" + conf.password + "@" + conf.host + "/" + conf.database;
}

function connected(next) {
	return function(err, client, done) {
		if( err ) {
			next(err);
		} else {
			client.query("SET TIMEZONE TO 'UTC'", function(err, success){
				if( err ) {
					next(err);
				} else {
					next(null, client, done);
				}
			});
		}
	}
}

function query(query, values, next) {
	return function(err, client, done) {
		if( err ) {
			next(err);
		} else {
			client.query(query, values, function(err, result) {
				done();
				next(err, result ? result.rows : null);
			});
		}
	};
}

function storeCheckin(checkin, next) {
  var fields, values;

  next = next || function() {};

  fields = [
    'timezone', 'landmark_id', 'location', 'accuracy', 'visibility'
  ].join(','),

  values = [
    checkin.timezone,
    checkin.landmark_id,
    checkin.coords.longitude,
    checkin.coords.latitude,
    checkin.coords.accuracy || 'NULL',
    checkin.visibility
  ];

  connect(query("INSERT INTO checkin (" + fields + ") " +
			    "VALUES ($1, $2, ST_SetSRID(ST_Point($3, $4), 4326), $5, $6)", values, next));
}

function getCheckinsForDay(timestamp, landmark, next) {
  var values, fields, where, time;

  time = "timestamp + (timezone || ' HOURS')::INTERVAL";

  fields = [
	time + " AS time",
    'ST_AsText(location) AS location',
    'accuracy',
    'visibility'
  ].join(',');

  where = [
	"landmark_id = $1",
	time + " > (DATE_TRUNC('DAY', TO_TIMESTAMP($2)) + (timezone || ' HOURS')::INTERVAL) + '6 HOURS'::INTERVAL",
	time + " < (DATE_TRUNC('DAY', TO_TIMESTAMP($3)) + (timezone || ' HOURS')::INTERVAL) + '18 HOURS'::INTERVAL"
  ].join(' AND ');

  values = [landmark, timestamp, timestamp];

  next = next || function() {};

  connect(query('SELECT ' + fields + ' FROM checkin WHERE ' + where, values, next));
}

function nearLandmark(coords, id, next) {
  var processResult, values;

  console.log
  field = "ST_Contains(area::geometry, ST_SetSRID(ST_Point($1, $2), 4326)::geometry) AS near";

  values = [parseFloat(coords.longitude), parseFloat(coords.latitude), id];

  next = next || function() {};

  processResult = function(err, result) {
    if( err ) {
      next(err);
    } else if( result.length == 0 ) {
      next(null, false);
    } else {
      next(null, !!(result[0].near));
    }
  };

  connect(query("SELECT " + field + " FROM landmark WHERE id = $3", values, processResult));
}

function getCheckinsForDayInCell(timestamp, landmark, cell, next) {
  var fields, values, where, time;

  time = "timestamp + (timezone || ' HOURS')::INTERVAL";

  fields = [
	time + " AS time",
    "EXTRACT(HOURS FROM (TO_TIMESTAMP($1) + (timezone || ' HOURS')::INTERVAL) - (" + time + ")) AS age",
    "accuracy",
    "visibility"
  ].join(',');

  where = [
	"landmark_id = $2",
	"ST_Contains(ST_GeogFromText($3)::geometry, location::geometry)",
	time + " > (DATE_TRUNC('DAY', TO_TIMESTAMP($4)) + (timezone || ' HOURS')::INTERVAL) + '6 HOURS'::INTERVAL",
	time + " < (DATE_TRUNC('DAY', TO_TIMESTAMP($5)) + (timezone || ' HOURS')::INTERVAL) + '18 HOURS'::INTERVAL"
  ].join(' AND ');

  values = [timestamp, landmark, geojson.convert(cell), timestamp, timestamp];

  next = next || function() {};

  connect(query('SELECT ' + fields + ' FROM checkin WHERE ' + where, values, next));
}

exports.storeCheckin = storeCheckin;
exports.getCheckinsForDay = getCheckinsForDay;
exports.nearLandmark = nearLandmark;
exports.getCheckinsForDayInCell = getCheckinsForDayInCell;
