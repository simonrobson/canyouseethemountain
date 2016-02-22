var moment = require('moment');

function average(values, hours) {
	var end = values[values.length - 1];
	var result = {year: end.year, month: end.month, date: end.date, hour: end.hour};
	var range = fillGaps(mergeValues(genRange(end, 'hours', hours), values));

	result.value = range
		.map(function(v) { return v.value; })
		.reduce(function(sum, v) {  return sum += v; }, 0) / range.length;

	return result;
}

function genRange(end, unit, quantity) {
	var result = [end];
	var current = moment(end).month(end.month - 1);

	for(i = 1; i < quantity; i++) {
		current.subtract(1, unit);
		result.unshift({
			year: current.year(),
			month: current.month() + 1,
			date: current.date(),
			hour: current.hour()
		});
	}

	return result;
}

function mergeValues(target, values) {
	var targetTS = target.map(timestamp);
	var valuesTS = values.map(timestamp);
	var targetIndex;

	valuesTS.forEach(function(timestamp, index) {
		targetIndex = targetTS.indexOf(timestamp);
		if( targetIndex !== -1 ) {
			target[targetIndex].value = values[index].value;
		}
	});

	return target;
}

function fillGaps(values) {
	var gap = [];
	var leading = null;

	values.forEach(function(value, index) {
		if( !value.value ) {
			leading = gap.length === 0 && !!values[index -1] ? values[index - 1].value : leading;
			gap.push(value);
		} else {
			fillGap(gap, leading, value.value);
			leading = null;
			gap = [];
		}
	});

	if( gap.length > 0 ) { fillGap(gap, leading, null); }

	return values;
}

function fillGap(gap, leading, trailing) {
	gap.forEach(function(empty) {
		empty.value = !leading ? trailing : !trailing ? leading : (leading + trailing) / 2;
	});
}

function timestamp(elem) {
	return [elem.year,elem.month,elem.date,elem.hour].join('|');
}

exports.average = average;
exports.genRange = genRange;
exports.mergeValues = mergeValues;
exports.fillGaps = fillGaps;
