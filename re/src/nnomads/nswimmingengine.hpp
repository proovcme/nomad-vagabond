#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nswimmingengine.asm
// Class: nswimmingengine : public nengine3  (sizeof = 0x80 = 128 bytes)

#include <cstdint>

namespace re_nnomads {

struct nswimmingengine_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x0044
    uint8_t field_0x0044;
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
    uint8_t field_0x007c;
    // +0x0b44
    uint32_t field_0x0b44;
    // +0x0b48
    float field_0x0b48;
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

// Script AddCmds (12):
//   v_setfallspeed_f
//   f_getfallspeed_v
//   v_setfallspeedtime_f
//   f_getfallspeedtime_v
//   v_setupliftspeed_f
//   f_getupliftspeed_v
//   v_setmaxyawrotation_f
//   f_getmaxyawrotation_v
//   v_setyawacceltime_f
//   f_getyawacceltime_v
//   v_setbraketime_f
//   f_getbraketime_v

// Methods (10):
// 0x10052d2b  nswimmingengine::n_init_nswimmingengine  (15 insns)
//   strings: 'nengine3'
// 0x10052d56  nswimmingengine::n_fini_nswimmingengine  (5 insns)
// 0x10052d68  nswimmingengine::n_new_nswimmingengine  (30 insns)
//   consts:  f32=2
// 0x10052dbf  nswimmingengine::vfunc_00  (12 insns)
// 0x10052de1  nswimmingengine::vfunc_16  (89 insns)
//   calls:   -> ncritterengine2::vfunc_16
//   consts:  f32=0
// 0x10052ee2  nswimmingengine::vfunc_19  (119 insns)
//   consts:  f32=0, f32=-1
//   strings: 'move_forward'
// 0x10053036  nswimmingengine::vfunc_20  (306 insns)
//   calls:   -> nContainer::GetDirection, -> nContainer::SetDirection
//   consts:  f64=1e-07, f32=1, f32=-1, f32=0.01, f32=0
//   strings: 'turn_left', 'turn_right', 'mouse_turn_left', 'mouse_turn_right', 'v_setfallspeed_f', 'f_getfallspeed_v', 'v_setfallspeedtime_f', 'f_getfallspeedtime_v'
// 0x10053424  nswimmingengine::cmd_setmaxyawrotation (v_setmaxyawrotation_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x10053452  nswimmingengine::cmd_getmaxyawrotation (f_getmaxyawrotation_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x100534ac  nswimmingengine::vfunc_11  (132 insns)
//   calls:   -> ncharcinematicplayer::vfunc_11
//   consts:  f32=180, f32=0.3183099

} // namespace re_nnomads
