#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nengine3.asm
// Class: nengine3 : public nservice  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct nengine3_Layout {
    // +0x0058
    uint32_t field_0x0058;
};

// Methods (4):
// 0x1004eb8b  nengine3::n_init_nengine3  (15 insns)
//   strings: 'nservice'
// 0x1004ebb6  nengine3::n_fini_nengine3  (5 insns)
// 0x1004ebc8  nengine3::n_new_nengine3  (25 insns)
// 0x1004ec06  nengine3::vfunc_00  (14 insns)

} // namespace re_nnomads
