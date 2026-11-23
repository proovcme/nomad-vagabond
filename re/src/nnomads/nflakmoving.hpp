#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nflakmoving.asm
// Class: nflakmoving : public nmoving  (sizeof = 0x60 = 96 bytes)

#include <cstdint>

namespace re_nnomads {

struct nflakmoving_Layout {
    // +0x001c
    float field_0x001c;
    // +0x0058
    uint8_t field_0x0058;
    // +0x0059
    uint8_t field_0x0059;
    // +0x005c
    uint32_t field_0x005c;
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
};

// Methods (10):
// 0x100384fe  nflakmoving::vfunc_16  (24 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
//   strings: 'nvehicle'
// 0x10038546  nflakmoving::vfunc_17  (6 insns)
//   calls:   -> nStateNode::NetImport
// 0x10038561  nflakmoving::vfunc_19  (52 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::SetPosition
//   consts:  f32=1e-06
// 0x100389fc  nflakmoving::vfunc_00  (12 insns)
// 0x10038a1e  nflakmoving::vfunc_20  (190 insns)
//   calls:   -> nContainer::GetDirection, -> nContainer::CalcStabilityAxis, -> nContainer::SetDirection
//   consts:  f64=0
// 0x10038c24  nflakmoving::n_init_nflakmoving  (10 insns)
//   strings: 'nmoving'
// 0x10038c45  nflakmoving::n_fini_nflakmoving  (5 insns)
// 0x10038c57  nflakmoving::n_new_nflakmoving  (10 insns)
// 0x10038c6e  nflakmoving::n_version_nflakmoving  (2 insns)
// 0x10038c74  nflakmoving::vfunc_11  (10 insns)
//   calls:   -> nmoving::vfunc_11

} // namespace re_nnomads
