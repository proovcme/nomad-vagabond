#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nCollideShape.asm
// Class: nCollideShape

#include <cstdint>

namespace re_ncollide {

struct nCollideShape_Layout {
    // +0x0004
    float field_0x0004;
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

// Methods (21):
// 0x100019a0  nCollideShape::nCollideShape()  (23 insns)
// 0x100019d8  nCollideShape::operator=  (22 insns)
// 0x10001a66  nCollideShape::nCollideShape()  (46 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10001ae6  nCollideShape::nCollideShape()  (20 insns)
// 0x10001b1a  nCollideShape::AddRef  (3 insns)
// 0x10001b21  nCollideShape::RemRef  (3 insns)
// 0x10001b28  nCollideShape::GetRef  (2 insns)
// 0x10001b2c  nCollideShape::IsInitialized  (2 insns)
// 0x10001b30  nCollideShape::GetRadius  (2 insns)
// 0x1000263b  nCollideShape::~nCollideShape()  (6 insns)
// 0x1000264f  nCollideShape::Begin  (3 insns)
// 0x10002657  nCollideShape::SetVertex  (13 insns)
// 0x10002676  nCollideShape::SetTriangle  (1 insns)
// 0x10002679  nCollideShape::End  (2 insns)
// 0x1000267e  nCollideShape::Collide  (2 insns)
// 0x10002683  nCollideShape::LineCheck  (2 insns)
// 0x10002688  nCollideShape::Visualize  (1 insns)
// 0x1000268b  nCollideShape::Load  (39 insns)
//   calls:   IAT: MSVCRT.dll!strstr, -> nCollideShape::LoadN3D, -> nCollideShape::LoadNVX, IAT: nkernel.dll!n_printf
//   strings: '.n3d', '.nvx'
// 0x100026e7  nCollideShape::LoadN3D  (308 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!strtok, IAT: MSVCRT.dll!atof, IAT: MSVCRT.dll!strchr, IAT: MSVCRT.dll!atoi
// 0x10002a0b  nCollideShape::readInt  (11 insns)
// 0x10002a23  nCollideShape::LoadNVX  (218 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: nkernel.dll!nn_malloc, IAT: nkernel.dll!n_free
//   strings: 'rb', 'collide/ncollideshape.cc'

} // namespace re_ncollide
