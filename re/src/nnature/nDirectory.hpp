#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nDirectory.asm
// Class: nDirectory

#include <cstdint>

namespace re_nnature {

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
// 0x10004e7c  nDirectory::nDirectory()  (29 insns)
// 0x10004eea  nDirectory::operator=  (48 insns)
// 0x10004fdc  nDirectory::IsOpen  (3 insns)
// 0x10004fe4  nDirectory::GetPathName  (2 insns)

} // namespace re_nnature
