#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsammlermanager.asm
// Class: nsammlermanager : public ntaskmanager  (sizeof = 0x65c = 1628 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsammlermanager_Layout {
    // +0x000c
    uint32_t field_0x000c;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint8_t field_0x0018;
    // +0x1258
    float field_0x1258;
    // +0x125c
    float field_0x125c;
};

// Methods (7):
// 0x100664e5  nsammlermanager::n_init_nsammlermanager  (10 insns)
//   strings: 'ntaskmanager'
// 0x10066506  nsammlermanager::n_fini_nsammlermanager  (5 insns)
// 0x10066518  nsammlermanager::n_new_nsammlermanager  (16 insns)
// 0x1006653f  nsammlermanager::vfunc_00  (12 insns)
// 0x10066561  nsammlermanager::vfunc_20  (25 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x100665a0  nsammlermanager::vfunc_19  (43 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nviewer2::vfunc_18
// 0x10066612  nsammlermanager::vfunc_23  (113 insns)
//   calls:   -> nRealWorld::FindObjectBySymbolicName, -> nContainer::IsVehicleClass
//   strings: 'concret.nature.ore'

} // namespace re_nnomads
