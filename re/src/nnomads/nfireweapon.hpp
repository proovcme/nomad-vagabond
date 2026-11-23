#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nfireweapon.asm
// Class: nfireweapon : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct nfireweapon_Layout {
    // +0x000c
    uint32_t field_0x000c;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint8_t field_0x0018;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0eb0
    uint8_t field_0x0eb0;
};

// Methods (7):
// 0x10032366  nfireweapon::n_init_nfireweapon  (10 insns)
//   strings: 'nservice'
// 0x10032387  nfireweapon::n_fini_nfireweapon  (5 insns)
// 0x10032399  nfireweapon::n_new_nfireweapon  (10 insns)
// 0x100323b0  nfireweapon::n_version_nfireweapon  (9 insns)
// 0x100323c8  nfireweapon::vfunc_00  (14 insns)
// 0x100323f5  nfireweapon::vfunc_16  (37 insns)
//   calls:   -> nRealWorld::GetViewerCarrier, -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x1003252d  nfireweapon::vfunc_18  (155 insns)
//   calls:   -> nRealWorld::GetViewerCarrier, -> nContainer::IsHandControl, -> nconsumption::vfunc_37

} // namespace re_nnomads
