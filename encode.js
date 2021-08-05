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

const qs = require('querystring')

process.stdin
.on('error', () => process.exit(1))

let data = ''

process.stdin
.on('data', (chunk) => {
	data += chunk.toString()
})
.on('end', () => {
	process.stdout.write(qs.escape(data))
})
