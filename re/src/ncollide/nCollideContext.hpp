#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nCollideContext.asm
// Class: nCollideContext

#include <cstdint>

namespace re_ncollide {

struct nCollideContext_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    double field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    float field_0x0050;
    // +0x0054
    float field_0x0054;
    // +0x0058
    float field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x00fc
    uint8_t field_0x00fc;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0424
    uint32_t field_0x0424;
    // +0x0430
    uint32_t field_0x0430;
    // +0x0434
    uint32_t field_0x0434;
    // +0x0838
    uint32_t field_0x0838;
    // +0x083c
    uint32_t field_0x083c;
    // +0x0850
    uint32_t field_0x0850;
    // +0x0854
    uint32_t field_0x0854;
    // +0x0860
    uint32_t field_0x0860;
};

// Methods (16):
// 0x10001716  nCollideContext::nCollideContext()  (44 insns)
// 0x1000179f  nCollideContext::operator=  (43 insns)
// 0x10001883  nCollideContext::nCollideContext()  (107 insns)
// 0x10001999  nCollideContext::GetCollideServer  (2 insns)
// 0x10002fd8  nCollideContext::~nCollideContext()  (28 insns)
// 0x1000301e  nCollideContext::NewObject  (33 insns)
//   calls:   -> nCollideObject::nCollideObject()
// 0x1000307f  nCollideContext::ReleaseObject  (25 insns)
// 0x100030ba  nCollideContext::AddObject  (29 insns)
// 0x10003115  nCollideContext::RemObject  (24 insns)
// 0x10003159  nCollideContext::Collide  (44 insns)
//   calls:   -> nCollideObject::Collide
// 0x100031c5  nCollideContext::GetCollissions  (12 insns)
// 0x100031ed  nCollideContext::Visualize  (121 insns)
//   calls:   -> nCollideObject::VisualizeLocal, -> nCollideObject::VisualizeGlobal
// 0x1000334e  nCollideContext::MovingSphereCheck  (353 insns)
//   calls:   -> nCollideServer::QueryCollType
//   consts:  f32=0, f32=1, f64=1e-07
// 0x10003761  nCollideContext::LineCheck  (131 insns)
//   calls:   -> nCollideServer::QueryCollType
// 0x100038d4  nCollideContext::SphereCheck  (182 insns)
//   calls:   -> nCollideServer::QueryCollType
// 0x10003b01  nCollideContext::Reset  (672 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nCollideObject::Transform, IAT: MSVCRT.dll!memmove
//   consts:  f64=1e-07, f64=-1e-07, f32=4, f32=0, f32=1

} // namespace re_ncollide
