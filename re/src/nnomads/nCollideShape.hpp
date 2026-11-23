#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nCollideShape.asm
// Class: nCollideShape

#include <cstdint>

namespace re_nnomads {

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

// Methods (8):
// 0x10004d1c  nCollideShape::nCollideShape()  (23 insns)
// 0x10004d54  nCollideShape::operator=  (22 insns)
// 0x10004de2  nCollideShape::nCollideShape()  (46 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10004e62  nCollideShape::nCollideShape()  (20 insns)
// 0x10004e96  nCollideShape::AddRef  (3 insns)
// 0x10004e9d  nCollideShape::RemRef  (3 insns)
// 0x10004ea4  nCollideShape::IsInitialized  (2 insns)
// 0x10004ea8  nCollideShape::GetRadius  (2 insns)

} // namespace re_nnomads
