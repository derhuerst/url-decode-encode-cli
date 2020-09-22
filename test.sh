#!/bin/bash

blub='{"foo": "bar"}'
out="$(echo -n $blub | ./encode.js | ./decode.js)";

if [ "$out" != "$blub" ]; then
	>&2 echo "input -> encode -> decode -> output doesn't match"
	exit 1
fi
