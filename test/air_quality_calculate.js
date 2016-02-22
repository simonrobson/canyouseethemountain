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
	it('uses the un-avergaged upper edge of a gap, when at the beginning of a range', function() {
		result = calculate.fillGaps([
			{year: 2015, month: 12, date: 31, hour: 22},
			{year: 2015, month: 12, date: 31, hour: 23},
			{year: 2016, month: 1, date: 1, hour: 0, value: 6},
			{year: 2016, month: 1, date: 1, hour: 1, value: 10},
			{year: 2016, month: 1, date: 1, hour: 2, value: 2}
		]);
		assert.deepEqual(result, [
			{year: 2015, month: 12, date: 31, hour: 22, value: 6},
			{year: 2015, month: 12, date: 31, hour: 23, value: 6},
			{year: 2016, month: 1, date: 1, hour: 0, value: 6},
			{year: 2016, month: 1, date: 1, hour: 1, value: 10},
			{year: 2016, month: 1, date: 1, hour: 2, value: 2}
		]);
	});
	it('uses the un-avergaged lower edge of a gap, when at the end of a range', function() {
		result = calculate.fillGaps([
			{year: 2015, month: 12, date: 31, hour: 22, value: 8},
			{year: 2015, month: 12, date: 31, hour: 23, value: 12},
			{year: 2016, month: 1, date: 1, hour: 0, value: 6},
			{year: 2016, month: 1, date: 1, hour: 1},
			{year: 2016, month: 1, date: 1, hour: 2}
		]);
		assert.deepEqual(result, [
			{year: 2015, month: 12, date: 31, hour: 22, value: 8},
			{year: 2015, month: 12, date: 31, hour: 23, value: 12},
			{year: 2016, month: 1, date: 1, hour: 0, value: 6},
			{year: 2016, month: 1, date: 1, hour: 1, value: 6},
			{year: 2016, month: 1, date: 1, hour: 2, value: 6}
		]);
	});
});

describe('average', function() {
	it('returns an average over of the specified [hours]', function() {
		result = calculate.average([
			{year: 2015, month: 12, date: 31, hour: 22, value: 8},
			{year: 2015, month: 12, date: 31, hour: 23, value: 12},
			{year: 2016, month: 1, date: 1, hour: 0, value: 1},
			{year: 2016, month: 1, date: 1, hour: 1, value: 2},
			{year: 2016, month: 1, date: 1, hour: 2, value: 8}
		], 5);
		assert.deepEqual(result, {year: 2016, month: 1, date: 1, hour: 2, value: 6.2});
	});
	it('it estimates missing data, before averaging', function() {
		result = calculate.average([
			{year: 2015, month: 12, date: 31, hour: 22, value: 8},
			{year: 2016, month: 1, date: 1, hour: 1, value: 5},
			{year: 2016, month: 1, date: 1, hour: 2, value: 4}
		], 5);
		assert.deepEqual(result, {year: 2016, month: 1, date: 1, hour: 2, value: 6});
	});
});
