#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/npowersupply.asm
// Class: npowersupply : public nservice  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct npowersupply_Layout {
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
};

// Script AddCmds (2):
//   v_setpowerpersecond_f
//   f_getpowerpersecond_v

// Methods (8):
// 0x10034bef  npowersupply::n_init_npowersupply  (15 insns)
//   strings: 'nservice'
// 0x10034c1a  npowersupply::n_fini_npowersupply  (5 insns)
// 0x10034c2c  npowersupply::n_new_npowersupply  (10 insns)
// 0x10034c43  npowersupply::n_version_npowersupply  (11 insns)
// 0x10034c60  npowersupply::vfunc_00  (12 insns)
// 0x10034ca7  npowersupply::vfunc_19  (3 insns)
// 0x10034cb1  npowersupply::vfunc_18  (55 insns)
//   calls:   -> nStateNode::GetClan, -> nconsumption::vfunc_37
//   strings: 'v_setpowerpersecond_f', 'f_getpowerpersecond_v'
// 0x10034d45  npowersupply::vfunc_11  (35 insns)
//   calls:   -> ncollidedata::vfunc_11

} // namespace re_nnomads
