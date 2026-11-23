# Project Nomads — Native macOS Apple Silicon (`arm64`) Port

Clean-room native C++17 / Objective-C++ / Metal / `Tcl.framework` port of **Project Nomads** (2002, Radon Labs / Nebula Device 1) for Apple Silicon macOS — **no Wine**.

> **Note:** Original game data files (`data.npk`, `data1.npk`, scripts, audio) are **not** included in this repository. Place your legally owned extracted `Run/` directory at the path configured in `native/app/main.mm` (or pass it as `argv[1]`).

## Structure
- `native/app/main.mm` — Cocoa + Metal (`MTKView`, 4× MSAA, 16× AF trilinear mipmaps, 2-pass opaque/additive/cloud renderer, GPU camera-facing billboards, wind sway, MacBook trackpad controls, `NSSound`).
- `native/core/` — Native Nebula Device 1 kernel (`nKernelServer`, `nFileServer`/`NPK0`, `nTclServer`, `nBookHandler`, `nEventHandler`, `nCookieHandler`, `nAnimSequence` cinematics, `nRealWorld`, `nOpcodeServer` Möller–Trumbore terrain collision, `nPlayerController`, `nCombatSystem`, `nVehicleFlightController`, `nHouseMenu`, `nSammler`, `nPawnShop`, `nLightNode`, `nFogNode`, `nChannelServer`, `nParticleSystem`, save/load).
- `native/viewer/nebula_assets.hpp` — Binary parsers for `NPK0`, `NVX1` (including skinned `0x8b` & point-sprite billboards), `NTX1`, `NOB0`, `nShaderNode` (226 shaders), `nIpol` curves & `weather_normal.n`.
- `native/nnature/` — Native C++17 reimplementation of `nnature.dll`.
- `re/` — Reverse-engineering architecture docs, class trees, JSON specs, disassembly/lifting Python tools (`re/tools/`), and lifted C++ class layouts for all 454 classes across all 11 engine DLLs (`re/src/MASTER_INDEX.md`).

## Build (macOS Apple Silicon)
```zsh
cd native
./build_app.sh
```
Requires Xcode Command Line Tools (`clang++`, Cocoa, Metal, MetalKit, QuartzCore, Tcl.framework).
