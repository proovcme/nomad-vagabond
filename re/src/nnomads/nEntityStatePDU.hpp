#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nEntityStatePDU.asm
// Class: nEntityStatePDU

#include <cstdint>

namespace re_nnomads {

struct nEntityStatePDU_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00ca
    uint32_t field_0x00ca;
    // +0x00cc
    uint32_t field_0x00cc;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00f8
    double field_0x00f8;
    // +0x016c
    uint32_t field_0x016c;
    // +0x0178
    uint32_t field_0x0178;
    // +0x017c
    uint32_t field_0x017c;
};

// Methods (2):
// 0x10010d33  nEntityStatePDU::nEntityStatePDU()  (111 insns)
//   calls:   -> nDataPDU::nDataPDU()
// 0x10010f07  nEntityStatePDU::operator=  (90 insns)
//   calls:   -> nDataPDU::operator=

} // namespace re_nnomads
