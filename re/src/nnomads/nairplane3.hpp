#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nairplane3.asm
// Class: nairplane3 : public nengine3  (sizeof = 0xa8 = 168 bytes)

#include <cstdint>

namespace re_nnomads {

struct nairplane3_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
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
    // +0x0030
    uint8_t field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x003c
    float field_0x003c;
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
    // +0x0088
    float field_0x0088;
    // +0x008c
    float field_0x008c;
    // +0x0090
    float field_0x0090;
    // +0x0094
    float field_0x0094;
    // +0x0098
    float field_0x0098;
    // +0x009c
    float field_0x009c;
    // +0x00a0
    float field_0x00a0;
    // +0x00a4
    uint8_t field_0x00a4;
    // +0x00ec
    uint32_t field_0x00ec;
    // +0x00f0
    float field_0x00f0;
    // +0x0b44
    uint32_t field_0x0b44;
    // +0x0b5c
    float field_0x0b5c;
    // +0x0b60
    float field_0x0b60;
    // +0x0b64
    float field_0x0b64;
    // +0x0b6c
    float field_0x0b6c;
    // +0x0d50
    uint32_t field_0x0d50;
    // +0x0d54
    float field_0x0d54;
    // +0x0d58
    float field_0x0d58;
};

// Script AddCmds (20):
//   v_setminspeed_f
//   f_getminspeed_v
//   v_setmaxspeed_f
//   f_getmaxspeed_v
//   v_setacceltime_f
//   f_getacceltime_v
//   v_setdeceltime_f
//   f_getdeceltime_v
//   v_setmaxyawrotation_f
//   f_getmaxyawrotation_v
//   v_setyawacceltime_f
//   f_getyawacceltime_v
//   v_setmaxpitch_f
//   f_getmaxpitch_v
//   v_setpitchtime_f
//   f_getpitchtime_v
//   v_setmaxroll_f
//   f_getmaxroll_v
//   v_setrolltime_f
//   f_getrolltime_v

