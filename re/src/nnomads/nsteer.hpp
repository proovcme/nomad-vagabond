#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsteer.asm
// Class: nsteer : public nservice  (sizeof = 0x74 = 116 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsteer_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    float field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x006c
    float field_0x006c;
    // +0x0070
    float field_0x0070;
};

// Script AddCmds (1):
//   m_steer/nsteer_main.cc

// Methods (19):
// 0x10055d7b  nsteer::n_init_nsteer  (15 insns)
//   strings: 'nservice'
// 0x10055da6  nsteer::n_fini_nsteer  (5 insns)
// 0x10055db8  nsteer::n_new_nsteer  (25 insns)
// 0x10055e10  nsteer::vfunc_00  (14 insns)
// 0x10055e3d  nsteer::vfunc_16  (35 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x10055eec  nsteer::vfunc_35  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_steer/nsteer_main.cc'
// 0x10055f0f  nsteer::vfunc_36  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_steer/nsteer_main.cc'
// 0x100561ce  nsteer::vfunc_38  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'not implemented', 'm_steer/nsteer_main.cc'
// 0x100564d4  nsteer::cmd_setmaxspeedtime (v_setmaxspeedtime_f)  (13 insns)
// 0x100564fc  nsteer::cmd_getmaxspeedtime (f_getmaxspeedtime_v)  (14 insns)
// 0x10056527  nsteer::cmd_setmaxlift (v_setmaxlift_f)  (13 insns)
// 0x1005654f  nsteer::cmd_getmaxlift (f_getmaxlift_v)  (14 insns)
// 0x100565a2  nsteer::cmd_setmaxrotation (v_setmaxrotation_f)  (15 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x100565d5  nsteer::cmd_getmaxrotation (f_getmaxrotation_v)  (16 insns)
//   consts:  f32=180, f32=0.3183099
// 0x1005660c  nsteer::cmd_setmaxrotationtime (v_setmaxrotationtime_f)  (13 insns)
// 0x10056634  nsteer::cmd_getmaxrotationtime (f_getmaxrotationtime_v)  (14 insns)
// 0x1005665f  nsteer::cmd_settoprotation (v_settoprotation_f)  (15 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x10056692  nsteer::cmd_gettoprotation (f_gettoprotation_v)  (16 insns)
//   consts:  f32=180, f32=0.3183099
// 0x100566cc  nsteer::vfunc_11  (180 insns)
//   calls:   -> ncollidedata::vfunc_11
//   consts:  f32=180, f32=0.3183099

} // namespace re_nnomads
