#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nspawn.asm
// Class: nspawn : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct nspawn_Layout {
    // +0x1474
    float field_0x1474;
    // +0x1478
    uint32_t field_0x1478;
    // +0x147c
    uint32_t field_0x147c;
    // +0x1480
    uint8_t field_0x1480;
};

// Methods (6):
// 0x10055b8d  nspawn::vfunc_00  (12 insns)
// 0x10055baf  nspawn::vfunc_16  (123 insns)
//   calls:   -> nRealWorld::IsNetSession, -> nRealWorld::GetUserClan, -> nContainer::GetDirection, -> nContainer::SetDirection, -> nContainer::GetPosition, -> nContainer::SetPosition, -> nContainer::GetMatrix44, -> nRealWorld::GetViewerCarrier, -> nRealWorld::SetViewerCarrier, -> nStateNode::TriggerRecord
// 0x10055d2b  nspawn::n_init_nspawn  (10 insns)
//   strings: 'nservice'
// 0x10055d4c  nspawn::n_fini_nspawn  (5 insns)
// 0x10055d5e  nspawn::n_new_nspawn  (10 insns)
// 0x10055d75  nspawn::n_version_nspawn  (2 insns)

} // namespace re_nnomads
