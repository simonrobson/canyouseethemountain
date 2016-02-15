var api = require('./api'),
  db = require('./db'),
  air_quality = require('./air_quality'),
  visibility = require('./visibility');

process.env.TZ = 'UTC';

air_quality.init();
visibility.init(db);

api.startServer(15150, db, visibility);
