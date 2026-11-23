#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nstationengine.asm
// Class: nstationengine : public nengine2  (sizeof = 0xa4 = 164 bytes)

#include <cstdint>

namespace re_nnomads {

struct nstationengine_Layout {
    // (no direct [this+offset] fields detected)
};

// Methods (7):
// 0x1004b029  nstationengine::n_init_nstationengine  (15 insns)
//   strings: 'nengine2'
// 0x1004b054  nstationengine::n_fini_nstationengine  (5 insns)
// 0x1004b066  nstationengine::n_new_nstationengine  (10 insns)
// 0x1004b080  nstationengine::n_version_nstationengine  (9 insns)
// 0x1004b098  nstationengine::vfunc_00  (12 insns)
// 0x1004b0ba  nstationengine::vfunc_31  (8 insns)
// 0x1004b0cf  nstationengine::vfunc_11  (3 insns)
//   calls:   -> nengine2::vfunc_11

} // namespace re_nnomads
