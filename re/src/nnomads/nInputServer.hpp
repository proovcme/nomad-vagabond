#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nInputServer.asm
// Class: nInputServer

#include <cstdint>

namespace re_nnomads {

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
// 0x10008164  nInputServer::nInputServer()  (71 insns)
//   calls:   -> nRoot::nRoot()
// 0x10008249  nInputServer::operator=  (75 insns)
//   calls:   -> nRoot::operator=
// 0x10008390  nInputServer::SetMouseFactor  (10 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x100083b4  nInputServer::GetMouseFactor  (2 insns)
// 0x100083bb  nInputServer::SetMouseInvert  (12 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x100083e4  nInputServer::GetMouseInvert  (2 insns)

} // namespace re_nnomads
