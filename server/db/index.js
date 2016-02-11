var pg = require('pg'),
  geojson = require('../../node_modules/geojson2wkt/Geojson2Wkt.js'),
  config = require('../config/db.js');

function connect(next) {
	pg.connect(connectionString(config.db), dbConnected(next));
}

function connectionString(config) {
	return "postgres://" + config.user + ":" + config.password + "@" + config.host + "/" + config.database;
}

function dbConnected(next) {
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
				next(err, result);
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
    checkin.coords.latitude,
    checkin.coords.longitude,
    checkin.coords.accuracy || 'NULL',
    checkin.visibility
  ];

  connect(query('INSERT INTO checkin (' + fields + ') ' +
			    'VALUES ($1, $2, POINT($3,$4), $5, $6)', values, next));
}

function getCheckinsForDay(timestamp, landmark, next) {
  var values, fields

  fields = [
    'TIMESTAMPADD(HOUR, timezone, timestamp) AS time',
    'DATE(TIMESTAMPADD(HOUR, timezone, FROM_UNIXTIME($1))) AS date',
    'AsText(location) AS location',
    'accuracy',
    'visibility'
  ].join(',');

  values = [timestamp, landmark];

  next = next || function() {};

  connect(query('SELECT ' + fields + ' FROM checkin WHERE landmark_id = $2 ' +
				'HAVING ' +
				'time > TIMESTAMPADD(HOUR, 6, date) AND ' +
				'time < TIMESTAMPADD(HOUR, 18, date)',
				values, next));
}

function nearLandmark(coords, id, next) {
  var processResult, values;

  values = [parseFloat(coords.latitude), parseFloat(coords.longitude), id];
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

  connect(query("SELECT ST_Contains(area, ST_GeomFromText('POINT($1 $2)')) AS near " +
                "FROM landmark WHERE id = $3", values, processResult));
}

function getCheckinsForDayInCell(timestamp, landmark, cell, next) {
  var fields, values;

  fields = [
    'TIMESTAMPADD(HOUR, timezone, timestamp) AS time',
    'DATE(TIMESTAMPADD(HOUR, timezone, FROM_UNIXTIME($1))) AS date',
    'HOUR(TIMEDIFF(TIMESTAMPADD(HOUR, timezone, FROM_UNIXTIME($2)), timestamp)) AS age',
    'accuracy',
    'visibility'
  ].join(',');

  values = [timestamp, timestamp, landmark, geojson.convert(cell)];

  next = next || function() {};

  connect(query('SELECT ' + fields + ' FROM checkin ' +
                'WHERE landmark_id = $3 AND ST_Contains(ST_GeomFromText($4), location) ' +
                'HAVING ' +
                  'time > TIMESTAMPADD(HOUR, 6, date) AND ' +
                  'time < TIMESTAMPADD(HOUR, 18, date)',
			     values, next));
}

exports.storeCheckin = storeCheckin;
exports.getCheckinsForDay = getCheckinsForDay;
exports.nearLandmark = nearLandmark;
exports.getCheckinsForDayInCell = getCheckinsForDayInCell;
