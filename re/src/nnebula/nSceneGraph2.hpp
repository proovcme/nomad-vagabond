#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nSceneGraph2.asm
// Class: nSceneGraph2 : public nroot

#include <cstdint>

namespace re_nnebula {

struct nSceneGraph2_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0048
    float field_0x0048;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint8_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0098
    uint32_t field_0x0098;
    // +0x00a4
    uint8_t field_0x00a4;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x00b6
    uint32_t field_0x00b6;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00ba
    uint32_t field_0x00ba;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00be
    uint32_t field_0x00be;
    // +0x1240
    uint8_t field_0x1240;
    // +0x1244
    uint32_t field_0x1244;
    // +0x1248
    uint32_t field_0x1248;
    // +0x124c
    uint32_t field_0x124c;
    // +0x144e
    uint32_t field_0x144e;
};

// Script AddCmds (5):
//   v_setenablemiplod_b
//   b_getenablemiplod_v
//   v_beginmiplod_i
//   v_setmiplod_if
//   v_endmiplod_v

// Methods (58):
// 0x1000dd59  nSceneGraph2::n_init_nscenegraph2  (15 insns)
//   strings: 'nroot'
// 0x1000dd84  nSceneGraph2::n_fini_nscenegraph2  (5 insns)
// 0x1000dd96  nSceneGraph2::n_new_nscenegraph2  (10 insns)
//   calls:   -> nSceneGraph2::nSceneGraph2()
// 0x1000ddb0  nSceneGraph2::nSceneGraph2()  (119 insns)
//   strings: '/sys/servers/gfx', '/sys/servers/channel', '/sys/servers/audio', '/sys/servers/shadow'
// 0x1000df5b  nSceneGraph2::~nSceneGraph2()  (41 insns)
// 0x1000dfd2  nSceneGraph2::BeginScene  (30 insns)
//   calls:   -> nChannelServer::BeginScene, -> nSceneGraph2::BeginNode
// 0x1000e048  nSceneGraph2::Attach  (8 insns)
// 0x1000e061  nSceneGraph2::EndScene  (14 insns)
//   calls:   -> nSceneGraph2::EndNode, -> nSceneGraph2::RenderScene, -> nChannelServer::EndScene
// 0x1000e091  nSceneGraph2::BeginNode  (38 insns)
//   calls:   -> nSceneGraph2::PushNode, IAT: nkernel.dll!n_printf, -> nSceneGraph2::NewNodeFromPool
// 0x1000e119  nSceneGraph2::EndNode  (6 insns)
// 0x1000e2a2  nSceneGraph2::nSceneGraph2()  (95 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000e428  nSceneGraph2::operator=  (109 insns)
//   calls:   -> nRoot::operator=
// 0x1000e5b7  nSceneGraph2::vfunc_00  (87 insns)
//   calls:   -> nSceneGraph2::~nSceneGraph2()
// 0x1000e698  nSceneGraph2::ResetNodePool  (2 insns)
// 0x1000e6a1  nSceneGraph2::NewNodeFromPool  (25 insns)
// 0x1000e6ee  nSceneGraph2::PushNode  (11 insns)
// 0x1000e71b  nSceneGraph2::PopNode  (5 insns)
// 0x1000e734  nSceneGraph2::NodeStackEmpty  (4 insns)
// 0x1000e741  nSceneGraph2::AttachTransformNode  (6 insns)
// 0x1000e750  nSceneGraph2::AttachMeshNode  (5 insns)
// 0x1000e768  nSceneGraph2::AttachSoundNode  (5 insns)
// 0x1000e780  nSceneGraph2::AttachVisualNode  (5 insns)
// 0x1000e798  nSceneGraph2::AttachOpaqueness  (11 insns)
// 0x1000e7cf  nSceneGraph2::AttachRenderPri  (5 insns)
// 0x1000e7e9  nSceneGraph2::AttachAmbientFogNode  (5 insns)
// 0x1000e804  nSceneGraph2::AttachAmbientListenerNode  (5 insns)
// 0x1000e81f  nSceneGraph2::SetTransform  (12 insns)
// 0x1000e840  nSceneGraph2::GetTransform  (4 insns)
// 0x1000e852  nSceneGraph2::GetParentTransform  (6 insns)
// 0x1000e86f  nSceneGraph2::GetRenderContext  (4 insns)
// 0x1000e881  nSceneGraph2::GetVertexBuffer  (4 insns)
// 0x1000e893  nSceneGraph2::SetIndexBuffer  (5 insns)
// 0x1000e8ab  nSceneGraph2::GetIndexBuffer  (4 insns)
// 0x1000e8bd  nSceneGraph2::AttachTexArrayNode  (5 insns)
// 0x1000e8d5  nSceneGraph2::GetTextureArray  (4 insns)
// 0x1000e8e7  nSceneGraph2::AttachShaderNode  (5 insns)
// 0x1000e8ff  nSceneGraph2::GetPixelShader  (4 insns)
// 0x1000e911  nSceneGraph2::AttachLightNode  (5 insns)
// 0x1000e929  nSceneGraph2::GetLight  (4 insns)
// 0x1000e93b  nSceneGraph2::SetShadowCaster  (5 insns)
// 0x1000e953  nSceneGraph2::GetShadowCaster  (4 insns)
// 0x1000e965  nSceneGraph2::SetChannelContext  (5 insns)
// 0x1000e97d  nSceneGraph2::GetChannelContext  (4 insns)
// 0x1000e98f  nSceneGraph2::ResetMipLevel  (50 insns)
// 0x1000ea03  nSceneGraph2::AdjustMipLevel  (58 insns)
// 0x1000ea87  nSceneGraph2::TransformAndSplitNodes  (153 insns)
//   calls:   -> nMeshNode::GetVertexBuffer
//   consts:  f32=0
// 0x1000ec63  nSceneGraph2::RenderLights  (59 insns)
//   calls:   -> nShadowServer::GetCastShadows
// 0x1000ed23  nSceneGraph2::RenderSounds  (31 insns)
// 0x1000ed8e  nSceneGraph2::SortGeoNodes  (81 insns)
//   calls:   -> nSceneGraph2::ResetMipLevel, -> nSceneGraph2::AdjustMipLevel, IAT: MSVCRT.dll!qsort
// 0x1000ee93  nSceneGraph2::RenderScene  (164 insns)
//   calls:   -> nShadowServer::GetCastShadows, -> nSceneGraph2::TransformAndSplitNodes, -> nSceneGraph2::RenderLights, -> nSceneGraph2::RenderSounds, -> nSceneGraph2::SortGeoNodes
// 0x1000f46d  nSceneGraph2::SetEnableMipLod  (3 insns)
// 0x1000f47a  nSceneGraph2::GetEnableMipLod  (2 insns)
// 0x1000f481  nSceneGraph2::BeginMipLod  (18 insns)
// 0x1000f4ba  nSceneGraph2::SetMipLod  (38 insns)
//   strings: 'v_setenablemiplod_b', 'b_getenablemiplod_v', 'v_beginmiplod_i', 'v_setmiplod_if', 'v_endmiplod_v'
// 0x1000f551  nSceneGraph2::cmd_setenablemiplod (v_setenablemiplod_b)  (12 insns)
//   calls:   -> nSceneGraph2::SetEnableMipLod
// 0x1000f577  nSceneGraph2::cmd_getenablemiplod (b_getenablemiplod_v)  (13 insns)
//   calls:   -> nSceneGraph2::GetEnableMipLod
// 0x1000f5a2  nSceneGraph2::cmd_beginmiplod (v_beginmiplod_i)  (10 insns)
//   calls:   -> nSceneGraph2::BeginMipLod
// 0x1000f5c5  nSceneGraph2::cmd_setmiplod (v_setmiplod_if)  (18 insns)
//   calls:   -> nSceneGraph2::SetMipLod

} // namespace re_nnebula
