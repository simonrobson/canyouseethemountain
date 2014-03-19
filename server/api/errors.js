exports.checkin = function(err, checkin) {
  console.log(
	'Unable to store \'valid\' response: ' + JSON.stringify(checkin) + ' ' +
	'DB Error: ' + JSON.stringify(err)
  );
};

exports.layerUpdate = function(err, checkin) {
  console.log(
    'Error occured while updating layer: ' + JSON.stringify(checkin) + ' ' +
	'Layer Error: ' + JSON.stringify(err)
  );
};

