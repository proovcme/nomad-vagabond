#pragma once
// Auto-lifted C++ layout & method spec from ndsound.dll
// Source ASM: re/disasm/ndsound/nRoot.asm
// Class: nRoot

#include <cstdint>

namespace re_ndsound {

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
// 0x10001866  nRoot::nRoot()  (34 insns)
// 0x100018bd  nRoot::operator=  (33 insns)
// 0x1000190e  nRoot::vfunc_00  (41 insns)
// 0x10001969  nRoot::GetParent  (2 insns)
// 0x1000196d  nRoot::GetHead  (15 insns)
// 0x1000198b  nRoot::GetTail  (15 insns)
// 0x100019ab  nRoot::GetSucc  (10 insns)
// 0x100019c0  nRoot::GetPred  (10 insns)
// 0x100019d6  nRoot::GetName  (2 insns)

} // namespace re_ndsound
