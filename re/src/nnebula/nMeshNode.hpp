#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nMeshNode.asm
// Class: nMeshNode : public nvisnode  (sizeof = 0x108 = 264 bytes)

#include <cstdint>

namespace re_nnebula {

struct nMeshNode_Layout {
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
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00cc
    uint32_t field_0x00cc;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00e8
    uint32_t field_0x00e8;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x0104
    uint8_t field_0x0104;
    // +0x0105
    uint8_t field_0x0105;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (6):
//   v_setfilename_s
//   s_getfilename_v
//   v_setreadonly_b
//   b_getreadonly_v
//   v_setcastshadow_b
//   b_getcastshadow_v

// Methods (25):
// 0x1000f24c  nMeshNode::nMeshNode()  (51 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1000f2e7  nMeshNode::operator=  (50 insns)
//   calls:   -> nVisNode::operator=
// 0x10019e07  nMeshNode::n_init_nmeshnode  (15 insns)
//   strings: 'nvisnode'
// 0x10019e32  nMeshNode::n_fini_nmeshnode  (5 insns)
// 0x10019e44  nMeshNode::n_new_nmeshnode  (10 insns)
//   calls:   -> nMeshNode::nMeshNode()
// 0x10019e5e  nMeshNode::nMeshNode()  (60 insns)
//   calls:   -> nVisNode::nVisNode()
//   strings: '/sys/servers/shadow', '/sys/servers/file2'
// 0x10019f3c  nMeshNode::~nMeshNode()  (71 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x1001a035  nMeshNode::GetVertexBuffer  (14 insns)
//   calls:   -> nMeshNode::loadMesh
// 0x1001a05b  nMeshNode::SetReadOnly  (3 insns)
// 0x1001a068  nMeshNode::GetReadOnly  (2 insns)
// 0x1001a06f  nMeshNode::SetCastShadow  (3 insns)
// 0x1001a07c  nMeshNode::GetCastShadow  (2 insns)
// 0x1001a083  nMeshNode::Preload  (14 insns)
//   calls:   -> nMeshNode::loadMesh, -> nVisNode::Preload
// 0x1001a0ae  nMeshNode::SetFilename  (49 insns)
// 0x1001a14f  nMeshNode::GetFilename  (2 insns)
// 0x1001a15a  nMeshNode::Attach  (19 insns)
//   calls:   -> nVisNode::Attach
// 0x1001a191  nMeshNode::Compute  (36 insns)
//   calls:   -> nVisNode::Compute, -> nMeshNode::loadMesh
// 0x1001a229  nMeshNode::loadMesh  (253 insns)
//   calls:   IAT: MSVCRT.dll!strstr, -> nNtxFile::~nNtxFile(), IAT: nkernel.dll!n_printf, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   strings: '.n3d', '.nvx', 'v_setfilename_s', 's_getfilename_v', 'v_setreadonly_b', 'b_getreadonly_v', 'v_setcastshadow_b', 'b_getcastshadow_v'
// 0x1001a534  nMeshNode::cmd_setfilename (v_setfilename_s)  (10 insns)
//   calls:   -> nMeshNode::SetFilename
// 0x1001a557  nMeshNode::cmd_getfilename (s_getfilename_v)  (14 insns)
//   calls:   -> nMeshNode::GetFilename
// 0x1001a581  nMeshNode::cmd_setreadonly (v_setreadonly_b)  (12 insns)
//   calls:   -> nMeshNode::SetReadOnly
// 0x1001a5a7  nMeshNode::cmd_getreadonly (b_getreadonly_v)  (13 insns)
//   calls:   -> nMeshNode::GetReadOnly
// 0x1001a5d2  nMeshNode::cmd_setcastshadow (v_setcastshadow_b)  (12 insns)
//   calls:   -> nMeshNode::SetCastShadow
// 0x1001a5f8  nMeshNode::cmd_getcastshadow (b_getcastshadow_v)  (13 insns)
//   calls:   -> nMeshNode::GetCastShadow
// 0x1001a623  nMeshNode::SaveCmds  (90 insns)
//   calls:   -> nVisNode::SaveCmds, -> nMeshNode::GetFilename, -> nMeshNode::GetReadOnly, -> nMeshNode::GetCastShadow

} // namespace re_nnebula
