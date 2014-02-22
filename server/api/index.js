var express = require('express');

function configureServer(db) {
  var app = express();

  app.use(express.bodyParser());

  app.post('/checkins', function(req, res){
    /* need to validate */
    db.storeCheckin(req.param('checkin'));
    res.send(200);
  });

  return app;
}

exports.configureServer = configureServer;
exports.startServer = function(port, db) {
  app = exports.configureServer(db);
  app.listen(port);
}
