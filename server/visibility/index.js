
var layers = {};

function visibilityLayer(timestamp, landmark) {
	return layers[landmark] || {};
}

function initVisibilityLayer(timestamp, landmark) {
	getCheckinsForDay(timestamp, landmark, updateVibilityLayerWithCheckins(timestamp, landmark));
}

function updateVisibilityLayer(timestamp, landmark, checkin, next) {
	nearLandmark(checkin.coords.latitude, checkin.coods.longitude, function(err, near, area) {
		if( !near ) {
			next(null, layers[landmark]);
			return;
		}

		cell = cellForCheckin(checkin, area);

		getCheckinsInCellForDay(timestamp, landmark, cell, function(err, checkins) {
			updateLayer(layers[landmark], checkins.reduce(weightedAverage));
			next(null, layers[landmark]);
		}
	});
}

function updateVisibilityLayerWithCheckins(timestamp, landmark) {
	return function(err, checkins) {
		checkins.each(function(checkin) {
			updateVisibilityLayer(timestamp, landmark, checkin);
		});
	};
}

function cellForCheckin(checkin) {

}
exports.visibilityLayer = visibilityLayer;
