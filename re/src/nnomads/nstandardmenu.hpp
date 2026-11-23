#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nstandardmenu.asm
// Class: nstandardmenu : public nmenu  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct nstandardmenu_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0064
    float field_0x0064;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x0e65
    uint8_t field_0x0e65;
    // +0x0e6c
    uint32_t field_0x0e6c;
    // +0x0e70
    uint32_t field_0x0e70;
    // +0x0e72
    uint8_t field_0x0e72;
    // +0x0e78
    float field_0x0e78;
    // +0x129c
    uint32_t field_0x129c;
};

// Methods (7):
// 0x1003d005  nstandardmenu::n_init_nstandardmenu  (15 insns)
//   strings: 'nmenu'
// 0x1003d030  nstandardmenu::n_fini_nstandardmenu  (5 insns)
// 0x1003d042  nstandardmenu::n_new_nstandardmenu  (10 insns)
// 0x1003d059  nstandardmenu::n_version_nstandardmenu  (9 insns)
// 0x1003d071  nstandardmenu::vfunc_00  (12 insns)
// 0x1003d093  nstandardmenu::vfunc_23  (168 insns)
//   calls:   -> nCmdProto::NewCmd, -> nCmdProto::RelCmd, -> nStateNode::GetClan, -> nContainer::GetDirection, -> nContainer::SetDirection
// 0x1003d297  nstandardmenu::vfunc_24  (227 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::SetPosition, -> nStateNode::GetNetworkObject, -> nRealWorld::GetEnvironmentClan, -> nStateNode::GetClan
//   consts:  f32=0.2

} // namespace re_nnomads
