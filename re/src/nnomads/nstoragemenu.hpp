#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nstoragemenu.asm
// Class: nstoragemenu : public nmenu  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct nstoragemenu_Layout {
    // +0x0044
    uint8_t field_0x0044;
    // +0x02b6
    uint8_t field_0x02b6;
    // +0x129c
    uint32_t field_0x129c;
};

// Methods (15):
// 0x1003daac  nstoragemenu::vfunc_11  (3 insns)
//   calls:   -> nSoundNode::vfunc_32
// 0x1003dab8  nstoragemenu::n_init_nstoragemenu  (15 insns)
//   calls:   -> nRealWorld::EndAliases
//   strings: 'nmenu'
// 0x1003dae3  nstoragemenu::n_fini_nstoragemenu  (5 insns)
// 0x1003daf5  nstoragemenu::n_new_nstoragemenu  (10 insns)
// 0x1003db0c  nstoragemenu::n_version_nstoragemenu  (9 insns)
// 0x1003db24  nstoragemenu::vfunc_00  (12 insns)
// 0x1003db46  nstoragemenu::vfunc_16  (26 insns)
//   calls:   -> nSoundNode::vfunc_37
// 0x1003db87  nstoragemenu::vfunc_22  (24 insns)
// 0x1003dbc9  nstoragemenu::vfunc_23  (41 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1003dc2e  nstoragemenu::vfunc_24  (81 insns)
// 0x1003dd1c  nstoragemenu::vfunc_25  (69 insns)
// 0x1003dde1  nstoragemenu::vfunc_31  (25 insns)
//   calls:   -> nSoundNode::vfunc_52
// 0x1003de22  nstoragemenu::vfunc_32  (27 insns)
//   calls:   -> nSoundNode::vfunc_53
// 0x1003de6b  nstoragemenu::vfunc_28  (35 insns)
//   calls:   -> nSoundNode::vfunc_49
// 0x1003dec4  nstoragemenu::vfunc_29  (47 insns)
//   calls:   -> nSoundNode::vfunc_50

} // namespace re_nnomads
