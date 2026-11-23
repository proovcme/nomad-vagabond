#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nClouds.asm
// Class: nClouds : public nvisnode  (sizeof = 0x154 = 340 bytes)

#include <cstdint>

namespace re_nnature {

struct nClouds_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x0074
    float field_0x0074;
    // +0x0078
    float field_0x0078;
    // +0x0080
    uint32_t field_0x0080;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00f0
    uint32_t field_0x00f0;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0118
    uint32_t field_0x0118;
    // +0x011c
    uint32_t field_0x011c;
    // +0x0120
    uint32_t field_0x0120;
    // +0x0124
    uint8_t field_0x0124;
    // +0x0125
    uint8_t field_0x0125;
    // +0x0128
    uint32_t field_0x0128;
    // +0x012c
    uint32_t field_0x012c;
    // +0x0130
    float field_0x0130;
    // +0x0134
    float field_0x0134;
    // +0x0138
    uint32_t field_0x0138;
    // +0x013c
    uint32_t field_0x013c;
    // +0x0140
    uint32_t field_0x0140;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    float field_0x0148;
    // +0x014c
    float field_0x014c;
    // +0x0150
    float field_0x0150;
};

// Script AddCmds (7):
//   v_beginclouds_if
//   v_endclouds_v
//   v_setlayernearfadedist_f
//   i_getlayerdensity_v
//   f_getlayerspacing_v
//   f_getlayerextent_v
//   f_getlayernearfadedist_v

