let should = require('should');
let HostManager = require('../');
let describe = require("mocha").describe;
let it = require("mocha").it;
const HOSTS = './test/fixtures/hosts';
const MHOST_CONF = './test/fixtures/.mhost.yml';

describe('HostManager', function () {
  describe('#readHostsLines()', function () {

    it('should return status true when hosts is present', function () {
      let result = new HostManager(HOSTS, MHOST_CONF).readHostsByLine();
      result.status.should.equal(true);
      result.data.should.be.deepEqual([{ ip: '127.0.0.1', host: 'localhost' }]);
    });

    it('should return all lines when preserveFormatting set true', function () {
      let result = new HostManager(HOSTS, MHOST_CONF).readHostsByLine(true);
      result.status.should.equal(true);
      result.data.should.be.deepEqual(['#mhost', { ip: '127.0.0.1', host: 'localhost' }]);
    });

    it('should return status false when hosts is not present', function () {
      let testHost = '/test/hosts';
      let result = new HostManager(testHost, MHOST_CONF).readHostsByLine(true);
      result.status.should.equal(false);
      result.msg.should.be.equal(`${testHost} is not present`);
    });

  });
});