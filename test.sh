#!/bin/bash
set -e
set -o pipefail
set -x

function fails_match_stdin() {
    out="$(echo -n "$1" | ./encode.js | ./decode.js)";
    echo "$1"
    echo "$out"
    [ "$1" != "$out" ]
}
function fails_match_filein() {
    TMPDIR=`mktemp -d` # Can someone check this on OS X and BSD
    echo -n $1 >"$TMPDIR/1"
    ./encode.js "$TMPDIR/1" >"$TMPDIR/2"
    out="$(./decode.js "$TMPDIR/2")"
    rm -r "$TMPDIR"
    [ "$1" != "$out" ]
}
function fails_compat() {
    # Check that file input and stdin input give the same output
    TMPDIR=`mktemp -d` # Can someone check this on OS X and BSD
    echo -n $1 >"$TMPDIR/1"
    ./encode.js "$TMPDIR/1" >"$TMPDIR/2"
    middle1="$(echo -n "$1" | ./encode.js)";
    middle2="$(./encode.js "$TMPDIR/1")"

    echo -n $1 >"$TMPDIR/2"
    end1="$(echo -n "$middle1" | ./decode.js)"
    end2="$(./decode.js "$TMPDIR/2")"
    rm -r "$TMPDIR"

    [ "$middle1" == "$middle2" ] || return 0
    [ "$end1" == "$end2" ] || return 0
    return 1
}

blub='{"foo": "bar"}'
if fails_match_stdin "$blub"; then
	>&2 echo "input -> encode -> decode -> output doesn't match (stdin)"
	exit 1
fi
if fails_match_filein "$blub"; then
	>&2 echo "input -> encode -> decode -> output doesn't match (file in)"
	exit 1
fi
if fails_compat "$blub"; then
    >&2 echo "input -> encode-stdin doesn't match input -> encode-file"
    exit 1
fi

# doesn't break non-ASCII characters
in2='🏃🏽‍♀️🧑🏽‍🦯'
if fails_match_stdin "$in2"; then
	>&2 echo "input -> encode -> decode -> output doesn't match for '$in2' (stdin)"
	exit 1
fi
if fails_match_filein "$in2"; then
	>&2 echo "input -> encode -> decode -> output doesn't match for '$in2' (file in)"
	exit 1
fi
if fails_compat "$in2"; then
    >&2 echo "input -> encode-stdin doesn't match input -> encode-file for '$in2'"
    exit 1
fi

# >100mb input data, reported in #3
head -c 115343360 /dev/random | ./encode.js | ./decode.js >/dev/null
