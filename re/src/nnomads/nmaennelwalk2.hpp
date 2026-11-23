#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmaennelwalk2.asm
// Class: nmaennelwalk2 : public nengine2  (sizeof = 0xb8 = 184 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmaennelwalk2_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0014
    float field_0x0014;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0064
    float field_0x0064;
    // +0x007c
    float field_0x007c;
    // +0x0084
    float field_0x0084;
    // +0x00a4
    float field_0x00a4;
    // +0x00a8
    float field_0x00a8;
    // +0x00ac
    float field_0x00ac;
    // +0x00b0
    float field_0x00b0;
    // +0x00b4
    float field_0x00b4;
    // +0x0b42
    uint8_t field_0x0b42;
    // +0x0b43
    uint8_t field_0x0b43;
    // +0x0b5c
    float field_0x0b5c;
    // +0x0b78
    uint32_t field_0x0b78;
    // +0x0c90
    float field_0x0c90;
    // +0x1273
    uint8_t field_0x1273;
};

// Script AddCmds (12):
//   v_setmaxspeed_f
//   f_getmaxspeed_v
//   v_setmaxbackspeed_f
//   f_getmaxbackspeed_v
//   v_setcurveradius_f
//   f_getcurveradius_v
//   v_setcurveradiustime_f
//   f_getcurveradiustime_v
//   v_setskidspeed_f
//   f_getskidspeed_v
//   v_setmaxwalkableangle_f
//   f_getmaxwalkableangle_v

// Methods (24):
// 0x10044c8d  nmaennelwalk2::n_init_nmaennelwalk2  (15 insns)
//   strings: 'nengine2'
// 0x10044cb8  nmaennelwalk2::n_fini_nmaennelwalk2  (5 insns)
// 0x10044cca  nmaennelwalk2::n_new_nmaennelwalk2  (10 insns)
// 0x10044ce4  nmaennelwalk2::n_version_nmaennelwalk2  (19 insns)
//   consts:  f64=0.7853981853
// 0x10044d2c  nmaennelwalk2::vfunc_00  (13 insns)
// 0x10044d53  nmaennelwalk2::vfunc_16  (84 insns)
//   calls:   -> nContainer::GetDirection, -> nContainer::SetDirection, IAT: nkernel.dll!n_printf, -> nengine2::vfunc_16
// 0x10044e41  nmaennelwalk2::vfunc_17  (10 insns)
//   calls:   -> nengine2::vfunc_17
// 0x10044e5e  nmaennelwalk2::vfunc_42  (3 insns)
// 0x10044e6b  nmaennelwalk2::vfunc_43  (2 insns)
// 0x10044e72  nmaennelwalk2::vfunc_26  (9 insns)
// 0x10044ea3  nmaennelwalk2::vfunc_27  (4 insns)
// 0x10044eb2  nmaennelwalk2::vfunc_23  (106 insns)
//   calls:   -> nContainer::IsHandControl, -> nContainer::SetWantedDir
//   consts:  f32=0, f32=1, f32=0.25
//   strings: 'walk_forward', 'walk_back', 'turn_left', 'mouse_turn_left', 'turn_right', 'mouse_turn_right', 'move_forward'
// 0x10045003  nmaennelwalk2::vfunc_28  (47 insns)
//   strings: 'turn_left', 'turn_right', 'mouse_turn_left', 'mouse_turn_right'
// 0x10045091  nmaennelwalk2::vfunc_29  (4 insns)
// 0x100450a0  nmaennelwalk2::vfunc_31  (158 insns)
//   calls:   -> nContainer::GetDirection, -> nContainer::SetTurboMove
//   consts:  f32=0
//   strings: 'walk_forward', 'walk_back', 'turbowalk_forward', 'move_forward'
// 0x10045271  nmaennelwalk2::vfunc_32  (12 insns)
// 0x10045294  nmaennelwalk2::vfunc_18  (196 insns)
//   calls:   -> nContainer::IsHandControl, -> nconsumption::vfunc_37
//   strings: 'v_setmaxspeed_f', 'f_getmaxspeed_v', 'v_setmaxbackspeed_f', 'f_getmaxbackspeed_v', 'v_setcurveradius_f', 'f_getcurveradius_v', 'v_setcurveradiustime_f', 'f_getcurveradiustime_v'
// 0x100454f0  nmaennelwalk2::cmd_setmaxbackspeed (v_setmaxbackspeed_f)  (13 insns)
// 0x1004551b  nmaennelwalk2::cmd_getmaxbackspeed (f_getmaxbackspeed_v)  (14 insns)
// 0x1004556e  nmaennelwalk2::cmd_setmaxwalkableangle (v_setmaxwalkableangle_f)  (12 insns)
// 0x10045595  nmaennelwalk2::cmd_getmaxwalkableangle (f_getmaxwalkableangle_v)  (11 insns)
// 0x100455bf  nmaennelwalk2::cmd_setskidspeed (v_setskidspeed_f)  (10 insns)
// 0x100455e4  nmaennelwalk2::cmd_getskidspeed (f_getskidspeed_v)  (11 insns)
// 0x1004560e  nmaennelwalk2::vfunc_11  (153 insns)
//   calls:   -> nengine2::vfunc_11
//   consts:  f32=3.141593, f32=0.005555556

} // namespace re_nnomads
