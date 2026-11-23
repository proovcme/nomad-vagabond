#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nCloudDescData.asm
// Class: nCloudDescData

#include <cstdint>

namespace re_nnomads {

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

// Methods (33):
// 0x1000b887  nCloudDescData::nCloudDescData()  (74 insns)
//   calls:   -> nCloudDescData::SetSize
//   consts:  f32=100
// 0x1000b948  nCloudDescData::vfunc_00  (41 insns)
// 0x1000b9a9  nCloudDescData::nCloudDescData()  (52 insns)
//   calls:   -> nCloudDescData::vfunc_02
// 0x1000ba31  nCloudDescData::SetGridPosition  (6 insns)
// 0x1000ba43  nCloudDescData::SetAltitude  (4 insns)
// 0x1000ba4f  nCloudDescData::SetFoggingColor  (11 insns)
// 0x1000ba61  nCloudDescData::SetFoggingMod  (4 insns)
// 0x1000ba6d  nCloudDescData::SetSize  (33 insns)
//   consts:  f32=-0.5, f32=0.5
// 0x1000babe  nCloudDescData::SetOffset  (10 insns)
// 0x1000bacf  nCloudDescData::SetOffsetMod  (10 insns)
// 0x1000bae0  nCloudDescData::SetOffsetSpeed  (4 insns)
// 0x1000baec  nCloudDescData::SetQuadOffset  (10 insns)
// 0x1000bafd  nCloudDescData::SetOpacityMod  (4 insns)
// 0x1000bb09  nCloudDescData::SetFadeMod  (4 insns)
// 0x1000bb15  nCloudDescData::SetWind  (6 insns)
// 0x1000bb2a  nCloudDescData::GetGridPosition  (6 insns)
// 0x1000bb3c  nCloudDescData::GetWorldPosition  (19 insns)
// 0x1000bb6d  nCloudDescData::GetWorldCG  (28 insns)
//   calls:   -> nCloudDescData::GetWorldPosition
// 0x1000bbb4  nCloudDescData::GetWorldBBox  (52 insns)
//   calls:   -> nCloudDescData::GetWorldPosition
// 0x1000bc45  nCloudDescData::GetAltitude  (2 insns)
// 0x1000bc49  nCloudDescData::GetFoggingColor  (10 insns)
// 0x1000bc67  nCloudDescData::GetFoggingMod  (2 insns)
// 0x1000bc6b  nCloudDescData::GetOffset  (8 insns)
// 0x1000bc83  nCloudDescData::GetOffsetMod  (8 insns)
// 0x1000bc9b  nCloudDescData::GetOffsetSpeed  (2 insns)
// 0x1000bc9f  nCloudDescData::GetQuadOffset  (8 insns)
// 0x1000bcb7  nCloudDescData::GetOpacityMod  (2 insns)
// 0x1000bcbb  nCloudDescData::GetFadeMod  (2 insns)
// 0x1000bcbf  nCloudDescData::GetWind  (7 insns)
// 0x10079eca  nCloudDescData::vfunc_04  (1 insns)
//   calls:   IAT: nnature.dll!nCloudDescData::Zero
// 0x10079ed0  nCloudDescData::vfunc_03  (1 insns)
//   calls:   IAT: nnature.dll!nCloudDescData::operator=
// 0x10079ed6  nCloudDescData::vfunc_02  (1 insns)
//   calls:   IAT: nnature.dll!nCloudDescData::Copy
// 0x10079edc  nCloudDescData::vfunc_01  (2 insns)
//   calls:   IAT: nnature.dll!nCloudDescData::Delete, IAT: nnature.dll!nCloudDescData::~nCloudDescData()

} // namespace re_nnomads
