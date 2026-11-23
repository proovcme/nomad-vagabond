#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nRoot.asm
// Class: nRoot

#include <cstdint>

namespace re_nparticle {

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
// 0x100016b9  nRoot::nRoot()  (34 insns)
// 0x10001710  nRoot::operator=  (33 insns)
// 0x100017bc  nRoot::GetParent  (2 insns)
// 0x100017c0  nRoot::GetHead  (15 insns)
// 0x100017de  nRoot::GetTail  (15 insns)
// 0x100017fe  nRoot::GetSucc  (10 insns)
// 0x10001813  nRoot::GetPred  (10 insns)
// 0x10001829  nRoot::GetName  (2 insns)

} // namespace re_nparticle
