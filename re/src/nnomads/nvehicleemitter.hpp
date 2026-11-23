#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nvehicleemitter.asm
// Class: nvehicleemitter : public nservice  (sizeof = 0x88 = 136 bytes)

#include <cstdint>

namespace re_nnomads {

struct nvehicleemitter_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint8_t field_0x0058;
    // +0x0059
    uint8_t field_0x0059;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0068
    double field_0x0068;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    float field_0x007c;
    // +0x0080
    float field_0x0080;
    // +0x0084
    float field_0x0084;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0ea0
    uint8_t field_0x0ea0;
    // +0x0ea4
    uint32_t field_0x0ea4;
    // +0x0ea8
    double field_0x0ea8;
};

// Script AddCmds (9):
//   v_addvehicle_sf
//   v_setloop_b
//   v_setrandomoffset_b
//   v_setemittingspeed_f
//   f_getemittingspeed_v
//   v_setspreadangle_f
//   f_getspreadangle_v
//   v_setyoffset_f
//   f_getyoffset_v

// Methods (12):
// 0x10037ada  nvehicleemitter::n_init_nvehicleemitter  (15 insns)
//   strings: 'nservice'
// 0x10037b05  nvehicleemitter::n_fini_nvehicleemitter  (5 insns)
// 0x10037b17  nvehicleemitter::n_new_nvehicleemitter  (10 insns)
// 0x10037b31  nvehicleemitter::n_version_nvehicleemitter  (47 insns)
//   calls:   IAT: MSVCRT.dll!time, IAT: MSVCRT.dll!srand
// 0x10037bbe  nvehicleemitter::vfunc_00  (45 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10037c29  nvehicleemitter::vfunc_18  (76 insns)
//   calls:   IAT: MSVCRT.dll!floor, -> nconsumption::vfunc_37
//   consts:  f64=0
// 0x10037ce3  nvehicleemitter::vfunc_19  (23 insns)
//   calls:   IAT: nkernel.dll!n_strdup
// 0x10037d23  nvehicleemitter::vfunc_20  (201 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::GetPosition, IAT: MSVCRT.dll!rand, -> nContainer::GetDirection, -> nContainer::SetDirection, -> nContainer::SetPosition
//   consts:  f32=0.1, f32=0, f32=0.01745329, f32=0.002777778, f32=0.99, f32=-0.99
//   strings: 'normal'
// 0x10037f43  nvehicleemitter::vfunc_21  (47 insns)
// 0x10037fb3  nvehicleemitter::vfunc_22  (225 insns)
//   calls:   -> nStateNode::GetClan, -> nRoot::GetHead, IAT: MSVCRT.dll!_assert
//   consts:  f64=1e-07
//   strings: 'c:/nomads/code/inc\\mathlib/matrix.h', 'x.len() > TINY', 'y.len() > TINY', 'v_addvehicle_sf', 'v_setloop_b', 'v_setrandomoffset_b', 'v_setemittingspeed_f', 'f_getemittingspeed_v'
// 0x10038252  nvehicleemitter::cmd_addvehicle (v_addvehicle_sf)  (26 insns)
// 0x100382e6  nvehicleemitter::vfunc_11  (169 insns)
//   calls:   -> ncollidedata::vfunc_11
//   consts:  f32=180, f32=0.3183099

} // namespace re_nnomads
