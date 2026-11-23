#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsimpleengine2.asm
// Class: nsimpleengine2 : public nengine2  (sizeof = 0xa4 = 164 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsimpleengine2_Layout {
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
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x0070
    float field_0x0070;
    // +0x0074
    float field_0x0074;
    // +0x007c
    float field_0x007c;
    // +0x0084
    float field_0x0084;
    // +0x0b44
    float field_0x0b44;
    // +0x0b48
    float field_0x0b48;
    // +0x0b4c
    float field_0x0b4c;
    // +0x0b5c
    float field_0x0b5c;
    // +0x0b60
    float field_0x0b60;
    // +0x0b64
    float field_0x0b64;
    // +0x0b6c
    float field_0x0b6c;
    // +0x0b78
    float field_0x0b78;
    // +0x0b88
    float field_0x0b88;
    // +0x0c80
    float field_0x0c80;
    // +0x0c90
    float field_0x0c90;
};

// Script AddCmds (12):
//   v_setmaxspeed_f
//   f_getmaxspeed_v
//   v_setmaxspeedtime_f
//   f_getmaxspeedtime_v
//   v_setmaxrise_f
//   f_getmaxrise_v
//   v_setmaxrisetime_f
//   f_getmaxrisetime_v
//   v_setradius_f
//   f_getradius_v
//   v_setradiustime_f
//   f_getradiustime_v

// Methods (11):
// 0x10044126  nsimpleengine2::n_init_nsimpleengine2  (15 insns)
//   strings: 'nengine2'
// 0x10044151  nsimpleengine2::n_fini_nsimpleengine2  (5 insns)
// 0x10044163  nsimpleengine2::n_new_nsimpleengine2  (10 insns)
// 0x1004417d  nsimpleengine2::n_version_nsimpleengine2  (9 insns)
// 0x10044195  nsimpleengine2::vfunc_00  (12 insns)
// 0x100441b7  nsimpleengine2::vfunc_26  (9 insns)
// 0x100441e8  nsimpleengine2::vfunc_28  (63 insns)
//   consts:  f32=-1
//   strings: 'turn_left', 'turn_right'
// 0x10044292  nsimpleengine2::vfunc_29  (215 insns)
//   calls:   -> nContainer::GetActualCommand, -> nContainer::GetPosition
//   consts:  f32=-1, f32=1, f32=0
// 0x100444da  nsimpleengine2::vfunc_31  (174 insns)
//   calls:   -> nContainer::GetDirection
//   consts:  f32=-1
//   strings: 'move_forward', 'move_up', 'move_down'
// 0x100446b0  nsimpleengine2::vfunc_32  (353 insns)
//   calls:   -> nContainer::GetActualCommand, -> nContainer::GetPosition, -> nContainer::GetDirection
//   consts:  f32=1, f32=-1, f64=0, f32=0
//   strings: 'v_setmaxspeed_f', 'f_getmaxspeed_v', 'v_setmaxspeedtime_f', 'f_getmaxspeedtime_v', 'v_setmaxrise_f', 'f_getmaxrise_v', 'v_setmaxrisetime_f', 'f_getmaxrisetime_v'
// 0x10044b16  nsimpleengine2::vfunc_11  (140 insns)
//   calls:   -> nengine2::vfunc_11

} // namespace re_nnomads
