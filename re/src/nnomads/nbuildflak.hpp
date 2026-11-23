#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nbuildflak.asm
// Class: nbuildflak : public nbuild  (sizeof = 0x94 = 148 bytes)

#include <cstdint>

namespace re_nnomads {

struct nbuildflak_Layout {
    // +0x0090
    uint32_t field_0x0090;
};

// Methods (7):
// 0x100402a7  nbuildflak::n_init_nbuildflak  (10 insns)
//   strings: 'nbuild'
// 0x100402c8  nbuildflak::n_fini_nbuildflak  (5 insns)
// 0x100402da  nbuildflak::n_new_nbuildflak  (10 insns)
// 0x100402f4  nbuildflak::n_version_nbuildflak  (9 insns)
// 0x1004030c  nbuildflak::vfunc_00  (12 insns)
// 0x1004032e  nbuildflak::vfunc_22  (30 insns)
//   calls:   -> nContainer::GetDirection, -> nContainer::SetDirection, -> nbuild::vfunc_22
// 0x1004037a  nbuildflak::vfunc_23  (35 insns)

} // namespace re_nnomads
