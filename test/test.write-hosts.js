let should = require('should');
let HostManager = require('../');
let describe = require("mocha").describe;
let it = require("mocha").it;
const HOSTS = './test/fixtures/hosts';
const MHOST_CONF = './test/fixtures/.mhost.yml';

describe('HostManager', function () {
  describe('#writeHosts()', function () {

    const hostManager = new HostManager(HOSTS, MHOST_CONF);

    it('should write hosts success', function () {
      let writeLines = hostManager.getConfigValue('test-remote').data;

      let result = hostManager.writeHosts(writeLines);
      result.status.should.be.equal(true);
      result.msg.should.be.equal('write hosts success');

      let readData = hostManager.readHostsByLine().data;
      let readLines = readData.reduce(function (res, each) {
        res.push(`${each.ip} ${each.host}`);
        return res;
      }, []);
      readLines.should.containDeep(writeLines);
    });

    after(function () {
      hostManager.resetHosts();
    });

  });
});