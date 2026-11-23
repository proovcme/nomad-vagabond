#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nexplosion.asm
// Class: nexplosion : public nenergyeffect  (sizeof = 0xd4 = 212 bytes)

#include <cstdint>

namespace re_nnomads {

struct nexplosion_Layout {
    // +0x0004
    float field_0x0004;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0060
    float field_0x0060;
    // +0x0068
    uint8_t field_0x0068;
    // +0x0088
    uint32_t field_0x0088;
    // +0x0094
    uint8_t field_0x0094;
    // +0x00b4
    uint8_t field_0x00b4;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0df4
    float field_0x0df4;
    // +0x0df8
    float field_0x0df8;
};

// Script AddCmds (7):
//   v_setdamagetype_s
//   s_getdamagetype_v
//   v_setbasedebris_s
//   s_getbasedebris_v
//   v_setenergyclot_s
//   s_getenergyclot_v
//   v_adddebris_sfffffff

// Methods (19):
// 0x1004d435  nexplosion::n_init_nexplosion  (15 insns)
//   strings: 'nenergyeffect'
// 0x1004d460  nexplosion::n_fini_nexplosion  (5 insns)
// 0x1004d472  nexplosion::n_new_nexplosion  (10 insns)
// 0x1004d48c  nexplosion::n_version_nexplosion  (18 insns)
// 0x1004d4c5  nexplosion::vfunc_00  (38 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1004d522  nexplosion::vfunc_16  (93 insns)
//   calls:   -> nenergyeffect::vfunc_16
// 0x1004d5fd  nexplosion::vfunc_24  (51 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1004d673  nexplosion::vfunc_25  (217 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::GetDirection, -> nStateNode::GetClan, -> nStateNode::GetPrototype, -> nContainer::SetCurrentVisNode, -> nContainer::SetPosition, -> nContainer::SetDirection, -> nContainer::SetDrall
//   consts:  f64=1e-07
// 0x1004d8f6  nexplosion::vfunc_19  (32 insns)
//   calls:   -> nContainer::IsHandControl, -> nContainer::IsVehicleClass, -> nRealWorld::IsFriend
//   strings: 'concret.technical.dynamic.vehicle'
// 0x1004d94a  nexplosion::vfunc_21  (58 insns)
//   calls:   -> nContainer::ReduceEnergy, -> nContainer::SendEnergyUpdate, -> nContainer::GetArmor
// 0x1004d9d7  nexplosion::vfunc_26  (105 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::GetPosition, -> nContainer::SetPosition
//   consts:  f32=0.1
//   strings: 'v_setdamagetype_s', 's_getdamagetype_v', 'v_setbasedebris_s', 's_getbasedebris_v', 'v_setenergyclot_s', 's_getenergyclot_v', 'v_adddebris_sfffffff'
// 0x1004db30  nexplosion::cmd_setdamagetype (v_setdamagetype_s)  (10 insns)
// 0x1004db53  nexplosion::cmd_getdamagetype (s_getdamagetype_v)  (14 insns)
// 0x1004db7d  nexplosion::cmd_setbasedebris (v_setbasedebris_s)  (10 insns)
// 0x1004dba0  nexplosion::cmd_getbasedebris (s_getbasedebris_v)  (14 insns)
// 0x1004dbca  nexplosion::cmd_setenergyclot (v_setenergyclot_s)  (10 insns)
// 0x1004dbed  nexplosion::cmd_getenergyclot (s_getenergyclot_v)  (14 insns)
// 0x1004dc17  nexplosion::cmd_adddebris (v_adddebris_sfffffff)  (72 insns)
//   consts:  f32=0.005555556, f32=3.141593
// 0x1004dce5  nexplosion::vfunc_11  (203 insns)
//   calls:   -> nenergyeffect::vfunc_11
//   consts:  f32=0.3183099, f32=180

} // namespace re_nnomads
