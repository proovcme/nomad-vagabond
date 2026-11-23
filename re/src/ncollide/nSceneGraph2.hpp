#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nSceneGraph2.asm
// Class: nSceneGraph2

#include <cstdint>

namespace re_ncollide {

struct nSceneGraph2_Layout {
    // +0x0004
    uint32_t field_0x0004;
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

// Script AddCmds (4):
//   v_setfilename_s
//   s_getfilename_v
//   v_setcollclass_s
//   s_getcollclass_v

// Methods (33):
// 0x10006960  nSceneGraph2::nSceneGraph2()  (95 insns)
//   calls:   -> nRoot::nRoot()
// 0x10006ae6  nSceneGraph2::operator=  (109 insns)
//   calls:   -> nRoot::operator=
// 0x10006c75  nSceneGraph2::vfunc_00  (87 insns)
// 0x10006d56  nSceneGraph2::ResetNodePool  (2 insns)
// 0x10006d5f  nSceneGraph2::NewNodeFromPool  (25 insns)
// 0x10006dac  nSceneGraph2::PushNode  (11 insns)
// 0x10006dd9  nSceneGraph2::PopNode  (5 insns)
// 0x10006df2  nSceneGraph2::NodeStackEmpty  (4 insns)
// 0x10006dff  nSceneGraph2::AttachTransformNode  (6 insns)
// 0x10006e0e  nSceneGraph2::AttachShaderNode  (5 insns)
// 0x10006e26  nSceneGraph2::AttachTexArrayNode  (5 insns)
// 0x10006e3e  nSceneGraph2::AttachLightNode  (5 insns)
// 0x10006e56  nSceneGraph2::AttachSoundNode  (5 insns)
// 0x10006e6e  nSceneGraph2::AttachVisualNode  (5 insns)
// 0x10006e86  nSceneGraph2::AttachOpaqueness  (11 insns)
// 0x10006ebd  nSceneGraph2::AttachRenderPri  (5 insns)
// 0x10006ed7  nSceneGraph2::AttachAmbientFogNode  (5 insns)
// 0x10006ef2  nSceneGraph2::AttachAmbientListenerNode  (5 insns)
// 0x10006f0d  nSceneGraph2::SetTransform  (12 insns)
// 0x10006f2e  nSceneGraph2::GetTransform  (4 insns)
// 0x10006f40  nSceneGraph2::GetParentTransform  (6 insns)
// 0x10006f5d  nSceneGraph2::GetRenderContext  (4 insns)
// 0x10006f6f  nSceneGraph2::AttachMeshNode  (5 insns)
// 0x10006f87  nSceneGraph2::GetVertexBuffer  (4 insns)
// 0x10006f99  nSceneGraph2::SetIndexBuffer  (5 insns)
// 0x10006fb1  nSceneGraph2::GetIndexBuffer  (4 insns)
// 0x10006fc3  nSceneGraph2::GetTextureArray  (4 insns)
// 0x10006fd5  nSceneGraph2::GetPixelShader  (4 insns)
// 0x10006fe7  nSceneGraph2::GetLight  (4 insns)
// 0x10006ff9  nSceneGraph2::SetShadowCaster  (5 insns)
// 0x10007011  nSceneGraph2::GetShadowCaster  (4 insns)
// 0x10007023  nSceneGraph2::SetChannelContext  (5 insns)
// 0x1000703b  nSceneGraph2::GetChannelContext  (66 insns)
//   calls:   IAT: nkernel.dll!n_free
//   strings: 'v_setfilename_s', 's_getfilename_v', 'v_setcollclass_s', 's_getcollclass_v'

} // namespace re_ncollide
