#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nunloadore.asm
// Class: nunloadore : public nbehaviour  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct nunloadore_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0014
    float field_0x0014;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    float field_0x0058;
    // +0x0059
    uint8_t field_0x0059;
    // +0x005a
    uint8_t field_0x005a;
};

// Script AddCmds (2):
//   v_setunloadpersecond_f
//   f_getunloadpersecond_v

// Methods (7):
// 0x100362fc  nunloadore::n_init_nunloadore  (15 insns)
//   strings: 'nbehaviour'
// 0x10036327  nunloadore::n_fini_nunloadore  (5 insns)
// 0x10036339  nunloadore::n_new_nunloadore  (10 insns)
// 0x10036350  nunloadore::n_version_nunloadore  (11 insns)
// 0x1003636d  nunloadore::vfunc_00  (12 insns)
// 0x1003638f  nunloadore::vfunc_18  (57 insns)
//   calls:   -> nStateNode::GetClan, -> nbehaviour::vfunc_18
//   consts:  f32=-1
//   strings: 'v_setunloadpersecond_f', 'f_getunloadpersecond_v'
// 0x10036453  nunloadore::vfunc_11  (46 insns)
//   calls:   -> nbehaviour::vfunc_11

} // namespace re_nnomads
