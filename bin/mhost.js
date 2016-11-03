#! /usr/bin/env node

let chalk = require('chalk');
let program = require('commander');
let Table = require('cli-table');
let inquirer = require('inquirer');
let HostManager = require('../');

program
  .version('1.0.0');

program
  .command('setup')
  .description('create mhost config file ~/.config/.mhost.yml')
  .action(function () {
    HostManager.console(HostManager.createConfigFile());
  });

program
  .command('list')
  .description('list hosts ip host mapping')
  .action(function () {
    let res = new HostManager().readHostsByLine();
    if (res.status) {
      let table = new Table({
        head: ['Ip', 'Host'],
        style: { head: ['blue', 'bold'], compact: true }
      });
      res.data.forEach(function (line) {
        table.push([chalk.bold.cyan(line.ip), chalk.bold.green(line.host)]);
      });
      console.log(table.toString());
    } else {
      HostManager.console(res);
    }
  });

program
  .command('keys')
  .description('list mhost key')
  .action(function () {
    let res = new HostManager().getConfigKeys();
    if (res.status) {
      let table = new Table({ compact: true });
      res.data.forEach(function (key) {
        table.push({ [chalk.bold.blue('key')]: chalk.bold.green(key) });
      });
      console.log(table.toString());
    } else {
      HostManager.console(res);
    }
  });

program
  .command('set')
  .description('set mhost match value to hosts')
  .arguments('[alias]')
  .action(function (alias) {
    let hostManager = new HostManager();
    if (alias) {
      HostManager.console(hostManager.setConfigValue(alias));
    } else {
      let res = hostManager.getConfigKeys();
      if (!res.status) HostManager.console(res);

      let choices = res.data.reduce(function (res, key) {
        res.push({ name: key });
        return res;
      }, []);

      let questions = [{
        type: 'rawlist',
        name: 'key',
        message: 'please select key',
        choices: choices
      }];

      inquirer.prompt(questions).then(function (answers) {
        HostManager.console(hostManager.setConfigValue(answers.key));
      });
    }
  });

program
  .command('reset')
  .description('remove mhost match value from hosts')
  .action(function () {
    HostManager.console(new HostManager().resetHosts());
  });

program
  .command('*')
  .description('out put help info')
  .action(function (command) {
    console.error();
    console.error(`unknown command : '${command}'. See 'mhost -h'.`);
    console.error();
  });

program
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}


