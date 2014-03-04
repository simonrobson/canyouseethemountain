var mysql = require('mysql')
	config = require('../config/db.js');

var db = mysql.createConnection(config.db);

function storeCheckin(checkin, next) {
	var fields, values;

	next = next || function() {};

	fields = [
		'timestamp', 'timezone', 'landmark_id', 'location', 'accuracy', 'visibility'
	].join(','),

	values = [
		Math.floor((new Date()).getTime() / 1000),
		checkin.timezone,
		checkin.landmark_id,
		checkin.coords.latitude,
		checkin.coords.longitude,
		checkin.coords.accuracy || 'NULL',
		checkin.visibility
	];

	db.query('INSERT INTO checkin (' + fields + ') VALUES (?, ?, ?, POINT(?,?), ?, ?)', values, next);
}

function nearLandmark(lat, lng, id, next) {
	var processResult, values;

	values= [lat, lng, id];
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

exports.storeCheckin = storeCheckin;
exports.nearLandmark = nearLandmark;
