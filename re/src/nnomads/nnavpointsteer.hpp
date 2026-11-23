#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nnavpointsteer.asm
// Class: nnavpointsteer : public nsteer  (sizeof = 0x74 = 116 bytes)

#include <cstdint>

namespace re_nnomads {

struct nnavpointsteer_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0070
    float field_0x0070;
};

// Methods (11):
// 0x100561f1  nnavpointsteer::vfunc_37  (72 insns)
//   calls:   -> nStateNode::GetServiceData, -> nContainer::GetPosition
//   consts:  f64=0
// 0x100568c3  nnavpointsteer::n_init_nnavpointsteer  (15 insns)
//   strings: 'nsteer'
// 0x100568ee  nnavpointsteer::n_fini_nnavpointsteer  (5 insns)
// 0x10056900  nnavpointsteer::n_new_nnavpointsteer  (16 insns)
// 0x10056924  nnavpointsteer::vfunc_00  (12 insns)
// 0x10056946  nnavpointsteer::vfunc_16  (14 insns)
//   calls:   -> nsteer::vfunc_16
// 0x1005696f  nnavpointsteer::vfunc_35  (143 insns)
//   calls:   -> nContainer::GetPosition
//   consts:  f32=0.1, f32=1, f32=-1, f32=0
// 0x10056af7  nnavpointsteer::vfunc_39  (179 insns)
//   calls:   -> nContainer::GetPosition, -> nRealWorld::GetViewerMatrix, -> nRoot::GetHead, -> nRealWorld::IsNetSession
//   strings: 'nnavpoint'
// 0x10056cfc  nnavpointsteer::vfunc_38  (54 insns)
//   calls:   -> nContainer::GetPosition
// 0x10056d82  nnavpointsteer::vfunc_36  (165 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'island_toggle', 'ON', 'OFF', 'searchisland_left', 'searchisland_right', 'cycle'
// 0x10056f5e  nnavpointsteer::vfunc_11  (10 insns)
//   calls:   -> nsteer::vfunc_11

} // namespace re_nnomads
