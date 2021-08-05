#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    echo -n <url> | url-encode
Examples:
    echo -n '{"foo": "bar"}' | url-encode
    # %7B%22foo%22%3A%20%22bar%22%7D
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit(0)
}

const {pipeline, Transform} = require('stream')
// todo: querystring is deprecated, use URLSearchParams, but how? escape non-ASCII characters?
const qs = require('querystring')

pipeline(
	process.stdin,
	new Transform({
		highWaterMark: 10 * 1024 * 1024,
		transform: function encode (chunk, _, cb) {
			const data = chunk.toString('utf-8')
			this.push(qs.escape(data))
			cb(null)
		},
	}),
	process.stdout,
	(err) => {
		if (!err) return;
		console.error(err)
		process.exit(1)
	},
)
