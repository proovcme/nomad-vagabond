#!/bin/zsh
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
clang++ -std=c++17 -O2 -fobjc-arc -Wno-deprecated-declarations \
    "$DIR/app/main.mm" \
    -framework Cocoa -framework Metal -framework MetalKit -framework QuartzCore -framework Tcl \
    -o "$DIR/Nomads"
echo "Built native arm64 game binary: $DIR/Nomads"
file "$DIR/Nomads"
