#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nBuildSlot.asm
// Class: nBuildSlot

#include <cstdint>

namespace re_nnomads {

struct nBuildSlot_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x01e0
    uint32_t field_0x01e0;
    // +0x0eff
    uint8_t field_0x0eff;
    // +0x0f04
    float field_0x0f04;
    // +0x0f34
    uint32_t field_0x0f34;
    // +0x0f58
    uint32_t field_0x0f58;
    // +0x0f70
    uint8_t field_0x0f70;
    // +0x0f71
    uint8_t field_0x0f71;
    // +0x0f74
    uint32_t field_0x0f74;
};

// Script AddCmds (1):
//   __buildslotradius_%s

// Methods (14):
// 0x1001e55e  nBuildSlot::nBuildSlot()  (33 insns)
// 0x1001e5aa  nBuildSlot::operator=  (31 insns)
// 0x1001e5e7  nBuildSlot::vfunc_00  (1714 insns)
//   calls:   -> nBuildSlot::~nBuildSlot(), -> nBuildSlot::nBuildSlot(), -> nContainer::GetPosition, -> nStateNode::GetClan, IAT: nkernel.dll!n_printf, -> nStateNode::GetNetworkObject, -> nContainer::GetMatrix44, -> nContainer::SetMatrix44, IAT: MSVCRT.dll!sprintf, IAT: MSVCRT.dll!atof
//   strings: '/game/handler/cookie', '__buildslotradius_%s'
// 0x1001f6fd  nBuildSlot::nBuildSlot()  (27 insns)
// 0x1001f73d  nBuildSlot::~nBuildSlot()  (3 insns)
// 0x1001f74b  nBuildSlot::SetKernelServer  (5 insns)
// 0x1001f75c  nBuildSlot::SetPosition  (10 insns)
// 0x1001f76d  nBuildSlot::GetPosition  (2 insns)
// 0x1001f771  nBuildSlot::SetOrientation  (10 insns)
// 0x1001f784  nBuildSlot::GetOrientation  (2 insns)
// 0x1001f788  nBuildSlot::SetBuilding  (11 insns)
// 0x1001f7a9  nBuildSlot::SetBuilding  (4 insns)
// 0x1001f7b8  nBuildSlot::GetBuilding  (6 insns)
// 0x1001f7c9  nBuildSlot::Clear  (14 insns)

} // namespace re_nnomads
