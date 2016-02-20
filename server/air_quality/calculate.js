var moment = require('moment');

function average(values, hours) {
	return values.pop();
}

function genRange(end, unit, hours) {
	var result = [end];
	var current = moment(end).month(end.month - 1);

	for(i = 1; i < hours; i++) {
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

function timestamp(elem) {
	return [elem.year,elem.month,elem.date,elem.hour].join('|');
}

exports.average = average;
exports.genRange = genRange;
exports.mergeValues = mergeValues;
