#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ndebris.asm
// Class: ndebris : public ncontainer  (sizeof = 0xeb0 = 3760 bytes)

#include <cstdint>

namespace re_nnomads {

struct ndebris_Layout {
    // (no direct [this+offset] fields detected)
};

// Methods (6):
// 0x1007934a  ndebris::n_init_ndebris  (15 insns)
//   strings: 'ncontainer'
// 0x10079375  ndebris::n_fini_ndebris  (5 insns)
// 0x10079387  ndebris::n_new_ndebris  (16 insns)
//   calls:   -> nContainer::nContainer()
// 0x100793ae  ndebris::vfunc_00  (12 insns)
//   calls:   -> nContainer::~nContainer()
// 0x100793d0  ndebris::vfunc_24  (4 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x100793dd  ndebris::vfunc_56  (4 insns)
//   calls:   IAT: nkernel.dll!n_printf

} // namespace re_nnomads
