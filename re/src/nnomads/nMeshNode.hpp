#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nMeshNode.asm
// Class: nMeshNode

#include <cstdint>

namespace re_nnomads {

struct nMeshNode_Layout {
    // +0x0104
    uint8_t field_0x0104;
    // +0x0105
    uint8_t field_0x0105;
};

// Script AddCmds (4):
//   v_setmeshname_s
//   s_getmeshname_v
//   v_setshadername_s
//   s_getshadername_v

// Methods (7):
// 0x1005e0a9  nMeshNode::nMeshNode()  (51 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1005e144  nMeshNode::operator=  (50 insns)
//   calls:   -> nVisNode::operator=
// 0x1005e1d9  nMeshNode::vfunc_00  (89 insns)
//   strings: 'v_setmeshname_s', 's_getmeshname_v', 'v_setshadername_s', 's_getshadername_v'
// 0x10079a62  nMeshNode::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::Preload
// 0x10079a68  nMeshNode::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::Compute
// 0x10079a6e  nMeshNode::vfunc_14  (1 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::Attach
// 0x10079a74  nMeshNode::vfunc_11  (6 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::SaveCmds, IAT: nnebula.dll!nMeshNode::~nMeshNode(), IAT: nnebula.dll!nInputServer::FlushInput, IAT: nnebula.dll!nInputServer::NextEvent, IAT: nnebula.dll!nInputServer::FirstEvent, IAT: nnebula.dll!nInputServer::FlushEvents

} // namespace re_nnomads
