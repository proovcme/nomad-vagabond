#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nfreesteer.asm
// Class: nfreesteer : public nsteer  (sizeof = 0x74 = 116 bytes)

#include <cstdint>

namespace re_nnomads {

struct nfreesteer_Layout {
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
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    float field_0x0058;
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x006c
    float field_0x006c;
    // +0x0070
    float field_0x0070;
    // +0x0078
    uint32_t field_0x0078;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00bc
    uint8_t field_0x00bc;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00e8
    uint32_t field_0x00e8;
    // +0x02b6
    uint8_t field_0x02b6;
    // +0x0ddc
    uint8_t field_0x0ddc;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x1148
    float field_0x1148;
    // +0x114c
    float field_0x114c;
    // +0x1150
    float field_0x1150;
};

// Script AddCmds (26):
//   v_setmaxspeed_f
//   f_getmaxspeed_v
//   v_setmaxspeedtime_f
//   f_getmaxspeedtime_v
//   v_setmaxlift_f
//   f_getmaxlift_v
//   v_setmaxlifttime_f
//   f_getmaxlifttime_v
//   v_setmaxrotation_f
//   f_getmaxrotation_v
//   v_setmaxrotationtime_f
//   f_getmaxrotationtime_v
//   v_settoprotation_f
//   f_gettoprotation_v
//   m_steer/nfreesteer_main.cc
//   v_setmaxwatchdistance_f
//   f_getmaxwatchdistance_v
//   v_setmaxwatchangle_f
//   f_getmaxwatchangle_v
//   o_getwatched_v
//   v_setcursor_s
//   o_getcursor_v
//   v_sethaircross_s
//   o_gethaircross_v
//   v_sethaircrossowner_o
//   o_gethaircrossowner_v

// Methods (23):
// 0x10041a6d  nfreesteer::vfunc_19  (3 insns)
// 0x10041a77  nfreesteer::vfunc_20  (2 insns)
// 0x10055ebc  nfreesteer::vfunc_25  (3 insns)
// 0x10055ec6  nfreesteer::vfunc_26  (2 insns)
// 0x10055eca  nfreesteer::vfunc_27  (3 insns)
// 0x10055ed4  nfreesteer::vfunc_28  (2 insns)
// 0x10055ed8  nfreesteer::vfunc_29  (3 insns)
// 0x10055ee2  nfreesteer::vfunc_31  (3 insns)
// 0x10055f32  nfreesteer::vfunc_34  (136 insns)
//   calls:   -> nStateNode::GetPrototype, -> nContainer::GetMatrix44
//   consts:  f32=0.1
//   strings: 'visual/viewerpos'
// 0x100560bc  nfreesteer::vfunc_33  (89 insns)
//   calls:   -> nContainer::GetPosition
//   consts:  f32=0.5, f32=1, f32=-1, f32=0, f32=6.283185, f32=9.424778
// 0x100562af  nfreesteer::vfunc_18  (152 insns)
//   calls:   -> nContainer::IsHandControl, -> nconsumption::vfunc_37
//   strings: 'v_setmaxspeed_f', 'f_getmaxspeed_v', 'v_setmaxspeedtime_f', 'f_getmaxspeedtime_v', 'v_setmaxlift_f', 'f_getmaxlift_v', 'v_setmaxlifttime_f', 'f_getmaxlifttime_v'
// 0x10056f76  nfreesteer::n_init_nfreesteer  (15 insns)
//   calls:   -> nRealWorld::EndAliases
//   strings: 'nsteer'
// 0x10056fa1  nfreesteer::n_fini_nfreesteer  (5 insns)
// 0x10056fb3  nfreesteer::n_new_nfreesteer  (16 insns)
// 0x10056fd7  nfreesteer::vfunc_00  (12 insns)
// 0x10056ff9  nfreesteer::vfunc_16  (16 insns)
//   calls:   -> nsteer::vfunc_16
// 0x10057028  nfreesteer::vfunc_35  (15 insns)
// 0x10057050  nfreesteer::vfunc_38  (6 insns)
// 0x10057067  nfreesteer::vfunc_37  (56 insns)
//   calls:   -> nnavpointsteer::vfunc_37, -> nContainer::GetPosition
//   consts:  f32=2000, f64=0
// 0x100570f7  nfreesteer::vfunc_36  (184 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=0.1, f32=-1
//   strings: 'island_toggle', 'ON', 'OFF', 'turn_left', 'Wrong return (%d) value for IsWayFree()', 'Konjez', 'm_steer/nfreesteer_main.cc', 'turn_right'
// 0x1005732e  nfreesteer::vfunc_11  (3 insns)
//   calls:   -> nsteer::vfunc_11
// 0x1005bf62  nfreesteer::vfunc_30  (2 insns)
// 0x1005bf66  nfreesteer::vfunc_32  (1442 insns)
//   calls:   -> nRealWorld::GetViewer2, -> nRealWorld::GetViewerCarrier, -> nContainer::GetPosition, -> nContainer::GetMatrix44, -> nRealWorld::GetUserClan, -> nRoot::GetHead, -> nRealWorld::IsEnemy, -> nContainer::IsVehicleClass, -> nContainer::GetDirection
//   consts:  f32=15, f32=234.5, f32=0.1, f32=30, f32=1, f32=-1, f32=1000, f32=5000, f32=10000
//   strings: 'nmaennel', 'nvehicle', 'nmissile', 'concret.weapon.volcanobomb', 'concret.nature.skrit', 'concret.technical.dynamic.vehicle', 'concret.technical.dynamic.maennel', 'concret.technical.static.building'

} // namespace re_nnomads
