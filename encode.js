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
    echo -n <url> | url-encode
    or: url-encode [FILE]
Examples:
    echo -n '{"foo": "bar"}' | url-encode
    # %7B%22foo%22%3A%20%22bar%22%7D\n`

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

var input_file = undefined
if (argv._.length == 0) {
    input_file = process.stdin
} else {
    input_file = fs.createReadStream(argv._[0])
}

pipeline(
	input_file,
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
