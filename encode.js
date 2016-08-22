#!/usr/local/bin/node
'use strict'

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
