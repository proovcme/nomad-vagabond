#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nairship3.asm
// Class: nairship3 : public nengine3  (sizeof = 0xa0 = 160 bytes)

#include <cstdint>

namespace re_nnomads {

struct nairship3_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0018
    double field_0x0018;
    // +0x0020
    uint8_t field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0044
    uint8_t field_0x0044;
    // +0x004c
    uint8_t field_0x004c;
    // +0x0050
    float field_0x0050;
    // +0x0054
    float field_0x0054;
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
    // +0x0074
    float field_0x0074;
    // +0x0078
    float field_0x0078;
    // +0x007c
    float field_0x007c;
    // +0x0080
    float field_0x0080;
    // +0x0084
    float field_0x0084;
    // +0x0094
    float field_0x0094;
    // +0x0098
    float field_0x0098;
    // +0x009c
    float field_0x009c;
    // +0x0b5c
    float field_0x0b5c;
    // +0x0b60
    float field_0x0b60;
    // +0x0b64
    float field_0x0b64;
    // +0x0b6c
    float field_0x0b6c;
    // +0x0d58
    float field_0x0d58;
};

// Script AddCmds (18):
//   v_setmaxspeed_f
//   f_getmaxspeed_v
//   v_setacceltime_f
//   f_getacceltime_v
//   v_setdeceltime_f
//   f_getdeceltime_v
//   v_setmaxvertspeed_f
//   f_getmaxvertspeed_v
//   v_setvertacceltime_f
//   f_getvertacceltime_v
//   v_setmaxyawrotation_f
//   f_getmaxyawrotation_v
//   v_setyawacceltime_f
//   f_getyawacceltime_v
//   v_setmaxroll_f
//   f_getmaxroll_v
//   v_setrolltime_f
//   f_getrolltime_v

// Methods (20):
// 0x100346b0  nairship3::cmd_setyawacceltime (v_setyawacceltime_f)  (10 insns)
// 0x10035e1f  nairship3::cmd_getvertacceltime (f_getvertacceltime_v)  (11 insns)
// 0x10044aef  nairship3::cmd_getmaxvertspeed (f_getmaxvertspeed_v)  (11 insns)
// 0x1004ae66  nairship3::cmd_getyawacceltime (f_getyawacceltime_v)  (11 insns)
// 0x10051cd1  nairship3::n_init_nairship3  (15 insns)
//   strings: 'nengine3'
// 0x10051cfc  nairship3::n_fini_nairship3  (5 insns)
// 0x10051d0e  nairship3::n_new_nairship3  (40 insns)
// 0x10051d99  nairship3::vfunc_00  (12 insns)
// 0x10051dbb  nairship3::vfunc_16  (77 insns)
//   calls:   -> ncritterengine2::vfunc_16
// 0x10051e9f  nairship3::vfunc_21  (234 insns)
//   calls:   -> nContainer::GetActualCommand, -> nContainer::GetDirection, -> nContainer::GetPosition
//   consts:  f64=0, f64=1e-07, f32=-1
// 0x10052112  nairship3::vfunc_22  (459 insns)
//   calls:   -> nContainer::GetActualCommand, -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::SetDirection
//   consts:  f64=0, f32=4, f64=1e-07, f32=1, f32=-1, f32=3, f32=0, f32=0.1, f32=-0.8
//   strings: 'v_setmaxspeed_f', 'f_getmaxspeed_v', 'v_setacceltime_f', 'f_getacceltime_v', 'v_setdeceltime_f', 'f_getdeceltime_v', 'v_setmaxvertspeed_f', 'f_getmaxvertspeed_v'
// 0x10052704  nairship3::cmd_setvertacceltime (v_setvertacceltime_f)  (10 insns)
// 0x10052726  nairship3::cmd_setmaxyawrotation (v_setmaxyawrotation_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x10052754  nairship3::cmd_getmaxyawrotation (f_getmaxyawrotation_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10052787  nairship3::cmd_setmaxroll (v_setmaxroll_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x100527b8  nairship3::cmd_getmaxroll (f_getmaxroll_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x100527ee  nairship3::cmd_setrolltime (v_setrolltime_f)  (10 insns)
// 0x10052813  nairship3::cmd_getrolltime (f_getrolltime_v)  (11 insns)
// 0x1005283d  nairship3::vfunc_11  (186 insns)
//   calls:   -> ncharcinematicplayer::vfunc_11
//   consts:  f32=180, f32=0.3183099
// 0x100791b7  nairship3::cmd_setmaxvertspeed (v_setmaxvertspeed_f)  (10 insns)

} // namespace re_nnomads
