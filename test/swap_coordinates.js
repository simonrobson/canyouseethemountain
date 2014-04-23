var assert = require('assert'),
	visibility = require('../server/visibility');

describe('swapCoordinates', function() {
	var arrayOfCoordinates = [[1,2], [3,4], [5,6]],
		coordinate = [1,2];

	it("swap single coordinate correctly", function() {
		var result = visibility.swapCoordinates(coordinate);
		assert.deepEqual(result[0],[2, 1]);
	});

	it("swap array coordinates correctly", function() {
		var result = visibility.swapCoordinates(arrayOfCoordinates);
		assert.deepEqual(result[0],[2, 1]);
		assert.deepEqual(result[1],[4, 3]);
		assert.deepEqual(result[2],[6, 5]);
	});

});
