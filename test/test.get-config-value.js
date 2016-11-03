let should = require('should');
let HostManager = require('../');
const HOSTS = './test/fixtures/hosts';
const MHOST_CONF = './test/fixtures/.mhost.yml';

describe('HostManager', function () {
  describe('#getConfigValue()', function () {

    it('should return status false when config key is present', function () {
      let result = new HostManager(HOSTS, MHOST_CONF).getConfigValue('test');
      result.status.should.equal(false);
      result.msg.should.be.equal('test is not a key');
    });

    it('should return status true when mhost config file is present', function () {
      let result = new HostManager(HOSTS, MHOST_CONF).getConfigValue('test-remote');
      result.status.should.equal(true);
      result.data.should.be.deepEqual(['111.111.111.111 test.remote1.com', '222.222.222.222 test.remote2.com']);
    });

  });
});






