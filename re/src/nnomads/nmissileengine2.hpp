#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmissileengine2.asm
// Class: nmissileengine2 : public nengine2  (sizeof = 0xa4 = 164 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmissileengine2_Layout {
    // +0x0004
    float field_0x0004;
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
    // +0x003c
    float field_0x003c;
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x006c
    float field_0x006c;
    // +0x0080
    float field_0x0080;
    // +0x0088
    float field_0x0088;
    // +0x0b44
    float field_0x0b44;
    // +0x0b48
    float field_0x0b48;
    // +0x0b4c
    float field_0x0b4c;
    // +0x0b5c
    float field_0x0b5c;
    // +0x0b64
    float field_0x0b64;
    // +0x0b68
    float field_0x0b68;
    // +0x0b74
    float field_0x0b74;
    // +0x0b78
    uint32_t field_0x0b78;
    // +0x0b84
    float field_0x0b84;
    // +0x0b88
    float field_0x0b88;
    // +0x0c80
    float field_0x0c80;
    // +0x0c90
    uint32_t field_0x0c90;
    // +0x0cac
    float field_0x0cac;
    // +0x0cbc
    float field_0x0cbc;
};

// Script AddCmds (10):
//   v_setmaxspeed_f
//   f_getmaxspeed_v
//   v_setmaxspeedtime_f
//   f_getmaxspeedtime_v
//   v_setstoptime_f
//   f_getstoptime_v
//   v_setturnradius_f
//   f_getturnradius_v
//   v_setturnradiustime_f
//   f_getturnradiustime_v

// Methods (13):
// 0x1004a019  nmissileengine2::n_init_nmissileengine2  (15 insns)
//   strings: 'nengine2'
// 0x1004a044  nmissileengine2::n_fini_nmissileengine2  (5 insns)
// 0x1004a056  nmissileengine2::n_new_nmissileengine2  (10 insns)
// 0x1004a070  nmissileengine2::n_version_nmissileengine2  (9 insns)
// 0x1004a088  nmissileengine2::vfunc_00  (12 insns)
// 0x1004a0aa  nmissileengine2::vfunc_28  (234 insns)
//   consts:  f32=-1
//   strings: 'turn_left', 'turboturn_left', 'turn_right', 'turboturn_right', 'move_up', 'turbomove_up', 'move_down', 'turbomove_down'
// 0x1004a31e  nmissileengine2::vfunc_29  (284 insns)
//   calls:   -> nContainer::GetActualCommand, -> nContainer::GetPosition
//   consts:  f32=-1, f32=1, f32=0
// 0x1004a62d  nmissileengine2::vfunc_30  (169 insns)
//   calls:   -> nContainer::GetActualCommand
//   consts:  f64=0, f32=1, f32=-1, f32=1.570796
// 0x1004a801  nmissileengine2::vfunc_31  (233 insns)
//   consts:  f32=-1, f64=0
//   strings: 'move_forward'
// 0x1004aa61  nmissileengine2::vfunc_32  (328 insns)
//   calls:   -> nContainer::GetActualCommand, -> nContainer::GetPosition
//   consts:  f64=0, f32=-1, f32=0
//   strings: 'v_setmaxspeed_f', 'f_getmaxspeed_v', 'v_setmaxspeedtime_f', 'f_getmaxspeedtime_v', 'v_setstoptime_f', 'f_getstoptime_v', 'v_setturnradius_f', 'f_getturnradius_v'
// 0x1004ae3c  nmissileengine2::cmd_setturnradius (v_setturnradius_f)  (12 insns)
// 0x1004ae90  nmissileengine2::cmd_setturnradiustime (v_setturnradiustime_f)  (12 insns)
// 0x1004aee7  nmissileengine2::vfunc_11  (120 insns)
//   calls:   -> nengine2::vfunc_11

} // namespace re_nnomads
