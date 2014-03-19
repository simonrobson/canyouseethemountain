var express = require('express'),
  errors = require('./errors.js');

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
        if( err ) { errors.checkin(err, checkin); }
      });
      visibility.updateVisibilityLayer(now, checkin.landmark_id, checkin, function(err, layer) {
        if( err ) { errors.layerUpdate(err, checkin); }
        res.send(200, {visibility_layer: layer});
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
