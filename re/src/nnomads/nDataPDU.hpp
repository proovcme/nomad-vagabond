#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nDataPDU.asm
// Class: nDataPDU

#include <cstdint>

namespace re_nnomads {

struct nDataPDU_Layout {
    // +0x0040
    uint32_t field_0x0040;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint8_t field_0x004c;
};

// Methods (2):
// 0x100080a8  nDataPDU::nDataPDU()  (19 insns)
//   calls:   -> nPDU::nPDU()
// 0x100080db  nDataPDU::operator=  (18 insns)
//   calls:   -> nPDU::operator=

} // namespace re_nnomads
