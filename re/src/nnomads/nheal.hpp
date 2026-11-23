#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nheal.asm
// Class: nheal : public nenergyeffect  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct nheal_Layout {
    // +0x0044
    uint8_t field_0x0044;
};

// Methods (8):
// 0x1004df3f  nheal::n_init_nheal  (15 insns)
//   strings: 'nenergyeffect'
// 0x1004df6a  nheal::n_fini_nheal  (5 insns)
// 0x1004df7c  nheal::n_new_nheal  (10 insns)
// 0x1004df93  nheal::n_version_nheal  (9 insns)
// 0x1004dfab  nheal::vfunc_00  (12 insns)
// 0x1004dfcd  nheal::vfunc_19  (27 insns)
//   calls:   -> nContainer::IsHandControl, -> nRealWorld::IsFriend
// 0x1004e011  nheal::vfunc_21  (30 insns)
//   calls:   -> nContainer::AddEnergy, -> nContainer::SendEnergyUpdate
//   strings: 'unknown'
// 0x1004e05e  nheal::vfunc_11  (10 insns)
//   calls:   -> nenergyeffect::vfunc_11

} // namespace re_nnomads
