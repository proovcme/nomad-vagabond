#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nCollideObject.asm
// Class: nCollideObject

#include <cstdint>

namespace re_nnomads {

struct nCollideObject_Layout {
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
    // +0x006c
    uint8_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint32_t field_0x0078;
    // +0x00e8
    double field_0x00e8;
    // +0x00f0
    double field_0x00f0;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x00fc
    uint8_t field_0x00fc;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0104
    float field_0x0104;
    // +0x0108
    float field_0x0108;
    // +0x010c
    float field_0x010c;
    // +0x0110
    float field_0x0110;
};

// Methods (30):
// 0x1000502a  nCollideObject::nCollideObject()  (73 insns)
// 0x100050f1  nCollideObject::SetVisualizeColor  (11 insns)
// 0x10005106  nCollideObject::GetVisualizeColor  (2 insns)
// 0x1000510d  nCollideObject::SetContext  (9 insns)
// 0x1000512a  nCollideObject::GetContext  (2 insns)
// 0x1000512e  nCollideObject::SetId  (3 insns)
// 0x10005138  nCollideObject::SetAttached  (3 insns)
// 0x10005145  nCollideObject::IsAttached  (2 insns)
// 0x1000514c  nCollideObject::SetRadius  (3 insns)
// 0x10005156  nCollideObject::GetRadius  (2 insns)
// 0x1000515a  nCollideObject::SetShape  (9 insns)
// 0x10005172  nCollideObject::SetCollClass  (3 insns)
// 0x1000517c  nCollideObject::SetClientData  (3 insns)
// 0x10005189  nCollideObject::GetClientData  (2 insns)
// 0x10005197  nCollideObject::GetPrevTransform  (2 insns)
// 0x1000519b  nCollideObject::GetTimeStamp  (2 insns)
// 0x100051a2  nCollideObject::GetPrevTimeStamp  (2 insns)
// 0x100051a9  nCollideObject::ClearCollissions  (2 insns)
// 0x100051b1  nCollideObject::GetNumCollissions  (2 insns)
// 0x100051b8  nCollideObject::Transform  (204 insns)
//   consts:  f64=0
// 0x100053b9  nCollideObject::Contact  (572 insns)
//   consts:  f32=0.125, f32=1, f32=0, f64=1e-07, f64=-1e-07, f32=4
// 0x100059f9  nCollideObject::Collide  (341 insns)
//   calls:   -> nCollideServer::QueryCollType, -> nCollideObject::Contact, IAT: MSVCRT.dll!memmove
// 0x10005d47  nCollideObject::GetCollissions  (45 insns)
// 0x10005db1  nCollideObject::VisualizeLocal  (179 insns)
//   consts:  f32=0.7, f32=0.08726647, f32=6.283185
// 0x10005f8a  nCollideObject::VisualizeGlobal  (530 insns)
//   consts:  f32=0.5
// 0x100064fa  nCollideObject::nCollideObject()  (83 insns)
// 0x100065f1  nCollideObject::operator=  (11 insns)
// 0x10006605  nCollideObject::~nCollideObject()  (124 insns)
//   strings: '/sys/servers/collide', 'avoid', 'proximity', 'missile'
// 0x1000cd0c  nCollideObject::GetId  (2 insns)
// 0x1000cd10  nCollideObject::GetCollClass  (2 insns)

} // namespace re_nnomads
