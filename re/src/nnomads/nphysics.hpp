#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nphysics.asm
// Class: nphysics : public nservice  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct nphysics_Layout {
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
    // +0x0058
    uint8_t field_0x0058;
    // +0x0059
    uint8_t field_0x0059;
    // +0x005a
    uint8_t field_0x005a;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0b42
    uint8_t field_0x0b42;
    // +0x0b43
    uint8_t field_0x0b43;
    // +0x0b44
    float field_0x0b44;
    // +0x0b48
    float field_0x0b48;
    // +0x0b4c
    float field_0x0b4c;
    // +0x0b94
    uint8_t field_0x0b94;
    // +0x0b96
    uint32_t field_0x0b96;
    // +0x0bb4
    float field_0x0bb4;
    // +0x0bc0
    uint8_t field_0x0bc0;
    // +0x0bc2
    uint32_t field_0x0bc2;
    // +0x0be0
    float field_0x0be0;
    // +0x0d5c
    uint32_t field_0x0d5c;
    // +0x0d64
    uint32_t field_0x0d64;
    // +0x0d88
    uint32_t field_0x0d88;
    // +0x0d9c
    float field_0x0d9c;
};

// Script AddCmds (6):
//   v_setignorestability_b
//   b_getignorestability_v
//   v_setignorebuoyancy_b
//   b_getignorebuoyancy_v
//   v_setignoreforces_b
//   b_getignoreforces_v

// Methods (13):
// 0x100364c6  nphysics::vfunc_00  (12 insns)
// 0x100364e8  nphysics::vfunc_16  (12 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x1003650a  nphysics::vfunc_19  (37 insns)
// 0x10036557  nphysics::vfunc_20  (263 insns)
//   calls:   -> nContainer::CalcCommonAirConst, -> nContainer::SetSpeed, -> nContainer::SetAccel
//   consts:  f64=0, f32=-1
// 0x1003682f  nphysics::vfunc_21  (417 insns)
//   calls:   -> nContainer::CalcCommonRotAirConst, -> nContainer::GetStabilityForce, -> nContainer::CalcStabilityAxis
//   consts:  f64=0, f32=-1, f32=0
// 0x10036c84  nphysics::vfunc_18  (130 insns)
//   calls:   -> nContainer::GetPosition, -> nconsumption::vfunc_37
// 0x10036dc2  nphysics::n_init_nphysics  (15 insns)
//   strings: 'nservice'
// 0x10036ded  nphysics::n_fini_nphysics  (5 insns)
// 0x10036dff  nphysics::n_new_nphysics  (10 insns)
// 0x10036e16  nphysics::n_version_nphysics  (40 insns)
//   strings: 'v_setignorestability_b', 'b_getignorestability_v', 'v_setignorebuoyancy_b', 'b_getignorebuoyancy_v', 'v_setignoreforces_b', 'b_getignoreforces_v'
// 0x10036f28  nphysics::cmd_setignoreforces (v_setignoreforces_b)  (10 insns)
// 0x10036f49  nphysics::cmd_getignoreforces (b_getignoreforces_v)  (13 insns)
// 0x10036f72  nphysics::vfunc_11  (82 insns)
//   calls:   -> ncollidedata::vfunc_11

} // namespace re_nnomads
