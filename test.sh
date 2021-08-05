#!/bin/bash
set -e
set -o pipefail
set -x

blub='{"foo": "bar"}'
out="$(echo -n $blub | ./encode.js | ./decode.js)";

if [ "$out" != "$blub" ]; then
	>&2 echo "input -> encode -> decode -> output doesn't match"
	exit 1
fi

# doesn't break non-ASCII characters
in2='🏃🏽‍♀️🧑🏽‍🦯'
out2="$(echo -n "$in2" | ./encode.js | ./decode.js)"
if [ "$out2" != "$in2" ]; then
	>&2 echo "input -> encode -> decode -> output doesn't match for '$in2'"
	exit 1
fi

# >100mb input data, reported in #3
head -c 115343360 /dev/random | ./encode.js | ./decode.js >/dev/null
