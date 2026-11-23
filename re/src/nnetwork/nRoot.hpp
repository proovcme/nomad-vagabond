#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nRoot.asm
// Class: nRoot

#include <cstdint>

namespace re_nnetwork {

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
// 0x1000109b  nRoot::nRoot()  (34 insns)
// 0x100010f2  nRoot::operator=  (33 insns)
// 0x10001143  nRoot::vfunc_00  (41 insns)
// 0x1000119e  nRoot::GetParent  (2 insns)
// 0x100011a2  nRoot::GetHead  (15 insns)
// 0x100011c0  nRoot::GetTail  (15 insns)
// 0x100011e0  nRoot::GetSucc  (10 insns)
// 0x100011f5  nRoot::GetPred  (10 insns)
// 0x1000120b  nRoot::GetName  (2 insns)

} // namespace re_nnetwork
