var express = require('express');

function checkinIsValid(checkin) {
  if (!(checkin.coords && checkin.timezone && checkin.landmark_id && checkin.visibility)) {
	  return false;
  }
  var c = checkin.coords;
  if (!(c.latitude && c.longitude)) { return false; }
  return true;
}

function configureServer(db, visibility) {
  var app = express();

  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/../../public'));

  app.post('/checkins', function(req, res) {
    var checkin = req.param('checkin');
    if (checkin && checkinIsValid(checkin)) {
      var now = (new Date()).getTime();
      db.storeCheckin(checkin, function(err, response) {
        if( err ) {
          console.log(
            'Unable to store \'valid\' response: ' +
            JSON.stringify(checkin) + ' DB Error: ' +
            JSON.stringify(err)
          );
        }
      });
      visibility.updateVisibilityLayer(now, checkin.landmark_id, checkin, function(err, layer) {
        if( err ) {
          console.log(
            'Error occured while updating layer: ' +
            JSON.stringify(checkin) + ' Layer Error: ' +
            JSON.stringify(err)
          );
        }
        res.send(200, layer);
	  });
    } else {
      res.send(403);
    }
  });

  return app;
}

exports.configureServer = configureServer;
exports.startServer = function(port, db, visibility) {
  app = exports.configureServer(db, visibility);
  app.listen(port);
}
