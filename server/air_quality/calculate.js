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

exports.average = average;
exports.genRange = genRange;
