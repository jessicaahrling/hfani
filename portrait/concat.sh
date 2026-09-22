#!/usr/bin/env bash
# Slar ihop klipp i angiven ordning:  ./concat.sh alla.mp4 out/00_intro.mp4 out/01_rapport.mp4 ...
set -e; out="$1"; shift; list=$(mktemp)
for f in "$@"; do echo "file '$(realpath "$f")'" >> "$list"; done
ffmpeg -y -loglevel error -f concat -safe 0 -i "$list" -c copy -movflags +faststart "$out" && rm "$list" && echo "skrev $out"
