#pragma once
// Auto-lifted C++ layout & method spec from ndinput8.dll
// Source ASM: re/disasm/ndinput8/nRoot.asm
// Class: nRoot

#include <cstdint>

namespace re_ndinput8 {

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
// 0x100011db  nRoot::nRoot()  (34 insns)
// 0x10001232  nRoot::operator=  (33 insns)
// 0x10001283  nRoot::vfunc_00  (41 insns)
// 0x100012de  nRoot::GetParent  (2 insns)
// 0x100012e2  nRoot::GetHead  (15 insns)
// 0x10001300  nRoot::GetTail  (15 insns)
// 0x10001320  nRoot::GetSucc  (10 insns)
// 0x10001335  nRoot::GetPred  (10 insns)
// 0x1000134b  nRoot::GetName  (2 insns)

} // namespace re_ndinput8
