#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nDirectory.asm
// Class: nDirectory

#include <cstdint>

namespace re_nnomads {

struct nDirectory_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint8_t field_0x0008;
    // +0x0208
    uint8_t field_0x0208;
    // +0x020c
    uint32_t field_0x020c;
    // +0x0410
    uint32_t field_0x0410;
};

// Methods (4):
// 0x1000be9c  nDirectory::nDirectory()  (29 insns)
// 0x1000bf0a  nDirectory::operator=  (48 insns)
// 0x1000bffc  nDirectory::IsOpen  (3 insns)
// 0x1000c004  nDirectory::GetPathName  (2 insns)

} // namespace re_nnomads
