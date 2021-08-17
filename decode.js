#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
    alias: {
        help: ['h'],
        version: ['v'],
    },
	boolean: [
		'help',
		'version',
	]
})

const usage = `Usage:
    echo -n <url-encoded-string> | url-decode
Examples:
    echo -n '%7B%22foo%22%3A%20%22bar%22%7D' | url-decode
    # {"foo": "bar"}\n`

if (argv.help) {
	process.stdout.write(usage)
	process.exit(0)
}

if (argv.version) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit(0)
}

if (argv._.length > 1) { // Couldn't parse arguments
    process.stderr.write(usage)
    process.exit(2)
}

const {pipeline, Transform} = require('stream')
// todo: querystring is deprecated, use URLSearchParams, but how? escape non-ASCII characters?
const qs = require('querystring')
const fs = require('fs')

let input
if (argv._.length === 0 || argv._[0] === '-') {
    input = process.stdin
} else {
    input = fs.createReadStream(argv._[0])
}

pipeline(
	input,
	new Transform({
		highWaterMark: 10 * 1024 * 1024,
		transform: function encode (chunk, _, cb) {
			const data = chunk.toString('utf-8')
			this.push(qs.unescape(data))
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
