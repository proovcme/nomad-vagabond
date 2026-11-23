#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nRoot.asm
// Class: nRoot

#include <cstdint>

namespace re_nnature {

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
// 0x100011b9  nRoot::nRoot()  (34 insns)
// 0x10001210  nRoot::operator=  (33 insns)
// 0x10001261  nRoot::vfunc_00  (41 insns)
// 0x100012bc  nRoot::GetParent  (2 insns)
// 0x100012c0  nRoot::GetHead  (15 insns)
// 0x100012de  nRoot::GetTail  (15 insns)
// 0x100012fe  nRoot::GetSucc  (10 insns)
// 0x10001313  nRoot::GetPred  (10 insns)
// 0x10001329  nRoot::GetName  (2 insns)

} // namespace re_nnature
