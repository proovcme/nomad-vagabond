#!/bin/zsh
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
APP="$ROOT/Project Nomads.app"

# 1. Build native arm64 Mach-O binary
"$DIR/build_nomads.sh"

# 2. Assemble macOS .app bundle
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$DIR/Nomads" "$APP/Contents/MacOS/Nomads"

# Convert original game icon (.ico -> .icns) if present
ICO=$(ls "$ROOT/extracted/Misc/"*.ico 2>/dev/null | head -n 1 || true)
if [[ -n "$ICO" ]]; then
    ICONSET="/tmp/nomads_icon.iconset"
    rm -rf "$ICONSET" && mkdir -p "$ICONSET"
    sips -s format png "$ICO" --out "$ICONSET/base.png" >/dev/null 2>&1 || true
    if [[ -f "$ICONSET/base.png" ]]; then
        for sz in 16 32 64 128 256 512; do
            sips -z $sz $sz "$ICONSET/base.png" --out "$ICONSET/icon_${sz}x${sz}.png" >/dev/null 2>&1 || true
        done
        rm -f "$ICONSET/base.png"
        iconutil -c icns "$ICONSET" -o "$APP/Contents/Resources/AppIcon.icns" 2>/dev/null || true
    fi
    rm -rf "$ICONSET"
fi

cat > "$APP/Contents/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>Project Nomads</string>
    <key>CFBundleDisplayName</key>
    <string>Проект «Бродяги»</string>
    <key>CFBundleIdentifier</key>
    <string>com.nomads.native.arm64</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleExecutable</key>
    <string>Nomads</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>LSMinimumSystemVersion</key>
    <string>13.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

echo "Built native macOS bundle: $APP"
