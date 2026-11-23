#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nCloudDesc.asm
// Class: nCloudDesc : public nvisnode  (sizeof = 0x120 = 288 bytes)

#include <cstdint>

namespace re_nnature {

struct nCloudDesc_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0034
    uint32_t field_0x0034;
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
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e0
    float field_0x00e0;
    // +0x00ec
    float field_0x00ec;
    // +0x00f0
    uint32_t field_0x00f0;
    // +0x00f4
    uint32_t field_0x00f4;
    // +0x00f8
    float field_0x00f8;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0104
    float field_0x0104;
    // +0x0110
    float field_0x0110;
    // +0x0114
    float field_0x0114;
    // +0x0118
    float field_0x0118;
    // +0x011c
    uint32_t field_0x011c;
};

// Script AddCmds (19):
//   v_setaltitude_f
//   v_setfoggingcolor_ffff
//   v_setfoggingmod_f
//   v_setsize_fff
//   v_setsizex_f
//   v_setsizey_f
//   v_setsizez_f
//   v_setquadoffset_fff
//   v_setoffsetmod_fff
//   v_setoffsetmodx_f
//   v_setoffsetmody_f
//   v_setoffsetmodz_f
//   v_setoffsetspeed_f
//   v_setopacitymod_f
//   v_setwind_ff
//   f_getaltitude_v
//   f_getfoggingmod_v
//   f_getoffsetspeed_v
//   f_getopacitymod_v

