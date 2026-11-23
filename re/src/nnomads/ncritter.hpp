#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncritter.asm
// Class: ncritter : public ncontainer  (sizeof = 0xec8 = 3784 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncritter_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0eb0
    uint8_t field_0x0eb0;
    // +0x0eb4
    float field_0x0eb4;
    // +0x0eb8
    uint32_t field_0x0eb8;
    // +0x0ebc
    float field_0x0ebc;
    // +0x0ec0
    uint32_t field_0x0ec0;
};

// Methods (7):
// 0x10066dfb  ncritter::n_init_ncritter  (15 insns)
//   strings: 'ncontainer'
// 0x10066e26  ncritter::n_fini_ncritter  (5 insns)
// 0x10066e38  ncritter::n_new_ncritter  (24 insns)
//   calls:   -> nContainer::nContainer()
// 0x10066e8a  ncritter::vfunc_00  (576 insns)
//   calls:   -> nContainer::~nContainer(), -> nContainer::GetMatrix44, -> nContainer::SetMatrix44, -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::GetCorrectRadius
//   consts:  f32=1, f32=0.9, f32=0.24, f32=-1, f64=0.95, f32=0, f64=0.9, f32=3.899898, f32=100, f32=0.3, f32=2
// 0x10067590  ncritter::cmd_islanded (b_islanded_v)  (14 insns)
// 0x100675be  ncritter::cmd_setlanded (v_setlanded_b)  (12 insns)
// 0x100675e5  ncritter::vfunc_11  (61 insns)
//   calls:   -> nContainer::SaveCmds

} // namespace re_nnomads
