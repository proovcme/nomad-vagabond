#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nwatchtarget.asm
// Class: nwatchtarget : public nservice  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct nwatchtarget_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0058
    uint8_t field_0x0058;
};

// Methods (6):
// 0x10034d9b  nwatchtarget::n_init_nwatchtarget  (15 insns)
//   strings: 'nservice'
// 0x10034dc6  nwatchtarget::n_fini_nwatchtarget  (5 insns)
// 0x10034dd8  nwatchtarget::n_new_nwatchtarget  (10 insns)
// 0x10034def  nwatchtarget::n_version_nwatchtarget  (10 insns)
// 0x10034e0b  nwatchtarget::vfunc_00  (14 insns)
// 0x1003513c  nwatchtarget::vfunc_11  (35 insns)
//   calls:   -> ncollidedata::vfunc_11

} // namespace re_nnomads
