#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nplacehouse.asm
// Class: nplacehouse : public nuseartefact  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct nplacehouse_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0014
    float field_0x0014;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint8_t field_0x0058;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x0140
    double field_0x0140;
    // +0x01bc
    uint32_t field_0x01bc;
    // +0x06b4
    float field_0x06b4;
    // +0x06b8
    float field_0x06b8;
    // +0x06bc
    float field_0x06bc;
    // +0x06c0
    uint8_t field_0x06c0;
};

// Script AddCmds (2):
//   v_setlockgrid_b
//   b_getlockgrid_v

// Methods (14):
// 0x10040f31  nplacehouse::vfunc_21  (11 insns)
//   strings: 'menu_select'
// 0x10040f55  nplacehouse::vfunc_22  (11 insns)
//   strings: 'menu_cancel'
// 0x10041171  nplacehouse::n_init_nplacehouse  (15 insns)
//   strings: 'nuseartefact'
// 0x1004119c  nplacehouse::n_fini_nplacehouse  (5 insns)
// 0x100411ae  nplacehouse::n_new_nplacehouse  (10 insns)
// 0x100411c5  nplacehouse::n_version_nplacehouse  (9 insns)
// 0x100411dd  nplacehouse::vfunc_00  (12 insns)
// 0x100411ff  nplacehouse::vfunc_16  (105 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nStateNode::GetClan, -> nContainer::GetPosition, -> nHouse::SetBuildState, -> nRealWorld::SetViewerCarrier, -> nRealWorld::SetHandControlVehicle, -> nplacespellaction::vfunc_16
// 0x10041335  nplacehouse::vfunc_17  (3 insns)
//   calls:   -> nplacespellaction::vfunc_17
// 0x10041341  nplacehouse::vfunc_19  (114 insns)
//   calls:   -> nRealWorld::GetUserClan, -> nContainer::GetMatrix44, -> nContainer::GetPosition, IAT: nkernel.dll!n_printf, -> nHouse::SetBuildState, -> nStateNode::GetClan, -> nuseartefact::vfunc_19
//   strings: '/world'
// 0x10041483  nplacehouse::vfunc_20  (66 insns)
//   calls:   -> nContainer::GetArtefactOwner, -> nHouse::SetBuildState, -> nuseartefact::vfunc_20
// 0x1004152e  nplacehouse::vfunc_23  (55 insns)
//   strings: 'move_forward', 'move_back', 'turn_right', 'turn_left', 'cycle'
// 0x100415d1  nplacehouse::vfunc_18  (169 insns)
//   calls:   -> nContainer::IsHandControl, -> nRealWorld::GetUserClan, -> nContainer::GetMatrix44, -> nContainer::GetPosition, -> nRealWorld::IsNetSession, IAT: nkernel.dll!n_printf, -> nRealWorld::GetGlobalTime, -> nplacespellaction::vfunc_18
//   consts:  f32=1, f32=0, f64=2
//   strings: 'v_setlockgrid_b', 'b_getlockgrid_v'
// 0x100417c1  nplacehouse::vfunc_11  (35 insns)
//   calls:   -> nbehaviour::vfunc_11

} // namespace re_nnomads
