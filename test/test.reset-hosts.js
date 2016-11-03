let should = require('should');
let HostManager = require('../');
let describe = require("mocha").describe;
let it = require("mocha").it;
const HOSTS = './test/fixtures/hosts';
const MHOST_CONF = './test/fixtures/.mhost.yml';

describe('HostManager', function () {
  describe('#resetHosts()', function () {

    const hostManager = new HostManager(HOSTS, MHOST_CONF);

    it('should reset hosts success', function () {
      let writeLines = hostManager.getConfigValue('test-remote').data;

      hostManager.writeHosts(writeLines);

      let result = hostManager.resetHosts();
      result.status.should.be.equal(true);
      result.msg.should.be.equal('reset host success');

      let readData = hostManager.readHostsByLine().data;
      let readLines = readData.reduce(function (res, each) {
        res.push(`${each.ip} ${each.host}`);
        return res;
      }, []);
      readLines.should.not.containDeep(writeLines);
    });

  });
});