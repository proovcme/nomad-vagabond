#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nDir.asm
// Class: nDir

#include <cstdint>

namespace re_nnature {

struct nDir_Layout {
    // +0x0204
    uint32_t field_0x0204;
};

// Methods (6):
// 0x10004cb4  nDir::nDir()  (19 insns)
// 0x10004cf1  nDir::operator=  (28 insns)
// 0x1000e15e  nDir::vfunc_62  (1 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::Preload
// 0x1000e164  nDir::vfunc_61  (1 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::Compute
// 0x1000e16a  nDir::vfunc_60  (1 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::Attach
// 0x1000e170  nDir::vfunc_57  (154 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::SaveCmds, IAT: nnebula.dll!nMeshNode::~nMeshNode(), IAT: nnebula.dll!nVertexSorter::nVertexSorter(), IAT: nnebula.dll!nVertexSorter::~nVertexSorter(), IAT: nnebula.dll!nGfxServer::GetLight, IAT: nnebula.dll!nGfxServer::GetNumLights, IAT: nnebula.dll!nVertexSorter::SortIndices, IAT: nnebula.dll!nVertexSorter::Prepare, IAT: nnebula.dll!nVisNode::nVisNode(), IAT: nnebula.dll!nVisNode::DependsOn, IAT: MSVCRT.dll!??2@YAPAXI@Z, IAT: MSVCRT.dll!??3@YAXPAX@Z

} // namespace re_nnature
