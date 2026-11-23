#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nCloudDescData.asm
// Class: nCloudDescData

#include <cstdint>

namespace re_nnature {

struct nCloudDescData_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0005
    uint8_t field_0x0005;
    // +0x0006
    uint8_t field_0x0006;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x003c
    float field_0x003c;
    // +0x0040
    float field_0x0040;
    // +0x0044
    float field_0x0044;
    // +0x0048
    float field_0x0048;
    // +0x004c
    float field_0x004c;
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
    // +0x0068
    float field_0x0068;
    // +0x006c
    float field_0x006c;
    // +0x0070
    float field_0x0070;
    // +0x0074
    float field_0x0074;
    // +0x0078
    float field_0x0078;
    // +0x007c
    float field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
};

// Methods (34):
// 0x100056a5  nCloudDescData::Delete  (67 insns)
// 0x1000a69d  nCloudDescData::nCloudDescData()  (74 insns)
//   calls:   -> nCloudDescData::SetSize
//   consts:  f32=100
// 0x1000a75e  nCloudDescData::vfunc_00  (41 insns)
//   calls:   -> nCloudDescData::~nCloudDescData()
// 0x1000a7bf  nCloudDescData::nCloudDescData()  (52 insns)
//   calls:   -> nCloudDescData::Copy
// 0x1000a847  nCloudDescData::SetGridPosition  (6 insns)
// 0x1000a859  nCloudDescData::SetAltitude  (4 insns)
// 0x1000a865  nCloudDescData::SetFoggingColor  (11 insns)
// 0x1000a877  nCloudDescData::SetFoggingMod  (4 insns)
// 0x1000a883  nCloudDescData::SetSize  (33 insns)
//   consts:  f32=-0.5, f32=0.5
// 0x1000a8d4  nCloudDescData::SetOffset  (10 insns)
// 0x1000a8e5  nCloudDescData::SetOffsetMod  (10 insns)
// 0x1000a8f6  nCloudDescData::SetOffsetSpeed  (4 insns)
// 0x1000a902  nCloudDescData::SetQuadOffset  (10 insns)
// 0x1000a913  nCloudDescData::SetOpacityMod  (4 insns)
// 0x1000a91f  nCloudDescData::SetFadeMod  (4 insns)
// 0x1000a92b  nCloudDescData::SetWind  (6 insns)
// 0x1000a940  nCloudDescData::GetGridPosition  (6 insns)
// 0x1000a952  nCloudDescData::GetWorldPosition  (19 insns)
// 0x1000a983  nCloudDescData::GetWorldCG  (28 insns)
//   calls:   -> nCloudDescData::GetWorldPosition
// 0x1000a9ca  nCloudDescData::GetWorldBBox  (37 insns)
//   calls:   -> nCloudDescData::GetWorldPosition
// 0x1000aa30  nCloudDescData::GetAltitude  (2 insns)
// 0x1000aa34  nCloudDescData::GetFoggingColor  (10 insns)
// 0x1000aa52  nCloudDescData::GetFoggingMod  (2 insns)
// 0x1000aa56  nCloudDescData::GetOffset  (8 insns)
// 0x1000aa6e  nCloudDescData::GetOffsetMod  (8 insns)
// 0x1000aa86  nCloudDescData::GetOffsetSpeed  (2 insns)
// 0x1000aa8a  nCloudDescData::GetQuadOffset  (8 insns)
// 0x1000aaa2  nCloudDescData::GetOpacityMod  (2 insns)
// 0x1000aaa6  nCloudDescData::GetFadeMod  (2 insns)
// 0x1000aaaa  nCloudDescData::GetWind  (7 insns)
// 0x1000dbc7  nCloudDescData::~nCloudDescData()  (2 insns)
// 0x1000dbce  nCloudDescData::operator=  (13 insns)
// 0x1000dbed  nCloudDescData::Zero  (70 insns)
//   calls:   -> nCloudDescData::SetSize
// 0x1000dc86  nCloudDescData::Copy  (60 insns)
//   calls:   -> nCloudDescData::SetSize

} // namespace re_nnature
