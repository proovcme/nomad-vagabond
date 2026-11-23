#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nRoot.asm
// Class: nRoot

#include <cstdint>

namespace re_ncollide {

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
// 0x100013be  nRoot::nRoot()  (34 insns)
// 0x10001415  nRoot::operator=  (33 insns)
// 0x100014c1  nRoot::GetParent  (2 insns)
// 0x100014c5  nRoot::GetHead  (15 insns)
// 0x100014e3  nRoot::GetTail  (15 insns)
// 0x10001503  nRoot::GetSucc  (10 insns)
// 0x10001518  nRoot::GetPred  (10 insns)
// 0x1000152e  nRoot::GetName  (2 insns)

} // namespace re_ncollide
