#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmaennelengine3.asm
// Class: nmaennelengine3 : public nairplane3  (sizeof = 0xac = 172 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmaennelengine3_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x006c
    float field_0x006c;
    // +0x0070
    float field_0x0070;
    // +0x00a8
    float field_0x00a8;
};

// Script AddCmds (2):
//   v_setboosttime_f
//   f_getboosttime_v

// Methods (9):
// 0x10052a56  nmaennelengine3::n_init_nmaennelengine3  (15 insns)
//   strings: 'nairplane3'
// 0x10052a81  nmaennelengine3::n_fini_nmaennelengine3  (5 insns)
// 0x10052a93  nmaennelengine3::n_new_nmaennelengine3  (17 insns)
// 0x10052ac4  nmaennelengine3::vfunc_00  (12 insns)
// 0x10052ae6  nmaennelengine3::vfunc_16  (7 insns)
//   calls:   -> nairplane3::vfunc_16
// 0x10052afd  nmaennelengine3::vfunc_19  (152 insns)
//   calls:   -> nRealWorld::GetGlobalTime, -> nContainer::GetDirection
//   strings: 'v_setboosttime_f', 'f_getboosttime_v'
// 0x10052c89  nmaennelengine3::cmd_setboosttime (v_setboosttime_f)  (10 insns)
// 0x10052cae  nmaennelengine3::cmd_getboosttime (f_getboosttime_v)  (11 insns)
// 0x10052cd8  nmaennelengine3::vfunc_11  (31 insns)
//   calls:   -> nairplane3::vfunc_11

} // namespace re_nnomads
