#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nreplenish.asm
// Class: nreplenish : public nservice  (sizeof = 0x64 = 100 bytes)

#include <cstdint>

namespace re_nnomads {

struct nreplenish_Layout {
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    float field_0x0060;
};

// Methods (4):
// 0x10031f09  nreplenish::n_init_nreplenish  (15 insns)
//   strings: 'nservice'
// 0x10031f34  nreplenish::n_fini_nreplenish  (5 insns)
// 0x10031f46  nreplenish::n_new_nreplenish  (10 insns)
// 0x10031f5d  nreplenish::n_version_nreplenish  (13 insns)

} // namespace re_nnomads
