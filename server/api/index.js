var express = require('express'),
    schema = require('validate');

var checkinSchema = schema(
    {coords: {
               // latitude: {type: 'number', required: false},
               // latitudeAccuracy: {type: 'number', required: false},
               // heading: {type: 'number', required: false},
               accuracy: {required: false},
               latitude: {required: true},
               longitude: {required: true},
               // speed: {type: 'number', required: false}
             },
      landmark_id: {required: true},
      visibility: {required: true}
    });


function checkinIsValid(checkin) {
  var result = checkinSchema.validate(checkin);
  return (result.errors.length === 0) ? true : false;
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
