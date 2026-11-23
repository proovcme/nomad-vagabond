#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nCollideContext.asm
// Class: nCollideContext

#include <cstdint>

namespace re_nnomads {

struct nCollideContext_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0838
    uint32_t field_0x0838;
    // +0x0860
    uint32_t field_0x0860;
};

// Methods (33):
// 0x10004ac2  nCollideContext::nCollideContext()  (44 insns)
// 0x10004b4b  nCollideContext::operator=  (43 insns)
// 0x10004bce  nCollideContext::vfunc_00  (41 insns)
// 0x10004c2f  nCollideContext::nCollideContext()  (87 insns)
// 0x10004d15  nCollideContext::GetCollideServer  (2 insns)
// 0x10004d86  nCollideContext::vfunc_11  (41 insns)
// 0x10004fc9  nCollideContext::vfunc_21  (41 insns)
// 0x10079b2e  nCollideContext::vfunc_10  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::SphereCheck
// 0x10079b34  nCollideContext::vfunc_09  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::LineCheck
// 0x10079b3a  nCollideContext::vfunc_08  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::MovingSphereCheck
// 0x10079b40  nCollideContext::vfunc_07  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::GetCollissions
// 0x10079b46  nCollideContext::vfunc_06  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::Visualize
// 0x10079b4c  nCollideContext::vfunc_05  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::Collide
// 0x10079b52  nCollideContext::vfunc_04  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::RemObject
// 0x10079b58  nCollideContext::vfunc_03  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::AddObject
// 0x10079b5e  nCollideContext::vfunc_02  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::ReleaseObject
// 0x10079b64  nCollideContext::vfunc_01  (2 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::NewObject, IAT: ncollide.dll!nCollideContext::~nCollideContext()
// 0x10079b70  nCollideContext::vfunc_20  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::Visualize
// 0x10079b76  nCollideContext::vfunc_19  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::SphereCheck
// 0x10079b7c  nCollideContext::vfunc_18  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::LineCheck
// 0x10079b82  nCollideContext::vfunc_17  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::Collide
// 0x10079b88  nCollideContext::vfunc_16  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::Load
// 0x10079b8e  nCollideContext::vfunc_15  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::End
// 0x10079b94  nCollideContext::vfunc_14  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::SetTriangle
// 0x10079b9a  nCollideContext::vfunc_13  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::SetVertex
// 0x10079ba0  nCollideContext::vfunc_12  (2 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::Begin, IAT: ncollide.dll!nCollideShape::~nCollideShape()
// 0x10079bac  nCollideContext::vfunc_41  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::QueryCollType
// 0x10079bb2  nCollideContext::vfunc_40  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::QueryCollClass
// 0x10079bb8  nCollideContext::vfunc_39  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::GetDefaultContext
// 0x10079bbe  nCollideContext::vfunc_38  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::ReleaseShape
// 0x10079bc4  nCollideContext::vfunc_37  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::ReleaseContext
// 0x10079bca  nCollideContext::vfunc_36  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::NewShape
// 0x10079bd0  nCollideContext::vfunc_35  (3 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::NewContext, IAT: ncollide.dll!nCollideServer::~nCollideServer(), IAT: ncollide.dll!nCollideContext::Reset

} // namespace re_nnomads
