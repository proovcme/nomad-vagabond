#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nflakengine2.asm
// Class: nflakengine2 : public nengine2  (sizeof = 0xb8 = 184 bytes)

#include <cstdint>

namespace re_nnomads {

struct nflakengine2_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0018
    double field_0x0018;
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
    // +0x0084
    float field_0x0084;
    // +0x0088
    float field_0x0088;
    // +0x008c
    float field_0x008c;
    // +0x0094
    float field_0x0094;
    // +0x00a4
    float field_0x00a4;
    // +0x00a8
    float field_0x00a8;
    // +0x00ac
    float field_0x00ac;
    // +0x00b0
    float field_0x00b0;
    // +0x00b4
    uint8_t field_0x00b4;
    // +0x0b74
    float field_0x0b74;
    // +0x0b78
    float field_0x0b78;
    // +0x0b84
    float field_0x0b84;
    // +0x0b88
    uint32_t field_0x0b88;
    // +0x0c80
    float field_0x0c80;
    // +0x0c90
    float field_0x0c90;
    // +0x0cac
    float field_0x0cac;
    // +0x0cbc
    float field_0x0cbc;
};

// Script AddCmds (8):
//   v_setmaxhorirotation_f
//   f_getmaxhorirotation_v
//   v_sethorirotationtime_f
//   f_gethorirotationtime_v
//   v_setmaxvertrotation_f
//   f_getmaxvertrotation_v
//   v_setvertrotationtime_f
//   f_getvertrotationtime_v

// Methods (17):
// 0x1004942f  nflakengine2::n_init_nflakengine2  (15 insns)
//   strings: 'nengine2'
// 0x1004945a  nflakengine2::n_fini_nflakengine2  (5 insns)
// 0x1004946c  nflakengine2::n_new_nflakengine2  (10 insns)
// 0x10049486  nflakengine2::n_version_nflakengine2  (18 insns)
//   consts:  f32=3, f32=30, f32=0.5
// 0x100494d4  nflakengine2::vfunc_00  (12 insns)
// 0x100494f6  nflakengine2::vfunc_26  (10 insns)
// 0x10049531  nflakengine2::vfunc_21  (10 insns)
// 0x10049568  nflakengine2::vfunc_22  (3 insns)
//   calls:   -> nengine2::vfunc_22
// 0x10049574  nflakengine2::vfunc_28  (277 insns)
//   consts:  f32=0, f32=-0.0001, f32=0.0001
//   strings: 'turn_left', 'turn_right', 'move_up', 'move_down', 'mouse_turn_left', 'mouse_turn_right', 'mouse_move_up', 'mouse_move_down'
// 0x10049862  nflakengine2::vfunc_29  (281 insns)
//   calls:   -> nContainer::GetActualCommand, -> nContainer::GetPosition
//   consts:  f32=-1, f32=1, f32=0
// 0x10049b64  nflakengine2::vfunc_30  (169 insns)
//   calls:   -> nContainer::GetActualCommand
//   consts:  f64=0, f32=1, f32=-1, f32=1.570796
// 0x10049d38  nflakengine2::vfunc_31  (68 insns)
//   strings: 'v_setmaxhorirotation_f', 'f_getmaxhorirotation_v', 'v_sethorirotationtime_f', 'f_gethorirotationtime_v', 'v_setmaxvertrotation_f', 'f_getmaxvertrotation_v', 'v_setvertrotationtime_f', 'f_getvertrotationtime_v'
// 0x10049e23  nflakengine2::cmd_setmaxhorirotation (v_setmaxhorirotation_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x10049e54  nflakengine2::cmd_getmaxhorirotation (f_getmaxhorirotation_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10049e8a  nflakengine2::cmd_setmaxvertrotation (v_setmaxvertrotation_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x10049ebb  nflakengine2::cmd_getmaxvertrotation (f_getmaxvertrotation_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10049ef1  nflakengine2::vfunc_11  (104 insns)
//   calls:   -> nengine2::vfunc_11
//   consts:  f32=180, f32=0.3183099

} // namespace re_nnomads
