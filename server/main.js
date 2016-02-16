var api = require('./api'),
  db = require('./db'),
  visibility = require('./visibility'),
  air_quality = require('./air_quality');

process.env.TZ = 'UTC';

air_quality.init();
visibility.init(db);
api.startServer(15150, db, visibility, air_quality);
