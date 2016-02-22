var assert = require('assert');
var calculate = require('../server/air_quality/calculate.js');

describe('genRange', function() {
	it('returns ranges within a single day', function() {
		var result = calculate.genRange({year: 2016, month: 2, date: 10, hour: 9}, 'hours', 5);
		assert.deepEqual(result, [
			{year: 2016, month: 2, date: 10, hour: 5},
			{year: 2016, month: 2, date: 10, hour: 6},
			{year: 2016, month: 2, date: 10, hour: 7},
			{year: 2016, month: 2, date: 10, hour: 8},
			{year: 2016, month: 2, date: 10, hour: 9}
		]);
	});
	it('returns ranges that span two days', function() {
		var result = calculate.genRange({year: 2016, month: 2, date: 10, hour: 2}, 'hours', 5);
		assert.deepEqual(result, [
			{year: 2016, month: 2, date: 9, hour: 22},
			{year: 2016, month: 2, date: 9, hour: 23},
			{year: 2016, month: 2, date: 10, hour: 0},
			{year: 2016, month: 2, date: 10, hour: 1},
			{year: 2016, month: 2, date: 10, hour: 2}
		]);
	})
	it('returns ranges that span two months', function() {
		var result = calculate.genRange({year: 2016, month: 2, date: 1, hour: 2}, 'hours', 5);
		assert.deepEqual(result, [
			{year: 2016, month: 1, date: 31, hour: 22},
			{year: 2016, month: 1, date: 31, hour: 23},
			{year: 2016, month: 2, date: 1, hour: 0},
			{year: 2016, month: 2, date: 1, hour: 1},
			{year: 2016, month: 2, date: 1, hour: 2}
		]);
	});
	it('returns ranges that span two years', function() {
		var result = calculate.genRange({year: 2016, month: 1, date: 1, hour: 2}, 'hours', 5);
		assert.deepEqual(result, [
			{year: 2015, month: 12, date: 31, hour: 22},
			{year: 2015, month: 12, date: 31, hour: 23},
			{year: 2016, month: 1, date: 1, hour: 0},
			{year: 2016, month: 1, date: 1, hour: 1},
			{year: 2016, month: 1, date: 1, hour: 2}
		]);
	});
});

describe('mergeValues', function() {
	it('merges based on date', function() {
		result = calculate.mergeValues([
			{year: 2015, month: 12, date: 31, hour: 22},
			{year: 2015, month: 12, date: 31, hour: 23},
			{year: 2016, month: 1, date: 1, hour: 0},
			{year: 2016, month: 1, date: 1, hour: 1},
			{year: 2016, month: 1, date: 1, hour: 2}
		], [
			{year: 2015, month: 12, date: 31, hour: 22, value: 9},
			{year: 2016, month: 1, date: 1, hour: 1, value: 10},
			{year: 2016, month: 1, date: 1, hour: 2, value: 2}
		])
		assert.deepEqual(result, [
			{year: 2015, month: 12, date: 31, hour: 22, value: 9},
			{year: 2015, month: 12, date: 31, hour: 23},
			{year: 2016, month: 1, date: 1, hour: 0},
			{year: 2016, month: 1, date: 1, hour: 1, value: 10},
			{year: 2016, month: 1, date: 1, hour: 2, value: 2}
		]);
	});
});

describe('fillGaps', function() {
	it('fills value gaps with the average of their edges', function() {
		result = calculate.fillGaps([
			{year: 2015, month: 12, date: 31, hour: 22, value: 9},
			{year: 2015, month: 12, date: 31, hour: 23},
			{year: 2016, month: 1, date: 1, hour: 0},
			{year: 2016, month: 1, date: 1, hour: 1, value: 10},
			{year: 2016, month: 1, date: 1, hour: 2, value: 2}
		]);
		assert.deepEqual(result, [
			{year: 2015, month: 12, date: 31, hour: 22, value: 9},
			{year: 2015, month: 12, date: 31, hour: 23, value: 9.5},
			{year: 2016, month: 1, date: 1, hour: 0, value: 9.5},
			{year: 2016, month: 1, date: 1, hour: 1, value: 10},
			{year: 2016, month: 1, date: 1, hour: 2, value: 2}
		]);
	});
});
