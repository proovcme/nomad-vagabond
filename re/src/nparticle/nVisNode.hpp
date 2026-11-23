#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nVisNode.asm
// Class: nVisNode

#include <cstdint>

namespace re_nparticle {

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
// 0x10001fdc  nVisNode::nVisNode()  (43 insns)
//   calls:   -> nRoot::nRoot()
// 0x10002059  nVisNode::operator=  (42 insns)
//   calls:   -> nRoot::operator=
// 0x100020d0  nVisNode::vfunc_00  (41 insns)
// 0x10002131  nVisNode::SetFinishedAfter  (3 insns)
// 0x1000213e  nVisNode::GetFinishedAfter  (2 insns)
// 0x1000981e  nVisNode::vfunc_11  (2 insns)
//   calls:   IAT: nnebula.dll!nVisNode::SaveCmds, IAT: nnebula.dll!nVisNode::~nVisNode()

} // namespace re_nparticle
