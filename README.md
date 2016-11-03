# Mhost

[![Build Status](https://travis-ci.org/Fedomn/mhost.png?branch=master)](https://travis-ci.org/Fedomn/mhost)
[![NPM Version](http://img.shields.io/npm/v/mhost.svg?style=flat)](https://www.npmjs.org/package/mhost)
[![NPM Downloads](https://img.shields.io/npm/dm/mhost.svg?style=flat)](https://www.npmjs.org/package/mhost)

manage hosts by workspace file .mhost.yml

## Installation

    $ npm install -g mhost

## Commands

```
setup        create mhost config file ~/.config/.mhost.yml
list         list hosts ip host mapping
keys         list mhost key
set [alias]  set mhost match value to hosts
reset        remove mhost match value from hosts
```

## Workspace file
workspace file is yaml. Here is an example:

```
test-local:
    127.0.0.1: test.1.com test.2.com
test-remote:
    111.111.111.111: test.1.com
    222.222.222.222: test.2.com
```

## License

MIT
