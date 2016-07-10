const expect = require('chai').expect;
const request = require('request');
const extend = require('../utils/extend');
const spawnServer = require('../utils/spawn-server');

const TEST_PORT = 18082;
var pivotServer;

describe('config duplicate names', function () {
  this.timeout(5000);

  before((done) => {
    pivotServer = spawnServer(`bin/pivot --config test/configs/duplicate-measure-dimension-name.yaml -p ${TEST_PORT}`, {
      env: {
        DRUID_HOST: '11.22.33.44:5555'
      }
    });

    pivotServer.onHook([`Fatal settings load error:`, `Pivot is listening on address`], done);
  });

  it('throws correct error', (testComplete) => {
    expect(pivotServer.getStderr()).to.contain(`Fatal settings load error: name 'language' found in both dimensions and measures in data source: 'wiki'`);
    testComplete();
  });

  after(() => {
    pivotServer.kill();
  });

});
