var api = require('./api'),
  db = require('./db'),
  visibility = require('./visibility'),
  air_quality = require('./air_quality');

process.env.TZ = 'UTC';

visibility.init(db);
air_quality.init([{sensor: '36t', metric: 'pm10'}, {sensor: '36t', metric: 'pm25'}], 10);

api.startServer(15150, db, visibility);
