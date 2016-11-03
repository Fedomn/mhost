let should = require('should');
let HostManager = require('../');
const HOSTS = './test/fixtures/hosts';
const MHOST_CONF = './test/fixtures/.mhost.yml';
const MHOST_EMPTY_CONF = './test/fixtures/.mhost.empty.yml';

describe('HostManager', function () {
  describe('#getConfigKeys()', function () {

    it('should return status false when mhost config file is empty', function () {
      let result = new HostManager(HOSTS, MHOST_EMPTY_CONF).getConfigKeys();
      result.status.should.equal(false);
      result.msg.should.be.equal(`please add config key in ${MHOST_EMPTY_CONF}`);
    });

    it('should return status true when mhost config file is present', function () {
      let result = new HostManager(HOSTS, MHOST_CONF).getConfigKeys();
      result.status.should.equal(true);
      result.data.should.be.deepEqual(['test-remote', 'test-local']);
    });

  });
});






