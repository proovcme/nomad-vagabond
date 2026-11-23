#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nservice.asm
// Class: nservice : public nroot  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct nservice_Layout {
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
};

// Methods (5):
// 0x10031cdd  nservice::n_init_nservice  (10 insns)
//   strings: 'nroot'
// 0x10031cfe  nservice::n_fini_nservice  (5 insns)
// 0x10031d10  nservice::n_new_nservice  (23 insns)
// 0x10031d4a  nservice::vfunc_00  (24 insns)
// 0x10031e26  nservice::vfunc_19  (14 insns)

} // namespace re_nnomads
