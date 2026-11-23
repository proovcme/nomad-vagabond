#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nattack.asm
// Class: nattack : public nsquadronwatchtarget  (sizeof = 0x78 = 120 bytes)

#include <cstdint>

namespace re_nnomads {

struct nattack_Layout {
    // +0x0004
    float field_0x0004;
    // +0x000c
    uint32_t field_0x000c;
    // +0x000e
    uint8_t field_0x000e;
    // +0x0014
    float field_0x0014;
    // +0x0018
    uint8_t field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint8_t field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x006c
    uint8_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    float field_0x0074;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0140
    double field_0x0140;
    // +0x0b44
    float field_0x0b44;
    // +0x0b48
    float field_0x0b48;
    // +0x0b4c
    float field_0x0b4c;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x1139
    uint8_t field_0x1139;
};

// Script AddCmds (14):
//   v_setremoveartefacttarget_b
//   b_getremoveartefacttarget_v
//   v_setforgettargetdistance_f
//   f_getforgettargetdistance_v
//   v_setforgettargetangle_f
//   f_getforgettargetangle_v
//   v_setshotdist_f
//   f_getshotdist_v
//   v_setshotangle_f
//   f_getshotangle_v
//   v_setattackall_b
//   b_getattackall_v
//   v_setweaponradius_f
//   f_getweaponradius_v

// Methods (24):
// 0x10032005  nattack::vfunc_24  (3 insns)
// 0x1003200f  nattack::vfunc_25  (2 insns)
// 0x10034e38  nattack::vfunc_16  (12 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x10034e5d  nattack::vfunc_18  (54 insns)
//   calls:   -> nconsumption::vfunc_37
// 0x10034ed0  nattack::vfunc_20  (147 insns)
//   calls:   -> nContainer::IsHandControl, -> nStateNode::GetState, -> nContainer::GetPosition
//   strings: 'explode'
// 0x1003506a  nattack::vfunc_23  (4 insns)
// 0x10035079  nattack::vfunc_19  (70 insns)
//   strings: 'v_setremoveartefacttarget_b', 'b_getremoveartefacttarget_v'
// 0x10035235  nattack::vfunc_21  (224 insns)
//   calls:   -> nContainer::IsHandControl
//   strings: 'v_setforgettargetdistance_f', 'f_getforgettargetdistance_v', 'v_setforgettargetangle_f', 'f_getforgettargetangle_v'
// 0x10035661  nattack::n_init_nattack  (15 insns)
//   strings: 'nsquadronwatchtarget'
// 0x1003568c  nattack::n_fini_nattack  (5 insns)
// 0x1003569e  nattack::n_new_nattack  (10 insns)
// 0x100356b5  nattack::n_version_nattack  (16 insns)
// 0x100356e6  nattack::vfunc_00  (12 insns)
// 0x10035708  nattack::vfunc_17  (5 insns)
//   calls:   -> nStateNode::NetImport
// 0x1003571c  nattack::vfunc_22  (244 insns)
//   calls:   -> nContainer::IsHandControl, -> nRealWorld::IsEnemy, -> nStateNode::GetState, -> nContainer::IsVehicleClass, -> nContainer::GetPosition
//   consts:  f64=5
//   strings: 'explode', 'concret.technical.static.flak', 'generic', 'concret.technical', 'concret.nature.skrit', 'concret.weapon.volcanobomb', 'concret.technical.static.ambient', 'conret.technical.static.flak'
// 0x100359ec  nattack::vfunc_28  (84 insns)
//   calls:   -> nContainer::GetPosition
// 0x10035ac0  nattack::vfunc_29  (261 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::GetDirection
//   consts:  f32=1, f32=-1
//   strings: 'v_setshotdist_f', 'f_getshotdist_v', 'v_setshotangle_f', 'f_getshotangle_v', 'v_setattackall_b', 'b_getattackall_v', 'v_setweaponradius_f', 'f_getweaponradius_v'
// 0x10035dd5  nattack::cmd_setattackall (v_setattackall_b)  (10 insns)
// 0x10035df6  nattack::cmd_getattackall (b_getattackall_v)  (13 insns)
// 0x10035e46  nattack::vfunc_11  (102 insns)
//   calls:   -> nsquadronwatchtarget::vfunc_11
//   consts:  f32=180, f32=0.3183099
// 0x1004c3c4  nattack::vfunc_27  (2 insns)
// 0x100533c3  nattack::cmd_setshotangle (v_setshotangle_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x100533f1  nattack::cmd_getshotangle (f_getshotangle_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10055eb2  nattack::vfunc_26  (3 insns)

} // namespace re_nnomads
