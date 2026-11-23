#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nbuildartefact.asm
// Class: nbuildartefact : public nbuild  (sizeof = 0x94 = 148 bytes)

#include <cstdint>

namespace re_nnomads {

struct nbuildartefact_Layout {
    // (no direct [this+offset] fields detected)
};

// Methods (7):
// 0x1003ffa3  nbuildartefact::n_init_nbuildartefact  (10 insns)
//   strings: 'nbuild'
// 0x1003ffc4  nbuildartefact::n_fini_nbuildartefact  (5 insns)
// 0x1003ffd6  nbuildartefact::n_new_nbuildartefact  (10 insns)
// 0x1003fff0  nbuildartefact::n_version_nbuildartefact  (9 insns)
// 0x10040008  nbuildartefact::vfunc_00  (14 insns)
// 0x10040035  nbuildartefact::vfunc_22  (43 insns)
//   calls:   -> nbuild::vfunc_22
// 0x100403d5  nbuildartefact::vfunc_11  (10 insns)
//   calls:   -> nbuild::vfunc_11

} // namespace re_nnomads
