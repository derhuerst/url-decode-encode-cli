#!/bin/sh

blub='{"foo": "bar"}'
out="$(echo $blub | ./encode.js | ./decode.js)";

if [ "$out" != "$blub" ]; then
	echo "input -> encode -> decode -> output doesn't match"
	exit 1
fi
