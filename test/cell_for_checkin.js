var assert = require('assert'),
	sinon = require('sinon'),
	http = require('http'),
	visibility = require('../server/visibility');

describe('cellForCheckin', function() {
	var checkin = {
		coords: {
		  accuracy: 25000,
	      altitude: null,
	      altitudeAccuracy: null,
	      heading: null,
	      latitude: 18.806478,
	      longitude: 98.94661500000001,
	      speed: null
	    },
	    timezone: -7,
	    landmark_id: 1,
	    visibility: 50
	  };

	it("produces a cell with dimension .001 for precision of three", function() {
		var result = visibility.cellForCheckin(checkin, 3);
		assert.deepEqual(result.coordinates[0][0],[18.807, 98.946]);
		assert.deepEqual(result.coordinates[0][1],[18.807, 98.947]);
		assert.deepEqual(result.coordinates[0][2],[18.806, 98.947]);
		assert.deepEqual(result.coordinates[0][3],[18.806, 98.946]);
		assert.deepEqual(result.coordinates[0][4],[18.807, 98.946]);
	});

	it("produces a cell with dimension .0001 for precision of four", function() {
		var result = visibility.cellForCheckin(checkin, 4);
		assert.deepEqual(result.coordinates[0][0],[18.8065, 98.9466]);
		assert.deepEqual(result.coordinates[0][1],[18.8065, 98.9467]);
		assert.deepEqual(result.coordinates[0][2],[18.8064, 98.9467]);
		assert.deepEqual(result.coordinates[0][3],[18.8064, 98.9466]);
		assert.deepEqual(result.coordinates[0][4],[18.8065, 98.9466]);
	});
});
