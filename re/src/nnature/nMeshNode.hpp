#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nMeshNode.asm
// Class: nMeshNode

#include <cstdint>

namespace re_nnature {

struct nMeshNode_Layout {
    // +0x0104
    uint8_t field_0x0104;
    // +0x0105
    uint8_t field_0x0105;
};

// Methods (2):
// 0x100050e5  nMeshNode::nMeshNode()  (51 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x10005180  nMeshNode::operator=  (50 insns)
//   calls:   -> nVisNode::operator=

} // namespace re_nnature
