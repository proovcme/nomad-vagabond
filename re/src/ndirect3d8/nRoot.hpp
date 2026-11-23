#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nRoot.asm
// Class: nRoot

#include <cstdint>

namespace re_ndirect3d8 {

struct nRoot_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint32_t field_0x0038;
};

// Methods (8):
// 0x1000138f  nRoot::nRoot()  (34 insns)
// 0x100013e6  nRoot::operator=  (33 insns)
// 0x10001492  nRoot::GetParent  (2 insns)
// 0x10001496  nRoot::GetHead  (15 insns)
// 0x100014b4  nRoot::GetTail  (15 insns)
// 0x100014d4  nRoot::GetSucc  (10 insns)
// 0x100014e9  nRoot::GetPred  (10 insns)
// 0x100014ff  nRoot::GetName  (2 insns)

} // namespace re_ndirect3d8
