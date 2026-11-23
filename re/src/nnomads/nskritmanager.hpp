#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nskritmanager.asm
// Class: nskritmanager : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct nskritmanager_Layout {
    // +0x000c
    uint32_t field_0x000c;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint8_t field_0x0018;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0044
    uint8_t field_0x0044;
};

// Methods (7):
// 0x100616db  nskritmanager::n_init_nskritmanager  (15 insns)
//   strings: 'nservice'
// 0x10061706  nskritmanager::n_fini_nskritmanager  (5 insns)
// 0x10061718  nskritmanager::n_new_nskritmanager  (16 insns)
// 0x1006173c  nskritmanager::vfunc_00  (12 insns)
// 0x1006175e  nskritmanager::vfunc_18  (40 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nconsumption::vfunc_37
// 0x100617b7  nskritmanager::vfunc_20  (4 insns)
// 0x100617c8  nskritmanager::vfunc_19  (132 insns)
//   calls:   -> nRealWorld::FindObjectBySymbolicName

} // namespace re_nnomads
