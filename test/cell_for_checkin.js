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
		assert.deepEqual(result.coordinates[0][0],[98.946, 18.807]);
		assert.deepEqual(result.coordinates[0][1],[98.947, 18.807]);
		assert.deepEqual(result.coordinates[0][2],[98.947, 18.806]);
		assert.deepEqual(result.coordinates[0][3],[98.946, 18.806]);
		assert.deepEqual(result.coordinates[0][4],[98.946, 18.807]);
	});

	it("produces a cell with dimension .0001 for precision of four", function() {
		var result = visibility.cellForCheckin(checkin, 4);
		assert.deepEqual(result.coordinates[0][0],[98.9466, 18.8065]);
		assert.deepEqual(result.coordinates[0][1],[98.9467, 18.8065]);
		assert.deepEqual(result.coordinates[0][2],[98.9467, 18.8064]);
		assert.deepEqual(result.coordinates[0][3],[98.9466, 18.8064]);
		assert.deepEqual(result.coordinates[0][4],[98.9466, 18.8065]);
	});
});
