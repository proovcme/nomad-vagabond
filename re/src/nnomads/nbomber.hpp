#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nbomber.asm
// Class: nbomber : public nvehicle  (sizeof = 0x1268 = 4712 bytes)

#include <cstdint>

namespace re_nnomads {

struct nbomber_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    double field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
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
    // +0x0218
    uint32_t field_0x0218;
    // +0x0494
    float field_0x0494;
    // +0x0498
    float field_0x0498;
    // +0x049c
    float field_0x049c;
    // +0x04a0
    uint8_t field_0x04a0;
    // +0x04f4
    float field_0x04f4;
    // +0x04f8
    float field_0x04f8;
    // +0x04fc
    float field_0x04fc;
    // +0x0500
    uint8_t field_0x0500;
    // +0x0664
    float field_0x0664;
    // +0x0668
    float field_0x0668;
    // +0x066c
    float field_0x066c;
    // +0x0670
    uint8_t field_0x0670;
    // +0x06c4
    float field_0x06c4;
    // +0x06c8
    float field_0x06c8;
    // +0x06cc
    float field_0x06cc;
    // +0x06d0
    uint8_t field_0x06d0;
    // +0x0b5c
    float field_0x0b5c;
    // +0x0e08
    uint8_t field_0x0e08;
    // +0x0e2c
    uint32_t field_0x0e2c;
    // +0x0f2c
    uint32_t field_0x0f2c;
    // +0x1140
    double field_0x1140;
    // +0x115c
    uint32_t field_0x115c;
    // +0x119c
    uint8_t field_0x119c;
    // +0x11a8
    double field_0x11a8;
    // +0x11b8
    uint8_t field_0x11b8;
    // +0x11ba
    uint8_t field_0x11ba;
    // +0x11bb
    uint8_t field_0x11bb;
    // +0x11bc
    uint8_t field_0x11bc;
    // +0x11cc
    uint32_t field_0x11cc;
    // +0x11e4
    uint32_t field_0x11e4;
    // +0x11ec
    uint32_t field_0x11ec;
    // +0x11f0
    uint32_t field_0x11f0;
    // +0x11f4
    float field_0x11f4;
    // +0x1218
    uint32_t field_0x1218;
    // +0x1258
    float field_0x1258;
    // +0x125c
    float field_0x125c;
    // +0x1260
    float field_0x1260;
};

// Script AddCmds (1):
//   v_setrelpos_fff

// Methods (13):
// 0x10023f70  nbomber::vfunc_60  (62 insns)
//   calls:   -> nContainer::GetCollVehicle, -> nContainer::CrashAllowed
//   consts:  f32=50
// 0x10024000  nbomber::vfunc_15  (42 insns)
//   calls:   -> nHouse::Trigger, -> nContainer::GetPosition, -> nContainer::SetPosition
// 0x10024067  nbomber::vfunc_53  (5 insns)
//   calls:   -> nContainer::GetCustomDataSize
// 0x10024075  nbomber::vfunc_54  (12 insns)
//   calls:   -> nContainer::WriteCustomData
// 0x1002409b  nbomber::vfunc_55  (45 insns)
//   calls:   -> nContainer::ReadCustomData, IAT: nkernel.dll!n_free
// 0x10024f0d  nbomber::vfunc_18  (89 insns)
//   calls:   -> nautonom::vfunc_18
//   consts:  f32=1, f32=0
// 0x1002502c  nbomber::vfunc_63  (1506 insns)
//   calls:   -> nContainer::GetMatrix44, -> nContainer::DrawCross, -> nContainer::DrawLine, -> nContainer::GetPosition, -> nautonom::vfunc_63, -> nStateNode::GetState, -> nContainer::GetVehicleClass, IAT: MSVCRT.dll!strchr, -> nContainer::IsVehicleClass, -> nStateNode::GetClan, -> nRoot::GetHead, IAT: nkernel.dll!n_printf
//   consts:  f64=0
//   strings: 'explode', 'distancedeath', 'entergarage', 'sleep', 'offline', 'nvehicle', 'concret.technical.dynamic.vehicle.'
// 0x1006c119  nbomber::n_init_nbomber  (15 insns)
//   strings: 'nvehicle'
// 0x1006c144  nbomber::n_fini_nbomber  (5 insns)
// 0x1006c156  nbomber::n_new_nbomber  (24 insns)
// 0x1006c196  nbomber::vfunc_00  (363 insns)
//   calls:   -> nContainer::GetPosition
//   consts:  f64=0, f32=0, f32=0.02, f32=1, f32=-1
//   strings: 'v_setrelpos_fff', 'fff_getrelpos_v'
// 0x1006c58f  nbomber::cmd_setrelpos (v_setrelpos_fff)  (54 insns)
// 0x1006c63d  nbomber::vfunc_11  (54 insns)

} // namespace re_nnomads
