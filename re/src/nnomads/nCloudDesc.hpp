#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nCloudDesc.asm
// Class: nCloudDesc

#include <cstdint>

namespace re_nnomads {

struct nCloudDesc_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a4
    float field_0x00a4;
    // +0x00a8
    float field_0x00a8;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00d8
    float field_0x00d8;
    // +0x00e0
    float field_0x00e0;
    // +0x00ec
    float field_0x00ec;
    // +0x00f8
    float field_0x00f8;
    // +0x0104
    float field_0x0104;
    // +0x0114
    float field_0x0114;
    // +0x0118
    float field_0x0118;
};

// Script AddCmds (4):
//   v_settargetname_s
//   s_gettargetname_v
//   v_settargetradius_f
//   f_gettargetradius_v

// Methods (22):
// 0x1000c105  nCloudDesc::nCloudDesc()  (15 insns)
//   calls:   -> nVisNode::nVisNode(), -> nCloudDescData::nCloudDescData()
// 0x1000c132  nCloudDesc::operator=  (15 insns)
//   calls:   -> nVisNode::operator=
// 0x1000c15d  nCloudDesc::vfunc_00  (41 insns)
// 0x1000c1bc  nCloudDesc::GetData  (6 insns)
//   calls:   -> nCloudDescData::nCloudDescData()
// 0x1000c1d3  nCloudDesc::GetGridPosition  (7 insns)
// 0x1000c1ee  nCloudDesc::GetWorldPosition  (5 insns)
//   calls:   -> nCloudDescData::GetWorldPosition
// 0x1000c204  nCloudDesc::GetWorldCG  (5 insns)
//   calls:   -> nCloudDescData::GetWorldCG
// 0x1000c21a  nCloudDesc::GetWorldBBox  (5 insns)
//   calls:   -> nCloudDescData::GetWorldBBox
// 0x1000c230  nCloudDesc::GetAltitude  (2 insns)
// 0x1000c237  nCloudDesc::GetFoggingColor  (11 insns)
// 0x1000c25e  nCloudDesc::GetFoggingMod  (2 insns)
// 0x1000c265  nCloudDesc::GetSize  (9 insns)
// 0x1000c286  nCloudDesc::GetOffset  (9 insns)
// 0x1000c2a7  nCloudDesc::GetOffsetMod  (9 insns)
// 0x1000c2c8  nCloudDesc::GetOffsetSpeed  (2 insns)
// 0x1000c2cf  nCloudDesc::GetQuadOffset  (9 insns)
// 0x1000c2f0  nCloudDesc::GetWind  (7 insns)
// 0x1000c3cb  nCloudDesc::vfunc_21  (41 insns)
//   calls:   -> nWeatherDesc::~nWeatherDesc()
// 0x10068a4e  nCloudDesc::GetFadeMod  (30 insns)
//   strings: 'v_settargetname_s', 's_gettargetname_v', 'v_settargetradius_f', 'f_gettargetradius_v'
// 0x100798b2  nCloudDesc::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::AttachChannels
// 0x10079ee8  nCloudDesc::vfunc_11  (1 insns)
//   calls:   IAT: nnature.dll!nCloudDesc::SaveCmds
// 0x10079eee  nCloudDesc::vfunc_01  (12 insns)
//   calls:   IAT: nnature.dll!nCloudDesc::Initialize, IAT: nnature.dll!nCloudDesc::~nCloudDesc(), IAT: MSVCRT.dll!??3@YAXPAX@Z, IAT: MSVCRT.dll!_CIexp, IAT: MSVCRT.dll!??2@YAPAXI@Z, IAT: MSVCRT.dll!_ftol

} // namespace re_nnomads
