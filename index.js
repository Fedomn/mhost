const fs = require('fs');
const yaml = require('js-yaml');
const chalk = require('chalk');
const _ = require('lodash');

const HOSTS = '/etc/hosts';
const MHOST_CONF = `${process.env.HOME}/.config/.mhost.yml`;

const HOST_LINE_REGEX = /^\s*?([^#]+?)\s+([^#]+?)$/;
const ENCODING = { encoding: 'utf-8' };
const MHOST_START_FLAG = '###------------mhost---start------------###';
const MHOST_END_FLAG = '###------------mhost---end--------------###';
const EOL = '\n';

const DEMO_CONFIG = {
  "demo": {
    "127.0.0.1": "test.1.com test.2.com"
  }
};

class HostManager {

  /**
   * Console operate info by res status
   */
  static console(res) {
    if (res.status) {
      console.info();
      console.info(chalk.bold.green(`  ${res.msg}`));
      console.info();
      process.exit(0);
    } else {
      console.error();
      console.error(chalk.bold.red(`  ${res.msg}`));
      console.error();
      process.exit(1);
    }
  }

  /**
   * Create .mhost.file
   */
  static createConfigFile() {
    if (fs.existsSync(MHOST_CONF)) {
      return { status: false, msg: `config file ${MHOST_CONF} has existed` };
    } else {
      let output = yaml.dump(DEMO_CONFIG);
      try {
        fs.writeFileSync(MHOST_CONF, output);
        return { status: true, msg: `create config file: ${MHOST_CONF} success` };
      } catch (err) {
        return { status: false, msg: err };
      }
    }
  }

  /**
   * Constructor
   */
  constructor(hosts, conf) {
    try {
      this._host = hosts || HOSTS;
      this._conf = conf || MHOST_CONF;
      this._doc = yaml.safeLoad(fs.readFileSync(this._conf, ENCODING));
    } catch (e) {
      HostManager.console({ status: false, msg: 'config yml not exist, please run mhost setup before' });
    }
  }

  /**
   * Get .mhost.yml all keys
   */
  getConfigKeys() {
    if (this._doc) {
      return { status: true, data: Object.keys(this._doc) };
    } else {
      return { status: false, msg: `please add config key in ${this._conf}` };
    }
  }

  /**
   * Write key map value to hosts
   * @param key .mhost.yml key
   */
  setConfigValue(key) {
    let configRes = this.getConfigValue(key);
    if (configRes.status) {
      return this.writeHosts(configRes.data);
    } else {
      return configRes;
    }
  }

  /**
   * Get config value by key
   * @param alias .mhost.yml key
   */
  getConfigValue(alias) {
    if (!this._doc) return { status: false, msg: `please add config key in ${this._conf}` };
    let doc = this._doc[alias];
    if (!doc) {
      return { status: false, msg: `${alias} is not a key` };
    } else {
      let data = _.reduce(doc, function (res, host, ip) {
        res.push(`${ip} ${host}`);
        return res;
      }, []);
      return { status: true, data: data };
    }
  }

  /**
   * Read hosts by line
   * @param preserveFormatting get all lines
   * @return {status, data, msg}
   * status: operate status
   * data: array ip-host-map or else
   * msg: operate msg
   */
  readHostsByLine(preserveFormatting) {
    let lines = [];
    try {
      fs.readFileSync(this._host, ENCODING)
        .split(/\r?\n/)
        .forEach(function (line) {
          let matches = HOST_LINE_REGEX.exec(line);
          if (matches && matches.length === 3) {
            lines.push({ ip: matches[1], host: matches[2] });
          } else {
            // Found a comment, blank line, or something else
            if (preserveFormatting) lines.push(line);
          }
        });
      return { status: true, data: lines };
    } catch (err) {
      return { status: false, msg: `${this._host} is not present` };
    }
  }

  /**
   * Write mhost config
   */
  writeHosts(writeLines) {
    let [mhostStart, mhostEnd] = [false, false];
    let readlines = this.readHostsByLine(true).data;
    let lines = readlines.reduce(function (res, line) {
      if (mhostStart && mhostEnd) [mhostStart, mhostEnd] = [false, false];
      if (line === MHOST_START_FLAG) mhostStart = true;
      if (line === MHOST_END_FLAG) mhostEnd = true;
      if (mhostStart && !mhostEnd) return res;

      if (typeof line === 'object') {
        res.push(`${line.ip} ${line.host}`);
      } else {
        if (line !== MHOST_END_FLAG) res.push(line);
      }
      return res;
    }, []);

    lines.push(MHOST_START_FLAG);

    writeLines.forEach(function (writeLine) {
      lines.push(writeLine);
    });

    lines.push(MHOST_END_FLAG);

    let stat = fs.statSync(this._host);
    try {
      fs.writeFileSync(this._host, lines.join(EOL), { mode: stat.mode });
      return { status: true, msg: 'write hosts success' };
    } catch (err) {
      return { status: false, msg: 'error: permission denied. please run as root' };
    }
  }

  /**
   * Remove mhost config
   */
  resetHosts() {
    let [mhostStart, mhostEnd] = [false, false];
    let readlines = this.readHostsByLine(true).data;
    let lines = readlines.reduce(function (res, line) {
      if (mhostStart && mhostEnd) [mhostStart, mhostEnd] = [false, false];
      if (line === MHOST_START_FLAG) mhostStart = true;
      if (line === MHOST_END_FLAG) mhostEnd = true;
      if (mhostStart && !mhostEnd) return res;

      if (typeof line === 'object') {
        res.push(`${line.ip} ${line.host}`);
      } else {
        if (line !== MHOST_END_FLAG) res.push(line);
      }
      return res;
    }, []);
    let stat = fs.statSync(this._host);
    try {
      fs.writeFileSync(this._host, lines.join(EOL), { mode: stat.mode });
      return { status: true, msg: 'reset host success' };
    } catch (err) {
      return { status: false, msg: 'error: permission denied. please run as root' };
    }
  }
}

module.exports = HostManager;