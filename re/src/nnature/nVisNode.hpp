#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nVisNode.asm
// Class: nVisNode

#include <cstdint>

namespace re_nnature {

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

// Methods (4):
// 0x10001845  nVisNode::nVisNode()  (43 insns)
//   calls:   -> nRoot::nRoot()
// 0x100018c2  nVisNode::operator=  (42 insns)
//   calls:   -> nRoot::operator=
// 0x1000199a  nVisNode::SetFinishedAfter  (3 insns)
// 0x100019a7  nVisNode::GetFinishedAfter  (2 insns)

} // namespace re_nnature
