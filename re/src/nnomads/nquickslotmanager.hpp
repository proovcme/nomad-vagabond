#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nquickslotmanager.asm
// Class: nquickslotmanager : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct nquickslotmanager_Layout {
    // (no direct [this+offset] fields detected)
};

// Methods (6):
// 0x10057a4d  nquickslotmanager::n_init_nquickslotmanager  (15 insns)
//   calls:   -> nRealWorld::EndAliases
//   strings: 'nservice'
// 0x10057a78  nquickslotmanager::n_fini_nquickslotmanager  (5 insns)
// 0x10057a8a  nquickslotmanager::n_new_nquickslotmanager  (10 insns)
// 0x10057aa1  nquickslotmanager::n_version_nquickslotmanager  (9 insns)
// 0x10057ab9  nquickslotmanager::vfunc_00  (12 insns)
// 0x10057adb  nquickslotmanager::vfunc_18  (88 insns)
//   calls:   -> nContainer::IsHandControl, -> nconsumption::vfunc_37
//   strings: 'cycle'

} // namespace re_nnomads
