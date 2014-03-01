var api = require('./api'),
    db = require('./db');

api.startServer(15150, db)
