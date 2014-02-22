var api = require('./api'),
    db = require('./db');

api.startServer(3000, db)
