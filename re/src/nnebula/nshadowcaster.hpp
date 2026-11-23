#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nshadowcaster.asm
// Class: nshadowcaster : public nroot  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnebula {

struct nshadowcaster_Layout {
    // +0x0044
    uint8_t field_0x0044;
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
// 0x100373d5  nshadowcaster::n_init_nshadowcaster  (10 insns)
//   strings: 'nroot'
// 0x100373f6  nshadowcaster::n_fini_nshadowcaster  (5 insns)
// 0x10037408  nshadowcaster::n_new_nshadowcaster  (10 insns)
// 0x1003741f  nshadowcaster::n_version_nshadowcaster  (15 insns)
// 0x10037448  nshadowcaster::vfunc_00  (31 insns)

} // namespace re_nnebula