// Methods (37):
// 0x10034664  nairplane3::cmd_setyawacceltime (v_setyawacceltime_f)  (10 insns)
// 0x10034686  nairplane3::cmd_getpitchtime (f_getpitchtime_v)  (11 insns)
// 0x1003627f  nairplane3::cmd_getacceltime (f_getacceltime_v)  (11 insns)
// 0x100382b5  nairplane3::cmd_setmaxpitch (v_setmaxpitch_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x10044ac8  nairplane3::cmd_getdeceltime (f_getdeceltime_v)  (11 insns)
// 0x10045549  nairplane3::cmd_setpitchtime (v_setpitchtime_f)  (10 insns)
// 0x1004b4d1  nairplane3::cmd_getminspeed (f_getminspeed_v)  (11 insns)
// 0x1004b4f8  nairplane3::cmd_setdeceltime (v_setdeceltime_f)  (10 insns)
// 0x1004bfca  nairplane3::cmd_setminspeed (v_setminspeed_f)  (10 insns)
// 0x1004c8bd  nairplane3::cmd_getmaxspeed (f_getmaxspeed_v)  (11 insns)
// 0x1004ece9  nairplane3::vfunc_24  (192 insns)
//   calls:   -> nContainer::IsHandControl, -> nRealWorld::GetFrameTime, -> nContainer::GetPosition, -> nContainer::GetActualCommand, -> nContainer::GetDirection, -> nContainer::SetWantedDir
//   consts:  f32=0, f32=1, f32=0.3
//   strings: 'move_up', 'mouse_move_up', 'move_down', 'mouse_move_down', 'turn_left', 'mouse_turn_left', 'turn_right', 'mouse_turn_right'
// 0x1004ef0e  nairplane3::vfunc_25  (17 insns)
//   calls:   -> nContainer::IsHandControl
//   consts:  f32=1.4
// 0x1004ef40  nairplane3::vfunc_26  (17 insns)
//   calls:   -> nContainer::IsHandControl
//   consts:  f32=0.8
// 0x1004ef72  nairplane3::vfunc_27  (132 insns)
//   calls:   -> nContainer::IsHandControl, -> nContainer::GetTurboMove, -> nContainer::GetPosition, -> nRealWorld::GetGlobalTime, -> nContainer::LastTurboSwitch, -> nContainer::SetTurboMove
//   consts:  f32=8, f32=0.2, f64=5, f64=1
// 0x1004f0df  nairplane3::vfunc_23  (97 insns)
//   calls:   -> nContainer::GetActualCommand, -> nContainer::GetDirection, -> nContainer::SetDirection
//   consts:  f64=0, f32=1, f32=-1, f32=0, f32=0.01
// 0x1004f1f8  nairplane3::vfunc_18  (167 insns)
//   calls:   -> nContainer::IsHandControl, -> nconsumption::vfunc_37
// 0x100504ad  nairplane3::n_init_nairplane3  (15 insns)
//   strings: 'nengine3'
// 0x100504d8  nairplane3::n_fini_nairplane3  (5 insns)
// 0x100504ea  nairplane3::n_new_nairplane3  (63 insns)
//   consts:  f32=0, f32=5
// 0x100505cf  nairplane3::vfunc_00  (14 insns)
// 0x100505fc  nairplane3::vfunc_16  (79 insns)
//   calls:   -> ncritterengine2::vfunc_16
//   consts:  f32=2.5, f32=5
// 0x100506f5  nairplane3::vfunc_19  (159 insns)
//   calls:   -> nContainer::SetTurboMove, -> nContainer::GetDirection
//   consts:  f32=0, f64=0
//   strings: 'move_forward', 'turbomove_forward'
// 0x10050889  nairplane3::vfunc_20  (709 insns)
//   calls:   -> nContainer::GetDirection, -> nContainer::SetDirection
//   consts:  f32=0, f32=-1, f32=1, f32=-0.7, f32=0.07, f32=-2, f32=-0.5
//   strings: 'turn_left', 'turn_right', 'move_up', 'move_down', 'mouse_turn_left', 'mouse_turn_right', 'mouse_move_up', 'mouse_move_down'
// 0x10051014  nairplane3::vfunc_21  (163 insns)
//   calls:   -> nContainer::GetActualCommand, -> nContainer::GetPosition, -> nContainer::GetDirection
//   consts:  f64=0
// 0x100511c0  nairplane3::vfunc_22  (605 insns)
//   calls:   -> nContainer::GetActualCommand, -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::SetDirection
//   consts:  f64=0, f32=4, f64=1e-07, f32=1, f32=-1, f32=-0.8, f32=0
//   strings: 'v_setminspeed_f', 'f_getminspeed_v', 'v_setmaxspeed_f', 'f_getmaxspeed_v', 'v_setacceltime_f', 'f_getacceltime_v', 'v_setdeceltime_f', 'f_getdeceltime_v'
// 0x10051906  nairplane3::cmd_setmaxspeed (v_setmaxspeed_f)  (10 insns)
// 0x10051928  nairplane3::cmd_setmaxyawrotation (v_setmaxyawrotation_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x10051956  nairplane3::cmd_getmaxyawrotation (f_getmaxyawrotation_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10051989  nairplane3::cmd_getmaxpitch (f_getmaxpitch_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x100519bf  nairplane3::cmd_setmaxroll (v_setmaxroll_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x100519f0  nairplane3::cmd_getmaxroll (f_getmaxroll_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10051a26  nairplane3::cmd_setrolltime (v_setrolltime_f)  (10 insns)
// 0x10051a4b  nairplane3::cmd_getrolltime (f_getrolltime_v)  (11 insns)
// 0x10051a75  nairplane3::vfunc_11  (206 insns)
//   calls:   -> ncharcinematicplayer::vfunc_11
//   consts:  f32=180, f32=0.3183099
// 0x10053485  nairplane3::cmd_getyawacceltime (f_getyawacceltime_v)  (11 insns)
// 0x1005e3aa  nairplane3::n_version_nairplane3  (37 insns)
//   calls:   -> nGuiStandardMenuEntry::nGuiStandardMenuEntry()
//   strings: 'unknown', '/game/handler/data'
// 0x1006c0a7  nairplane3::cmd_setacceltime (v_setacceltime_f)  (10 insns)

} // namespace re_nnomads
