#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nCollideObject.asm
// Class: nCollideObject

#include <cstdint>

namespace re_ncollide {

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
    // +0x0024
    float field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
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

// Methods (31):
// 0x10004f92  nCollideObject::nCollideObject()  (73 insns)
// 0x10005059  nCollideObject::SetVisualizeColor  (11 insns)
// 0x1000506e  nCollideObject::GetVisualizeColor  (2 insns)
// 0x10005075  nCollideObject::SetContext  (9 insns)
// 0x10005092  nCollideObject::GetContext  (2 insns)
// 0x10005096  nCollideObject::SetId  (3 insns)
// 0x100050a0  nCollideObject::GetId  (2 insns)
// 0x100050a4  nCollideObject::SetAttached  (3 insns)
// 0x100050b1  nCollideObject::IsAttached  (2 insns)
// 0x100050b8  nCollideObject::SetRadius  (3 insns)
// 0x100050c2  nCollideObject::GetRadius  (2 insns)
// 0x100050c6  nCollideObject::SetShape  (9 insns)
// 0x100050de  nCollideObject::SetCollClass  (3 insns)
// 0x100050e8  nCollideObject::GetCollClass  (2 insns)
// 0x100050ec  nCollideObject::SetClientData  (3 insns)
// 0x100050f9  nCollideObject::GetClientData  (2 insns)
// 0x10005100  nCollideObject::GetTransform  (2 insns)
// 0x10005107  nCollideObject::GetPrevTransform  (2 insns)
// 0x1000510b  nCollideObject::GetTimeStamp  (2 insns)
// 0x10005112  nCollideObject::GetPrevTimeStamp  (2 insns)
// 0x10005119  nCollideObject::ClearCollissions  (2 insns)
// 0x10005121  nCollideObject::GetNumCollissions  (2 insns)
// 0x10005128  nCollideObject::Transform  (124 insns)
//   consts:  f64=0
// 0x10005275  nCollideObject::Contact  (383 insns)
//   consts:  f32=0.125, f32=1, f32=0, f64=1e-07
// 0x100056eb  nCollideObject::Collide  (180 insns)
//   calls:   -> nCollideServer::QueryCollType, -> nCollideObject::Contact
// 0x100058a4  nCollideObject::GetCollissions  (6 insns)
// 0x100058b7  nCollideObject::VisualizeLocal  (179 insns)
//   consts:  f32=0.7, f32=0.08726647, f32=6.283185
// 0x10005a90  nCollideObject::VisualizeGlobal  (530 insns)
//   consts:  f32=0.5
// 0x10006000  nCollideObject::nCollideObject()  (83 insns)
// 0x100060f7  nCollideObject::operator=  (11 insns)
// 0x1000610b  nCollideObject::~nCollideObject()  (54 insns)
//   consts:  f32=1000000, f32=-1000000

} // namespace re_ncollide
