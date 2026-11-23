#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsilo.asm
// Class: nsilo : public nservice  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsilo_Layout {
    // +0x0058
    float field_0x0058;
};

// Methods (4):
// 0x10041ab8  nsilo::n_init_nsilo  (15 insns)
//   strings: 'nservice'
// 0x10041ae3  nsilo::n_fini_nsilo  (5 insns)
// 0x10041af5  nsilo::n_new_nsilo  (10 insns)
// 0x10041b0c  nsilo::n_version_nsilo  (11 insns)

} // namespace re_nnomads
