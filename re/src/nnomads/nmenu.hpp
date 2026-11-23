#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmenu.asm
// Class: nmenu : public nservice  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmenu_Layout {
    // +0x0058
    float field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
};

// Methods (4):
// 0x1003c43c  nmenu::n_init_nmenu  (15 insns)
//   strings: 'nservice'
// 0x1003c467  nmenu::n_fini_nmenu  (5 insns)
// 0x1003c479  nmenu::n_new_nmenu  (10 insns)
// 0x1003c490  nmenu::n_version_nmenu  (17 insns)

} // namespace re_nnomads
