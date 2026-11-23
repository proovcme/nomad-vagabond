#pragma once
// Auto-lifted C++ layout & method spec from nopcode.dll
// Source ASM: re/disasm/nopcode/nCollideShape.asm
// Class: nCollideShape

#include <cstdint>

namespace re_nopcode {

struct nCollideShape_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0014
    uint32_t field_0x0014;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0024
    uint8_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    float field_0x002c;
};

// Methods (9):
// 0x10001971  nCollideShape::nCollideShape()  (23 insns)
// 0x100019a9  nCollideShape::operator=  (22 insns)
// 0x10001a37  nCollideShape::nCollideShape()  (46 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10001ab7  nCollideShape::nCollideShape()  (20 insns)
// 0x10001aeb  nCollideShape::AddRef  (3 insns)
// 0x10001af2  nCollideShape::RemRef  (3 insns)
// 0x10001af9  nCollideShape::GetRef  (2 insns)
// 0x10001afd  nCollideShape::IsInitialized  (2 insns)
// 0x10001b01  nCollideShape::GetRadius  (2 insns)

} // namespace re_nopcode
