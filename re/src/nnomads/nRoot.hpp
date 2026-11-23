#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nRoot.asm
// Class: nRoot

#include <cstdint>

namespace re_nnomads {

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
// 0x10001289  nRoot::nRoot()  (34 insns)
// 0x100012e0  nRoot::operator=  (33 insns)
// 0x10001331  nRoot::vfunc_00  (41 insns)
// 0x1000138c  nRoot::GetParent  (2 insns)
// 0x10001390  nRoot::GetHead  (15 insns)
// 0x100013ae  nRoot::GetTail  (15 insns)
// 0x100013ce  nRoot::GetSucc  (10 insns)
// 0x100013e3  nRoot::GetPred  (10 insns)
// 0x100013f9  nRoot::GetName  (2 insns)

} // namespace re_nnomads
