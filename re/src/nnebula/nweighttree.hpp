#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nweighttree.asm
// Class: nweighttree : public nvisnode  (sizeof = 0xa8 = 168 bytes)

#include <cstdint>

namespace re_nnebula {

struct nweighttree_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (2):
//   b_addleaf_s
//   b_addnode_sss

// Methods (12):
// 0x1002d3a5  nweighttree::n_init_nweighttree  (15 insns)
//   strings: 'nvisnode'
// 0x1002d3d0  nweighttree::n_fini_nweighttree  (5 insns)
// 0x1002d3e2  nweighttree::n_new_nweighttree  (10 insns)
// 0x1002d3fc  nweighttree::n_version_nweighttree  (14 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1002d426  nweighttree::vfunc_00  (46 insns)
//   calls:   -> nVisNode::~nVisNode(), IAT: nkernel.dll!n_free
// 0x1002d49c  nweighttree::vfunc_21  (38 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nVisNode::NotifyChannelSetDirty
// 0x1002d502  nweighttree::vfunc_22  (62 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1002d5a6  nweighttree::vfunc_18  (136 insns)
//   calls:   -> nVisNode::AttachChannels
// 0x1002d71b  nweighttree::vfunc_15  (74 insns)
//   calls:   -> nVisNode::Compute, IAT: nkernel.dll!n_strdup
//   strings: 'b_addleaf_s', 'b_addnode_sss'
// 0x1002d7eb  nweighttree::cmd_addleaf (b_addleaf_s)  (23 insns)
// 0x1002d82e  nweighttree::cmd_addnode (b_addnode_sss)  (36 insns)
// 0x1002d890  nweighttree::vfunc_11  (91 insns)
//   calls:   -> nVisNode::SaveCmds

} // namespace re_nnebula