// Methods (58):
// 0x1000a5ff  nClouds::n_init_nclouds  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nvisnode', 'Could not open superclass nvisnode!', 'nature/nclouds_init.cc'
// 0x1000a65a  nClouds::n_fini_nclouds  (14 insns)
// 0x1000a67d  nClouds::n_new_nclouds  (10 insns)
//   calls:   -> nClouds::nClouds()
// 0x1000a697  nClouds::n_version_nclouds  (2 insns)
// 0x1000acd3  nClouds::nClouds()  (66 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1000addf  nClouds::operator=  (63 insns)
//   calls:   -> nVisNode::operator=
// 0x1000af44  nClouds::GetLayerDensity  (2 insns)
// 0x1000af4b  nClouds::GetLayerSpacing  (2 insns)
// 0x1000af52  nClouds::GetLayerExtent  (2 insns)
// 0x1000af59  nClouds::GetLayerNearFadeDist  (2 insns)
// 0x1000af60  nClouds::GetGridOrigin  (7 insns)
// 0x1000af7b  nClouds::GetCloudAt  (13 insns)
//   calls:   -> nCloudDescData::nCloudDescData()
// 0x1000afa9  nClouds::GetCloudGridPosAt  (14 insns)
// 0x1000afd9  nClouds::GetCloudWorldPosAt  (12 insns)
//   calls:   -> nCloudDescData::GetWorldPosition
// 0x1000b006  nClouds::GetCloudAltAt  (9 insns)
// 0x1000b028  nClouds::GetCloudFogClrAt  (18 insns)
// 0x1000b064  nClouds::GetCloudFogModAt  (9 insns)
// 0x1000b086  nClouds::GetCloudSizeAt  (16 insns)
// 0x1000b0bc  nClouds::GetCloudQuadOffsetAt  (16 insns)
// 0x1000b0f2  nClouds::GetCloudOffsetModAt  (16 insns)
// 0x1000b128  nClouds::GetCloudOffsetAt  (16 insns)
// 0x1000b15e  nClouds::GetCloudOpacityModAt  (9 insns)
// 0x1000b180  nClouds::nClouds()  (63 insns)
//   strings: '/sys/servers/gfx', '/sys/servers/specialfx'
// 0x1000b28c  nClouds::~nClouds()  (39 insns)
// 0x1000b30c  nClouds::BeginClouds  (88 insns)
//   calls:   -> nCloudDescData::nCloudDescData(), -> nCloudDescData::~nCloudDescData()
// 0x1000b430  nClouds::EndClouds  (2 insns)
// 0x1000b438  nClouds::SetLayerNearFadeDist  (4 insns)
// 0x1000b447  nClouds::SetGridOrigin  (6 insns)
// 0x1000b45f  nClouds::SetCloudAt  (12 insns)
// 0x1000b489  nClouds::SetCloudAltAt  (11 insns)
// 0x1000b4b1  nClouds::SetCloudFogClrAt  (18 insns)
// 0x1000b4df  nClouds::SetCloudFogModAt  (11 insns)
// 0x1000b507  nClouds::SetCloudSizeAt  (11 insns)
//   calls:   -> nCloudDescData::SetSize
// 0x1000b530  nClouds::SetCloudOffsetAt  (17 insns)
// 0x1000b55d  nClouds::SetCloudQuadOffsetAt  (17 insns)
// 0x1000b58a  nClouds::SetCloudOpacityModAt  (11 insns)
// 0x1000b5b2  nClouds::Attach  (24 insns)
//   calls:   -> nAnimNode::vfunc_14
// 0x1000b5f9  nClouds::Compute  (39 insns)
//   calls:   -> nAnimNode::vfunc_15
// 0x1000b675  nClouds::InitVBuffer  (169 insns)
//   strings: 'nclouds_ibuf'
// 0x1000b850  nClouds::UpdateVBuffer  (222 insns)
//   calls:   -> nCloudDescData::nCloudDescData(), -> nCloudDescData::~nCloudDescData()
//   consts:  f32=0.7071068, f32=-0.7071068
// 0x1000baf9  nClouds::CalcCoord  (305 insns)
//   calls:   -> nCloudDescData::GetWorldPosition, -> nCloudDescData::GetWorldCG, -> nVertexBuffer::Coord
//   consts:  f32=0.5
// 0x1000be81  nClouds::CalcRGBA  (272 insns)
//   calls:   -> nCloudDescData::GetWorldCG
//   consts:  f32=0, f32=10, f32=255
// 0x1000c1e1  nClouds::CalcNormals  (218 insns)
//   calls:   -> nVertexBuffer::Norm
//   consts:  f32=0.7071068, f32=-0.7071068
// 0x1000c481  nClouds::CalcUVCoords  (165 insns)
//   calls:   -> nVertexBuffer::Uv
//   consts:  f32=0.5, f32=0.25, f32=0.75
// 0x1000c6c3  nClouds::ViewerInCloud  (43 insns)
//   calls:   -> nCloudDescData::GetWorldBBox
// 0x1000c722  nClouds::CalcFoggingColor  (75 insns)
//   calls:   -> nCloudDescData::GetWorldPosition
//   consts:  f32=0.5, f32=1
// 0x1000c7f1  nClouds::CalcViewerPos  (32 insns)
// 0x1000c842  nClouds::CalcViewerDir  (32 insns)
// 0x1000c893  nClouds::UpdateGrid  (95 insns)
//   consts:  f32=0.5
// 0x1000c9be  nClouds::UpdateFade  (147 insns)
//   calls:   -> nCloudDescData::GetWorldPosition
//   consts:  f32=0.5, f32=1
//   strings: 'v_beginclouds_if', 'v_endclouds_v', 'v_setlayernearfadedist_f', 'i_getlayerdensity_v', 'f_getlayerspacing_v', 'f_getlayerextent_v', 'f_getlayernearfadedist_v'
// 0x1000cba1  nClouds::cmd_beginclouds (v_beginclouds_if)  (27 insns)
// 0x1000cbe8  nClouds::cmd_endclouds (v_endclouds_v)  (3 insns)
// 0x1000cbf1  nClouds::cmd_setlayernearfadedist (v_setlayernearfadedist_f)  (16 insns)
//   calls:   -> nClouds::SetLayerNearFadeDist
// 0x1000cc1d  nClouds::cmd_getlayerdensity (i_getlayerdensity_v)  (13 insns)
// 0x1000cc49  nClouds::cmd_getlayerspacing (f_getlayerspacing_v)  (11 insns)
// 0x1000cc73  nClouds::cmd_getlayerextent (f_getlayerextent_v)  (11 insns)
// 0x1000cc9d  nClouds::cmd_getlayernearfadedist (f_getlayernearfadedist_v)  (11 insns)
// 0x1000ccc7  nClouds::SaveCmds  (72 insns)
//   calls:   -> nClass::vfunc_36

} // namespace re_nnature
