var api = require('./api'),
  db = require('./db'),
  visibility = require('./visibility');

process.env.TZ = 'UTC';

visibility.init(db);
api.startServer(15150, db, visibility);
