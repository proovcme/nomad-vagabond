#pragma once
// Auto-lifted C++ layout & method spec from ndinput8.dll
// Source ASM: re/disasm/ndinput8/nInputServer.asm
// Class: nInputServer

#include <cstdint>

namespace re_ndinput8 {

struct nInputServer_Layout {
    // +0x00a0
    uint8_t field_0x00a0;
    // +0x00a1
    uint8_t field_0x00a1;
    // +0x00cc
    uint32_t field_0x00cc;
    // +0x0110
    double field_0x0110;
    // +0x0118
    double field_0x0118;
    // +0x0120
    float field_0x0120;
    // +0x0124
    uint8_t field_0x0124;
};

// Methods (6):
// 0x1000186f  nInputServer::nInputServer()  (71 insns)
//   calls:   -> nRoot::nRoot()
// 0x10001954  nInputServer::operator=  (75 insns)
//   calls:   -> nRoot::operator=
// 0x10001a9b  nInputServer::SetMouseFactor  (10 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10001abf  nInputServer::GetMouseFactor  (2 insns)
// 0x10001ac6  nInputServer::SetMouseInvert  (12 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10001aef  nInputServer::GetMouseInvert  (2 insns)

} // namespace re_ndinput8
