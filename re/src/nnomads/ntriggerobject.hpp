#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ntriggerobject.asm
// Class: ntriggerobject : public ncontainer  (sizeof = 0xec8 = 3784 bytes)

#include <cstdint>

namespace re_nnomads {

struct ntriggerobject_Layout {
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0eb0
    float field_0x0eb0;
    // +0x0eb4
    uint32_t field_0x0eb4;
    // +0x0eb8
    float field_0x0eb8;
    // +0x0ebc
    uint32_t field_0x0ebc;
    // +0x0ec0
    uint32_t field_0x0ec0;
    // +0x0ec4
    uint32_t field_0x0ec4;
};

// Script AddCmds (12):
//   v_settriggerradius_f
//   f_gettriggerradius_v
//   v_setfilter_s
//   s_getfilter_v
//   v_setcycletime_f
//   f_getcycletime_v
//   v_setnumcycles_i
//   i_getnumcycles_v
//   v_setcurrentcycle_i
//   i_getcurrentcycle_v
//   v_setaction_s
//   s_getaction_v

// Methods (14):
// 0x1001b8a5  ntriggerobject::n_init_ntriggerobject  (15 insns)
//   strings: 'ncontainer'
// 0x1001b8d0  ntriggerobject::n_fini_ntriggerobject  (5 insns)
// 0x1001b8e2  ntriggerobject::n_new_ntriggerobject  (26 insns)
//   calls:   -> nContainer::nContainer()
// 0x1001b93c  ntriggerobject::vfunc_00  (131 insns)
//   calls:   IAT: nkernel.dll!n_free, -> nContainer::~nContainer(), IAT: nkernel.dll!n_strdup
//   strings: 'v_settriggerradius_f', 'f_gettriggerradius_v', 'v_setfilter_s', 's_getfilter_v', 'v_setcycletime_f', 'f_getcycletime_v', 'v_setnumcycles_i', 'i_getnumcycles_v'
// 0x1001bb00  ntriggerobject::cmd_settriggerradius (v_settriggerradius_f)  (10 insns)
// 0x1001bb4f  ntriggerobject::cmd_setfilter (v_setfilter_s)  (12 insns)
// 0x1001bb79  ntriggerobject::cmd_getfilter (s_getfilter_v)  (42 insns)
//   strings: 'none', 'enemy', 'friendly', 'playervehicle', 'playerisland', 'playermaennel', 'playerany', 'all'
// 0x1001bbed  ntriggerobject::cmd_setcycletime (v_setcycletime_f)  (10 insns)
// 0x1001bc12  ntriggerobject::cmd_getcycletime (f_getcycletime_v)  (11 insns)
// 0x1001bc3c  ntriggerobject::cmd_setnumcycles (v_setnumcycles_i)  (10 insns)
// 0x1001bc60  ntriggerobject::cmd_getnumcycles (i_getnumcycles_v)  (13 insns)
// 0x1001bc8c  ntriggerobject::cmd_setcurrentcycle (v_setcurrentcycle_i)  (10 insns)
// 0x1001bcb0  ntriggerobject::cmd_setaction (v_setaction_s)  (24 insns)
// 0x1001bcfd  ntriggerobject::vfunc_11  (360 insns)
//   calls:   -> nContainer::SaveCmds
//   strings: 'none', 'enemy', 'friendly', 'playervehicle', 'playerisland', 'playermaennel', 'playerany', 'all'

} // namespace re_nnomads
