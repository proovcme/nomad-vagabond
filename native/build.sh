#!/bin/zsh
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
clang++ -std=c++17 -O2 -fobjc-arc \
    "$DIR/viewer/main.mm" \
    -framework Cocoa -framework Metal -framework MetalKit -framework QuartzCore \
    -o "$DIR/NomadsViewer"
echo "Built native arm64 binary: $DIR/NomadsViewer"
file "$DIR/NomadsViewer"
