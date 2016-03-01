var assert = require('assert');
var visibility = require('../server/visibility');

describe('aggregateVisibility', function() {
	it('averages visibilities of the same age', function() {
		var result = visibility.aggregateVisibility([{age: 0, visibility: 100}, {age: 0, visibility: 0}]);
		assert.equal(result, 50);
	});
	it('returns a weighted average based or recency of visibilities', function() {
		var result = visibility.aggregateVisibility([{age: 1, visibility: 100}, {age: 2, visibility: 50}]);
		assert.equal(result, 65);
	});
});

describe('aggregateAccuracy', function() {
	it('returns 100 when minimum age is 0', function() {
		var result = visibility.aggregateAccuracy([{age: 0}, {age: 10}]);
		assert.equal(result, 100);
	});
	it('returns 70 when minimum age is 3', function() {
		var result = visibility.aggregateAccuracy([{age: 3}, {age: 10}]);
		assert.equal(result, 70);
	});
	it('returns 20 when minimum age is 8', function() {
		var result = visibility.aggregateAccuracy([{age: 8}, {age: 10}]);
		assert.equal(result, 20);
	});
	it('returns 0 when minimum age is 10', function() {
		var result = visibility.aggregateAccuracy([{age: 10}, {age: 10}]);
		assert.equal(result, 0);
	});
	it('returns 0 when minimum age greater than 10', function() {
		var result = visibility.aggregateAccuracy([{age: 12}, {age: 20}]);
		assert.equal(result, 0);
	});
});
