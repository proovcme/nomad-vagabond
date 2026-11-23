#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nVisNode.asm
// Class: nVisNode

#include <cstdint>

namespace re_nnomads {

struct nVisNode_Layout {
    // +0x008c
    float field_0x008c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x0094
    uint32_t field_0x0094;
    // +0x0098
    uint8_t field_0x0098;
};

// Methods (6):
// 0x100083eb  nVisNode::nVisNode()  (43 insns)
//   calls:   -> nRoot::nRoot()
// 0x10008468  nVisNode::operator=  (42 insns)
//   calls:   -> nRoot::operator=
// 0x100084df  nVisNode::vfunc_00  (41 insns)
// 0x10008540  nVisNode::SetFinishedAfter  (3 insns)
// 0x1000854d  nVisNode::GetFinishedAfter  (2 insns)
// 0x100798d0  nVisNode::vfunc_11  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::SaveCmds

} // namespace re_nnomads
