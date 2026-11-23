#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nNetNode.asm
// Class: nNetNode

#include <cstdint>

namespace re_nnomads {

struct nNetNode_Layout {
    // +0x0044
    uint8_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x004e
    uint8_t field_0x004e;
};

// Methods (9):
// 0x10006ce8  nNetNode::MarkShadow  (3 insns)
// 0x10006cf6  nNetNode::SetNetName  (3 insns)
// 0x10006d02  nNetNode::GetNetName  (2 insns)
// 0x10006d07  nNetNode::SetNetValid  (3 insns)
// 0x10006d11  nNetNode::IsNetValid  (2 insns)
// 0x10006d15  nNetNode::nNetNode()  (19 insns)
//   calls:   -> nRoot::nRoot()
// 0x10006d4a  nNetNode::operator=  (18 insns)
//   calls:   -> nRoot::operator=
// 0x10006d79  nNetNode::vfunc_00  (41 insns)
// 0x10079be8  nNetNode::vfunc_11  (2 insns)
//   calls:   IAT: nnetwork.dll!nNetNode::SaveCmds, IAT: nnetwork.dll!nNetNode::~nNetNode()

} // namespace re_nnomads
