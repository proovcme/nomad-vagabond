#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nDir.asm
// Class: nDir

#include <cstdint>

namespace re_nnebula {

struct nDir_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x0204
    uint32_t field_0x0204;
};

// Methods (8):
// 0x1000f165  nDir::nDir()  (19 insns)
// 0x1000f1a2  nDir::operator=  (28 insns)
// 0x1000f1eb  nDir::vfunc_00  (41 insns)
// 0x1000f37c  nDir::vfunc_05  (101 insns)
//   calls:   -> nMeshNode::~nMeshNode(), IAT: nkernel.dll!n_free
// 0x10037c00  nDir::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::IsSubDir
// 0x10037c06  nDir::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::Rewind
// 0x10037c0c  nDir::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::Read
// 0x10037c12  nDir::vfunc_01  (4 insns)
//   calls:   IAT: nkernel.dll!nDir::Open, IAT: nkernel.dll!nDir::~nDir(), IAT: nkernel.dll!nClass::AddSubClass, IAT: nkernel.dll!nClass::RemSubClass

} // namespace re_nnebula
