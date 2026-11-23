#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nPDU.asm
// Class: nPDU

#include <cstdint>

namespace re_nnomads {

struct nPDU_Layout {
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x001e
    uint32_t field_0x001e;
    // +0x0020
    uint8_t field_0x0020;
    // +0x0021
    uint8_t field_0x0021;
    // +0x0028
    double field_0x0028;
    // +0x0030
    uint8_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint32_t field_0x003c;
};

// Methods (2):
// 0x10006edf  nPDU::nPDU()  (39 insns)
// 0x10006f49  nPDU::operator=  (38 insns)

} // namespace re_nnomads
