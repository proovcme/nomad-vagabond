#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ntransformmenu.asm
// Class: ntransformmenu : public nmenu  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct ntransformmenu_Layout {
    // +0x0044
    uint8_t field_0x0044;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x02b6
    uint8_t field_0x02b6;
    // +0x0e74
    uint32_t field_0x0e74;
    // +0x129c
    uint32_t field_0x129c;
    // +0x1344
    uint32_t field_0x1344;
};

// Methods (12):
// 0x1003df36  ntransformmenu::n_init_ntransformmenu  (15 insns)
//   calls:   -> nRealWorld::EndAliases
//   strings: 'nmenu'
// 0x1003df61  ntransformmenu::n_fini_ntransformmenu  (5 insns)
// 0x1003df73  ntransformmenu::n_new_ntransformmenu  (10 insns)
// 0x1003df8a  ntransformmenu::n_version_ntransformmenu  (9 insns)
// 0x1003dfa2  ntransformmenu::vfunc_00  (12 insns)
// 0x1003dfc4  ntransformmenu::vfunc_16  (19 insns)
//   calls:   -> nSoundNode::vfunc_37
// 0x1003dff6  ntransformmenu::vfunc_22  (35 insns)
// 0x1003e053  ntransformmenu::vfunc_23  (55 insns)
// 0x1003e0eb  ntransformmenu::vfunc_24  (64 insns)
// 0x1003e19e  ntransformmenu::vfunc_26  (109 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::GetMatrix44, -> nContainer::SetPosition
// 0x1003e2cf  ntransformmenu::vfunc_34  (111 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::SetPosition
// 0x1003e408  ntransformmenu::vfunc_35  (77 insns)
//   calls:   -> nStateNode::GetPrototype

} // namespace re_nnomads
