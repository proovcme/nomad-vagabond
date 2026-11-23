#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsammler.asm
// Class: nsammler : public nvehicle  (sizeof = 0x1260 = 4704 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsammler_Layout {
    // +0x0004
    float field_0x0004;
    // +0x06f4
    float field_0x06f4;
    // +0x06f8
    float field_0x06f8;
    // +0x06fc
    float field_0x06fc;
    // +0x0700
    uint8_t field_0x0700;
    // +0x1258
    float field_0x1258;
    // +0x125c
    float field_0x125c;
    // +0x1264
    float field_0x1264;
    // +0x1268
    float field_0x1268;
    // +0x126c
    float field_0x126c;
};

// Script AddCmds (8):
//   c_vehicle/nsam_head.cc
//   v_setmaxcontainer_f
//   f_getmaxcontainer_v
//   v_setcurrentcontainer_f
//   v_addtocontainer_f
//   f_getcurrentcontainer_v
//   b_iscontainerfull_v
//   b_iscontainerempty_v

// Methods (14):
// 0x1002601c  nsammler::vfunc_00  (30 insns)
//   consts:  f32=0
// 0x1002608b  nsammler::vfunc_18  (30 insns)
//   calls:   -> nbomber::vfunc_18
// 0x100260e5  nsammler::n_init_nsammler  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nvehicle', 'cannot initialize sammler class', 'c_vehicle/nsam_head.cc'
// 0x10026140  nsammler::n_fini_nsammler  (14 insns)
// 0x10026163  nsammler::n_new_nsammler  (10 insns)
// 0x1002617d  nsammler::n_version_nsammler  (45 insns)
//   strings: 'v_setmaxcontainer_f', 'f_getmaxcontainer_v', 'v_setcurrentcontainer_f', 'v_addtocontainer_f', 'f_getcurrentcontainer_v', 'b_iscontainerfull_v', 'b_iscontainerempty_v'
// 0x10026232  nsammler::cmd_setmaxcontainer (v_setmaxcontainer_f)  (10 insns)
// 0x10026257  nsammler::cmd_getmaxcontainer (f_getmaxcontainer_v)  (11 insns)
// 0x10026281  nsammler::cmd_setcurrentcontainer (v_setcurrentcontainer_f)  (10 insns)
// 0x100262a6  nsammler::cmd_addtocontainer (v_addtocontainer_f)  (13 insns)
// 0x100262d1  nsammler::cmd_getcurrentcontainer (f_getcurrentcontainer_v)  (11 insns)
// 0x100262fb  nsammler::cmd_iscontainerfull (b_iscontainerfull_v)  (22 insns)
// 0x1002633b  nsammler::cmd_iscontainerempty (b_iscontainerempty_v)  (22 insns)
// 0x10026377  nsammler::vfunc_11  (76 insns)

} // namespace re_nnomads
