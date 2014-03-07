var api = require('./api'),
    db = require('./db'),
    visibility = require('./visibility');

api.startServer(15150, db)
