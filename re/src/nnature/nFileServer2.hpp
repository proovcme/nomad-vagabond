#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nFileServer2.asm
// Class: nFileServer2

#include <cstdint>

namespace re_nnature {

struct nFileServer2_Layout {
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
};

// Methods (2):
// 0x10004feb  nFileServer2::nFileServer2()  (32 insns)
//   calls:   -> nRoot::nRoot()
// 0x10005035  nFileServer2::operator=  (38 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free

} // namespace re_nnature
