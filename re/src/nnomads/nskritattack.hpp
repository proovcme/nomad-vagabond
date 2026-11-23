#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nskritattack.asm
// Class: nskritattack : public nservice  (sizeof = 0x8c = 140 bytes)

#include <cstdint>

namespace re_nnomads {

struct nskritattack_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    float field_0x0058;
    // +0x007c
    float field_0x007c;
    // +0x0080
    float field_0x0080;
    // +0x0084
    float field_0x0084;
    // +0x0088
    float field_0x0088;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0d9c
    uint32_t field_0x0d9c;
    // +0x0eb0
    uint8_t field_0x0eb0;
    // +0x128c
    uint32_t field_0x128c;
};

// Script AddCmds (12):
//   v_setinnerdist_f
//   v_setinnerangle_f
//   v_setouterdist_f
//   v_setouterangle_f
//   f_getinnerdist_v
//   f_getinnerangle_v
//   f_getouterdist_v
//   f_getouterangle_v
//   v_setdamage_f
//   f_getdamage_v
//   v_setdamagetype_s
//   s_getdamagetype_v

// Methods (13):
// 0x1006103e  nskritattack::n_init_nskritattack  (15 insns)
//   strings: 'nservice'
// 0x10061069  nskritattack::n_fini_nskritattack  (5 insns)
// 0x1006107b  nskritattack::n_new_nskritattack  (42 insns)
//   strings: 'fire'
// 0x100610fa  nskritattack::vfunc_00  (12 insns)
// 0x1006111c  nskritattack::vfunc_16  (16 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x10061149  nskritattack::vfunc_18  (202 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::ReduceEnergy, -> nContainer::SendEnergyUpdate
//   strings: 'v_setinnerdist_f', 'v_setinnerangle_f', 'v_setouterdist_f', 'v_setouterangle_f', 'f_getinnerdist_v', 'f_getinnerangle_v', 'f_getouterdist_v', 'f_getouterangle_v'
// 0x100613cb  nskritattack::cmd_setdamagetype (v_setdamagetype_s)  (14 insns)
//   calls:   IAT: MSVCRT.dll!strncpy
// 0x100613f8  nskritattack::cmd_setinnerangle (v_setinnerangle_f)  (16 insns)
// 0x10061429  nskritattack::cmd_setouterangle (v_setouterangle_f)  (16 insns)
// 0x1006145a  nskritattack::cmd_getdamagetype (s_getdamagetype_v)  (11 insns)
// 0x1006147e  nskritattack::cmd_getinnerangle (f_getinnerangle_v)  (16 insns)
// 0x100614b3  nskritattack::cmd_getouterangle (f_getouterangle_v)  (16 insns)
// 0x100614e8  nskritattack::vfunc_11  (173 insns)
//   calls:   -> ncollidedata::vfunc_11
//   consts:  f32=0.5, f32=3.141593, f32=0.005555556, f32=1, f32=-1, f32=180, f32=0.3183099

} // namespace re_nnomads
