#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nstoresavepos.asm
// Class: nstoresavepos : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct nstoresavepos_Layout {
    // +0x0020
    uint32_t field_0x0020;
};

// Methods (6):
// 0x1006d2d9  nstoresavepos::n_init_nstoresavepos  (10 insns)
//   strings: 'nservice'
// 0x1006d2fa  nstoresavepos::n_fini_nstoresavepos  (5 insns)
// 0x1006d30c  nstoresavepos::n_new_nstoresavepos  (16 insns)
// 0x1006d330  nstoresavepos::vfunc_00  (51 insns)
//   calls:   -> nContainer::GetLocalMatrix44
// 0x1006d3ad  nstoresavepos::vfunc_16  (22 insns)
//   calls:   -> nRealWorld::GetGlobalTime, -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x1006d3e8  nstoresavepos::vfunc_18  (35 insns)
//   calls:   -> nconsumption::vfunc_37
//   consts:  f64=3

} // namespace re_nnomads
