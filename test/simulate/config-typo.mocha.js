const expect = require('chai').expect;
const request = require('request');
const extend = require('../utils/extend');
const spawnServer = require('../utils/spawn-server');

const TEST_PORT = 18082;
var pivotServer;

describe('config typo', function () {
  this.timeout(5000);

  before((done) => {
    pivotServer = spawnServer(`bin/pivot --config test/configs/one-little-datasource.yaml -p ${TEST_PORT}`, {
      env: {
        DRUID_HOST: '11.22.33.44:5555'
      }
    });
    pivotServer.onHook('Pivot is listening on address', done);
  });

  it('works with GET /', (testComplete) => {
    request.get(`http://localhost:${TEST_PORT}/`, (err, response, body) => {
      expect(err).to.equal(null);
      expect(pivotServer.getStderr()).to.contain('Settings load timeout hit, continuing');
      expect(response.statusCode).to.equal(200);
      expect(body).to.contain('<!DOCTYPE html>');
      expect(body).to.contain('<title>Pivot');
      expect(body).to.contain('<div class="app-container"></div>');
      expect(body).to.contain('"dataSources":[]');
      expect(body).to.contain('</html>');
      testComplete();
    });
  });

  after(() => {
    pivotServer.kill();
  });

});
