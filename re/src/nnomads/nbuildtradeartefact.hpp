#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nbuildtradeartefact.asm
// Class: nbuildtradeartefact : public nbuildartefact  (sizeof = 0x94 = 148 bytes)

#include <cstdint>

namespace re_nnomads {

struct nbuildtradeartefact_Layout {
    // +0x02b6
    uint8_t field_0x02b6;
};

// Methods (6):
// 0x10040092  nbuildtradeartefact::n_init_nbuildtradeartefact  (15 insns)
//   strings: 'nbuildartefact'
// 0x100400bd  nbuildtradeartefact::n_fini_nbuildtradeartefact  (5 insns)
// 0x100400cf  nbuildtradeartefact::n_new_nbuildtradeartefact  (10 insns)
// 0x100400e9  nbuildtradeartefact::n_version_nbuildtradeartefact  (9 insns)
// 0x10040101  nbuildtradeartefact::vfunc_00  (12 insns)
// 0x10040123  nbuildtradeartefact::vfunc_22  (18 insns)
//   calls:   -> nContainer::SetArtefactOwner, -> nContainer::SetInShop, -> nbuildartefact::vfunc_22

} // namespace re_nnomads
