#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nImageFile.asm
// Class: nImageFile

#include <cstdint>

namespace re_nnature {

struct nImageFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint8_t field_0x0018;
};

// Methods (2):
// 0x10001ec0  nImageFile::nImageFile()  (16 insns)
// 0x10001ef3  nImageFile::operator=  (15 insns)

} // namespace re_nnature
