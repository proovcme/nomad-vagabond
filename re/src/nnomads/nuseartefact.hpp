#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nuseartefact.asm
// Class: nuseartefact : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct nuseartefact_Layout {
    // +0x02b6
    uint8_t field_0x02b6;
    // +0x0e65
    uint8_t field_0x0e65;
    // +0x0e72
    uint8_t field_0x0e72;
    // +0x0e74
    uint32_t field_0x0e74;
    // +0x0e78
    float field_0x0e78;
};

// Methods (7):
// 0x10040e09  nuseartefact::n_init_nuseartefact  (15 insns)
//   strings: 'nservice'
// 0x10040e34  nuseartefact::n_fini_nuseartefact  (5 insns)
// 0x10040e46  nuseartefact::n_new_nuseartefact  (10 insns)
// 0x10040e5d  nuseartefact::n_version_nuseartefact  (9 insns)
// 0x10040e75  nuseartefact::vfunc_00  (14 insns)
// 0x10040f79  nuseartefact::vfunc_19  (80 insns)
//   calls:   -> nContainer::GetArtefactOwner, -> nStateNode::GetClan, -> nRealWorld::SetViewerCarrier, -> nRealWorld::SetHandControlVehicle
// 0x10041074  nuseartefact::vfunc_20  (54 insns)
//   calls:   -> nContainer::GetArtefactOwner, -> nRealWorld::SetViewerCarrier, -> nRealWorld::SetHandControlVehicle, -> nStateNode::GetClan

} // namespace re_nnomads
