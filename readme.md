# *url-decode-encode-cli*

**Command line utility for URL decoding & encoding.** No dependencies.

[![npm version](https://img.shields.io/npm/v/url-decode-encode-cli.svg)](https://www.npmjs.com/package/url-decode-encode-cli)
[![build status](https://img.shields.io/travis/derhuerst/url-decode-encode-cli.svg)](https://travis-ci.org/derhuerst/url-decode-encode-cli)
[![dependency status](https://img.shields.io/david/derhuerst/url-decode-encode-cli.svg)](https://david-dm.org/derhuerst/url-decode-encode-cli)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/url-decode-encode-cli.svg)](https://david-dm.org/derhuerst/url-decode-encode-cli#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/url-decode-encode-cli.svg)


## Installing

```shell
npm install -g url-decode-encode-cli
```


## Usage

```shell
echo -n '{"foo": "bar"}' | url-encode # %7B%22foo%22%3A%20%22bar%22%7D
echo -n '%7B%22foo%22%3A%20%22bar%22%7D' | url-decode # {"foo": "bar"}
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/url-decode-encode-cli/issues).
