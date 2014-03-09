var mysql = require('mysql'),
	geojson = require('../../node_modules/geojson2wkt/Geojson2Wkt.js'),
	config = require('../config/db.js');

var db = mysql.createConnection(config.db);

db.query('SET time_zone = "UTC"', function(err, success){
	if( err ) { console.log('unable to set time zone to UTC'); }
	else { console.log('set time zone to UTC'); }
});

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

	db.query('INSERT INTO checkin (' + fields + ') ' +
			 'VALUES (?, ?, POINT(?,?), ?, ?)', values, next);
}

function getCheckinsForDay(timestamp, landmark, next) {
	var values, fields

	fields = [
		'TIMESTAMPADD(HOUR, timezone, timestamp) AS timestamp',
		'DATE(TIMESTAMPADD(HOUR, timezone * -1, FROM_UNIXTIME(?))) AS date',
		'AsText(location) AS location',
		'accuracy',
		'visibility'
	].join(',');

	values = [timestamp, landmark];

	next = next || function() {};

	db.query('' +
		'SELECT ' + fields + ' FROM checkin WHERE landmark_id = ? ' +
		'HAVING ' +
			'timestamp > TIMESTAMPADD(HOUR, 6, date) AND ' +
			'timestamp < TIMESTAMPADD(HOUR, 18, date)',
	values, next);
}

function nearLandmark(coords, id, next) {
	var processResult, values;

	values= [coords.latitude, coords.longitude, id];
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

	db.query("SELECT MBRContains(area, GeomFromText('POINT(? ?)')) AS near " +
			 "FROM landmark WHERE id = ?", values, processResult);
}

function getCheckinsForDayInCell(timestamp, landmark, cell, next) {
	var fields, values;

	fields = [
		'TIMESTAMPADD(HOUR, timezone, timestamp) AS timestamp',
		'DATE(TIMESTAMPADD(HOUR, timezone * -1, FROM_UNIXTIME(?))) AS date',
		'HOUR(TIMEDIFF(TIMESTAMPADD(HOUR, timezone * -1, FROM_UNIXTIME(?)), timestamp)) AS age',
		'accuracy',
		'visibility'
	].join(',');

	values = [timestamp, timestamp, landmark, geojson.convert(cell)];

	next = next || function() {};

	db.query('' +
		'SELECT ' + fields + ' FROM checkin ' +
		'WHERE landmark_id = ? AND MBRContains(GeomFromText(?), location) ' +
		'HAVING ' +
			'timestamp > TIMESTAMPADD(HOUR, 6, date) AND ' +
			'timestamp < TIMESTAMPADD(HOUR, 18, date)',
	values, next);
}

exports.storeCheckin = storeCheckin;
exports.getCheckinsForDay = getCheckinsForDay;
exports.nearLandmark = nearLandmark;
exports.getCheckinsForDayInCell = getCheckinsForDayInCell;
