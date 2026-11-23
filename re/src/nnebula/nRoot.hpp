#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nRoot.asm
// Class: nRoot

#include <cstdint>

namespace re_nnebula {

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

// Methods (9):
// 0x1000118e  nRoot::nRoot()  (34 insns)
// 0x100011e5  nRoot::operator=  (33 insns)
// 0x10001236  nRoot::vfunc_00  (41 insns)
// 0x10001291  nRoot::GetParent  (2 insns)
// 0x10001295  nRoot::GetHead  (15 insns)
// 0x100012b3  nRoot::GetTail  (15 insns)
// 0x100012d3  nRoot::GetSucc  (10 insns)
// 0x100012e8  nRoot::GetPred  (10 insns)
// 0x100012fe  nRoot::GetName  (2 insns)

} // namespace re_nnebula
