#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nbehaviour.asm
// Class: nbehaviour : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct nbehaviour_Layout {
    // (no direct [this+offset] fields detected)
};

// Methods (8):
// 0x10034b32  nbehaviour::n_init_nbehaviour  (15 insns)
//   strings: 'nservice'
// 0x10034b5d  nbehaviour::n_fini_nbehaviour  (5 insns)
// 0x10034b6f  nbehaviour::n_new_nbehaviour  (10 insns)
// 0x10034b86  nbehaviour::n_version_nbehaviour  (9 insns)
// 0x10034b9e  nbehaviour::vfunc_00  (14 insns)
// 0x10034bcb  nbehaviour::vfunc_18  (3 insns)
//   calls:   -> nconsumption::vfunc_37
// 0x10034bd7  nbehaviour::vfunc_11  (10 insns)
//   calls:   -> ncollidedata::vfunc_11
// 0x10034c82  nbehaviour::vfunc_16  (12 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord

} // namespace re_nnomads
