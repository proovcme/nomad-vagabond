#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ntimer.asm
// Class: ntimer : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct ntimer_Layout {
    // +0x0020
    uint32_t field_0x0020;
    // +0x0038
    uint32_t field_0x0038;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0140
    double field_0x0140;
    // +0x0178
    uint8_t field_0x0178;
    // +0x0eb8
    float field_0x0eb8;
    // +0x0ebc
    uint32_t field_0x0ebc;
    // +0x0ec0
    uint32_t field_0x0ec0;
};

// Methods (5):
// 0x10032205  ntimer::n_init_ntimer  (10 insns)
//   strings: 'nservice'
// 0x10032226  ntimer::n_fini_ntimer  (5 insns)
// 0x10032238  ntimer::n_new_ntimer  (16 insns)
// 0x1003225c  ntimer::vfunc_00  (12 insns)
// 0x1003227e  ntimer::vfunc_18  (80 insns)
//   calls:   -> nconsumption::vfunc_37, -> nStateNode::GetThrowEvents, -> nStateNode::GetEventSlot, -> nStateNode::ThrowEvent

} // namespace re_nnomads