// Methods (59):
// 0x100068d1  nCloudDesc::cmd_getfoggingmod (f_getfoggingmod_v)  (11 insns)
// 0x1000aabf  nCloudDesc::nCloudDesc()  (15 insns)
//   calls:   -> nVisNode::nVisNode(), -> nCloudDescData::nCloudDescData()
// 0x1000aaec  nCloudDesc::operator=  (15 insns)
//   calls:   -> nVisNode::operator=
// 0x1000ab17  nCloudDesc::vfunc_00  (41 insns)
//   calls:   -> nCloudDesc::~nCloudDesc()
// 0x1000ab76  nCloudDesc::GetData  (6 insns)
//   calls:   -> nCloudDescData::nCloudDescData()
// 0x1000ab8d  nCloudDesc::GetGridPosition  (7 insns)
// 0x1000aba8  nCloudDesc::GetWorldPosition  (5 insns)
//   calls:   -> nCloudDescData::GetWorldPosition
// 0x1000abbe  nCloudDesc::GetWorldCG  (5 insns)
//   calls:   -> nCloudDescData::GetWorldCG
// 0x1000abd4  nCloudDesc::GetWorldBBox  (5 insns)
//   calls:   -> nCloudDescData::GetWorldBBox
// 0x1000abea  nCloudDesc::GetAltitude  (2 insns)
// 0x1000abf1  nCloudDesc::GetFoggingColor  (11 insns)
// 0x1000ac18  nCloudDesc::GetFoggingMod  (2 insns)
// 0x1000ac1f  nCloudDesc::GetSize  (9 insns)
// 0x1000ac40  nCloudDesc::GetOffset  (9 insns)
// 0x1000ac61  nCloudDesc::GetOffsetMod  (9 insns)
// 0x1000ac82  nCloudDesc::GetOffsetSpeed  (2 insns)
// 0x1000ac89  nCloudDesc::GetQuadOffset  (9 insns)
// 0x1000acaa  nCloudDesc::GetOpacityMod  (2 insns)
// 0x1000acb1  nCloudDesc::GetFadeMod  (2 insns)
// 0x1000acb8  nCloudDesc::GetWind  (7 insns)
// 0x1000aee3  nCloudDesc::vfunc_21  (41 insns)
//   calls:   -> nClouds::~nClouds()
// 0x1000cd96  nCloudDesc::n_init_nclouddesc  (15 insns)
//   strings: 'nvisnode'
// 0x1000cdc1  nCloudDesc::n_fini_nclouddesc  (5 insns)
// 0x1000cdd3  nCloudDesc::n_new_nclouddesc  (10 insns)
//   calls:   -> nCloudDesc::nCloudDesc()
// 0x1000cded  nCloudDesc::n_version_nclouddesc  (2 insns)
// 0x1000cdf3  nCloudDesc::nCloudDesc()  (9 insns)
//   calls:   -> nCloudDescData::nCloudDescData()
// 0x1000ce10  nCloudDesc::~nCloudDesc()  (9 insns)
//   calls:   -> nCloudDescData::~nCloudDescData()
// 0x1000ce2d  nCloudDesc::Initialize  (26 insns)
//   calls:   -> nAnimNode::vfunc_01
//   strings: 'nvisnode'
// 0x1000ce68  nCloudDesc::SetGridPosition  (6 insns)
// 0x1000ce80  nCloudDesc::SetAltitude  (4 insns)
// 0x1000ce8f  nCloudDesc::SetFoggingColor  (11 insns)
// 0x1000cea4  nCloudDesc::SetFoggingMod  (4 insns)
// 0x1000ceb3  nCloudDesc::SetSize  (4 insns)
//   calls:   -> nCloudDescData::SetSize
// 0x1000cec5  nCloudDesc::SetOffset  (10 insns)
// 0x1000ced9  nCloudDesc::SetOffsetMod  (10 insns)
// 0x1000ceed  nCloudDesc::SetOffsetSpeed  (4 insns)
// 0x1000cefc  nCloudDesc::SetQuadOffset  (10 insns)
// 0x1000cf10  nCloudDesc::SetOpacityMod  (4 insns)
// 0x1000cf1f  nCloudDesc::SetFadeMod  (4 insns)
// 0x1000cf2e  nCloudDesc::SetWind  (134 insns)
//   strings: 'v_setaltitude_f', 'v_setfoggingcolor_ffff', 'v_setfoggingmod_f', 'v_setsize_fff', 'v_setsizex_f', 'v_setsizey_f', 'v_setsizez_f', 'v_setquadoffset_fff'
// 0x1000d16b  nCloudDesc::cmd_setaltitude (v_setaltitude_f)  (16 insns)
//   calls:   -> nCloudDesc::SetAltitude
// 0x1000d197  nCloudDesc::cmd_setfoggingcolor (v_setfoggingcolor_ffff)  (34 insns)
//   calls:   -> nCloudDesc::SetFoggingColor
// 0x1000d200  nCloudDesc::cmd_setfoggingmod (v_setfoggingmod_f)  (16 insns)
//   calls:   -> nCloudDesc::SetFoggingMod
// 0x1000d22c  nCloudDesc::cmd_setsize (v_setsize_fff)  (28 insns)
//   calls:   -> nCloudDesc::SetSize
// 0x1000d281  nCloudDesc::cmd_setsizex (v_setsizex_f)  (21 insns)
//   calls:   -> nCloudDesc::SetSize
// 0x1000d2c3  nCloudDesc::cmd_setsizey (v_setsizey_f)  (22 insns)
//   calls:   -> nCloudDesc::SetSize
// 0x1000d308  nCloudDesc::cmd_setsizez (v_setsizez_f)  (22 insns)
//   calls:   -> nCloudDesc::SetSize
// 0x1000d34d  nCloudDesc::cmd_setoffsetmod (v_setoffsetmod_fff)  (28 insns)
//   calls:   -> nCloudDesc::SetOffsetMod
// 0x1000d3a2  nCloudDesc::cmd_setoffsetmodx (v_setoffsetmodx_f)  (21 insns)
//   calls:   -> nCloudDesc::SetOffsetMod
// 0x1000d3e4  nCloudDesc::cmd_setoffsetmody (v_setoffsetmody_f)  (22 insns)
//   calls:   -> nCloudDesc::SetOffsetMod
// 0x1000d429  nCloudDesc::cmd_setoffsetmodz (v_setoffsetmodz_f)  (22 insns)
//   calls:   -> nCloudDesc::SetOffsetMod
// 0x1000d46e  nCloudDesc::cmd_setoffsetspeed (v_setoffsetspeed_f)  (16 insns)
//   calls:   -> nCloudDesc::SetOffsetSpeed
// 0x1000d49a  nCloudDesc::cmd_setquadoffset (v_setquadoffset_fff)  (28 insns)
//   calls:   -> nCloudDesc::SetQuadOffset
// 0x1000d4ef  nCloudDesc::cmd_setopacitymod (v_setopacitymod_f)  (16 insns)
//   calls:   -> nCloudDesc::SetOpacityMod
// 0x1000d51b  nCloudDesc::cmd_setwind (v_setwind_ff)  (22 insns)
//   calls:   -> nCloudDesc::SetWind
// 0x1000d558  nCloudDesc::cmd_getaltitude (f_getaltitude_v)  (135 insns)
//   calls:   -> nCloudDesc::GetFoggingColor
// 0x1000d6ee  nCloudDesc::cmd_getoffsetspeed (f_getoffsetspeed_v)  (48 insns)
// 0x1000d78a  nCloudDesc::cmd_getopacitymod (f_getopacitymod_v)  (40 insns)
// 0x1000d804  nCloudDesc::SaveCmds  (326 insns)
//   calls:   -> nClass::vfunc_36

} // namespace re_nnature
