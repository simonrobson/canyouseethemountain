var api = require('./api'),
    db = require('./db');

api.startServer(5150, db)
