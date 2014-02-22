var express = require('express');


function checkinIsValid(checkin) {
  if (!(checkin.coords && checkin.timestamp && checkin.landmark_id && checkin.visibility)) { return false; }
  var c = checkin.coords;
  if (!(c.latitude && c.longitude)) { return false; }
  return true;
}

function configureServer(db) {
  var app = express();

  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/../../public'));

  app.post('/checkins', function(req, res) {
    var checkin = req.param('checkin');
    if (checkin && checkinIsValid(checkin)) {
      db.storeCheckin(checkin);
      res.send(200);
    } else {
      res.send(403);
    }
  });

  return app;
}

exports.configureServer = configureServer;
exports.startServer = function(port, db) {
  app = exports.configureServer(db);
  app.listen(port);
}
