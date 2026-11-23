#pragma once
// Auto-lifted C++ layout & method spec from nopcode.dll
// Source ASM: re/disasm/nopcode/nRoot.asm
// Class: nRoot

#include <cstdint>

namespace re_nopcode {

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
// 0x10001053  nRoot::nRoot()  (34 insns)
// 0x100010aa  nRoot::operator=  (33 insns)
// 0x100010fb  nRoot::vfunc_00  (41 insns)
// 0x10001156  nRoot::GetParent  (2 insns)
// 0x1000115a  nRoot::GetHead  (15 insns)
// 0x10001178  nRoot::GetTail  (15 insns)
// 0x10001198  nRoot::GetSucc  (10 insns)
// 0x100011ad  nRoot::GetPred  (10 insns)
// 0x100011c3  nRoot::GetName  (2 insns)

} // namespace re_nopcode
