#!/bin/zsh
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
clang++ -std=c++17 -O2 -Wno-deprecated-declarations \
    "$DIR/core/main.cpp" \
    -framework Tcl \
    -o "$DIR/nomads_core"
echo "Built native arm64 engine core: $DIR/nomads_core"
file "$DIR/nomads_core"
