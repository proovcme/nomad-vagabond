#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nTexArrayNode.asm
// Class: nTexArrayNode

#include <cstdint>

namespace re_nnomads {

struct nTexArrayNode_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0134
    uint32_t field_0x0134;
    // +0x0138
    uint32_t field_0x0138;
    // +0x013c
    uint32_t field_0x013c;
    // +0x0140
    uint32_t field_0x0140;
};

// Methods (12):
// 0x1003982e  nTexArrayNode::GetTexture  (20 insns)
// 0x1003986a  nTexArrayNode::SetGenMipMaps  (4 insns)
// 0x1003987c  nTexArrayNode::GetGenMipMaps  (3 insns)
// 0x1003988a  nTexArrayNode::nTexArrayNode()  (61 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x10039950  nTexArrayNode::operator=  (82 insns)
//   calls:   -> nVisNode::operator=
// 0x10039a3f  nTexArrayNode::vfunc_00  (92 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10039b12  nTexArrayNode::SetHighQuality  (4 insns)
// 0x10039b24  nTexArrayNode::GetHighQuality  (3 insns)
// 0x100799f0  nTexArrayNode::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nTexArrayNode::Preload
// 0x100799f6  nTexArrayNode::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nTexArrayNode::Compute
// 0x100799fc  nTexArrayNode::vfunc_14  (1 insns)
//   calls:   IAT: nnebula.dll!nTexArrayNode::Attach
// 0x10079a02  nTexArrayNode::vfunc_11  (4 insns)
//   calls:   IAT: nnebula.dll!nTexArrayNode::SaveCmds, IAT: nnebula.dll!nTexArrayNode::~nTexArrayNode(), IAT: nnebula.dll!nAnimNode::nAnimNode(), IAT: nnebula.dll!nAnimNode::~nAnimNode()

} // namespace re_nnomads
