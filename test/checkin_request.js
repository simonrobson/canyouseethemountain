var assert = require('assert'),
    http = require('http'),
    api = require('../server/api'),
    sinon = require('sinon');

describe('Checkin handling', function() {
  var payload = {coords:
    {
      accuracy: 25000,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      latitude: 18.806478,
      longitude: 98.94661500000001,
      speed: null
    },
  timezone: -7,
  landmark_id: 1,
  visibility: 50
  },
  server,
  mockDb;

  beforeEach(function(done) {
    mockDb = {}
    mockDb.storeCheckin = sinon.spy();
    var config = api.configureServer(mockDb);
    server = http.createServer(config);
    server.listen(8008, done);
  });

  afterEach(function() {
    server.close();
  });

  it("accepts a payload and responds with 200", function(done) {
    var request = http.request({hostname: 'localhost', port: 8008, path: '/checkins', method: 'POST',
                                headers: {'Content-type': 'application/json'}});
    request.write(JSON.stringify({checkin: payload}));

    request.on('response', function(response) {
      assert.equal(response.statusCode, 200);
      assert(mockDb.storeCheckin.calledOnce, "StoreCheckin should be called once");
      assert(mockDb.storeCheckin.calledWith(payload), "storeCheckin should be called with the payload")
      done();
    });

    request.end();
    assert.equal(true, true);
  });

  it("rejects badly fomred payloads", function(done) {
    var request = http.request({hostname: 'localhost', port: 8008, path: '/checkins', method: 'POST',
                                headers: {'Content-type': 'application/json'}});
    request.write(JSON.stringify({checkin: {coords: {}}}));

    request.on('response', function(response) {
      assert.equal(response.statusCode, 403);
      assert(!mockDb.storeCheckin.called, "StoreCheckin should not be called");
      done();
    });

    request.end();
    assert.equal(true, true);
  });
});
