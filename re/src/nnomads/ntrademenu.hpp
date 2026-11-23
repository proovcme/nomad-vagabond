#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ntrademenu.asm
// Class: ntrademenu : public nmenu  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct ntrademenu_Layout {
    // +0x001c
    uint32_t field_0x001c;
    // +0x01f4
    uint32_t field_0x01f4;
    // +0x02a4
    uint32_t field_0x02a4;
    // +0x02b6
    uint8_t field_0x02b6;
    // +0x0d9c
    float field_0x0d9c;
    // +0x129c
    uint32_t field_0x129c;
    // +0x1344
    uint32_t field_0x1344;
};

// Methods (13):
// 0x1003d524  ntrademenu::n_init_ntrademenu  (15 insns)
//   calls:   -> nRealWorld::EndAliases
//   strings: 'nmenu'
// 0x1003d54f  ntrademenu::n_fini_ntrademenu  (5 insns)
// 0x1003d561  ntrademenu::n_new_ntrademenu  (10 insns)
// 0x1003d578  ntrademenu::n_version_ntrademenu  (9 insns)
// 0x1003d590  ntrademenu::vfunc_00  (12 insns)
// 0x1003d5b2  ntrademenu::vfunc_16  (7 insns)
//   calls:   -> nSoundNode::vfunc_37
// 0x1003d5c9  ntrademenu::vfunc_22  (47 insns)
// 0x1003d648  ntrademenu::vfunc_23  (41 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1003d6b3  ntrademenu::vfunc_24  (51 insns)
// 0x1003d73a  ntrademenu::vfunc_25  (21 insns)
// 0x1003d772  ntrademenu::vfunc_26  (18 insns)
// 0x1003d7a1  ntrademenu::vfunc_34  (160 insns)
//   calls:   -> nRealWorld::GetGlobalTime, -> nContainer::GetPosition, IAT: nkernel.dll!n_printf, -> nContainer::SetPosition
//   consts:  f64=0.8
// 0x1003d968  ntrademenu::vfunc_35  (114 insns)
//   calls:   -> nRealWorld::GetGlobalTime
//   consts:  f64=0

} // namespace re_nnomads
