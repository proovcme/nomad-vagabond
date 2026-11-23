#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nSceneGraph2.asm
// Class: nSceneGraph2

#include <cstdint>

namespace re_nparticle {

struct nSceneGraph2_Layout {
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

// Methods (32):
// 0x100042f7  nSceneGraph2::nSceneGraph2()  (95 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000447d  nSceneGraph2::operator=  (109 insns)
//   calls:   -> nRoot::operator=
// 0x100046ed  nSceneGraph2::ResetNodePool  (2 insns)
// 0x100046f6  nSceneGraph2::NewNodeFromPool  (25 insns)
// 0x10004743  nSceneGraph2::PushNode  (11 insns)
// 0x10004770  nSceneGraph2::PopNode  (5 insns)
// 0x10004789  nSceneGraph2::NodeStackEmpty  (4 insns)
// 0x10004796  nSceneGraph2::AttachTransformNode  (6 insns)
// 0x100047a5  nSceneGraph2::AttachTexArrayNode  (5 insns)
// 0x100047bd  nSceneGraph2::AttachLightNode  (5 insns)
// 0x100047d5  nSceneGraph2::AttachSoundNode  (5 insns)
// 0x100047ed  nSceneGraph2::AttachVisualNode  (5 insns)
// 0x10004805  nSceneGraph2::AttachOpaqueness  (11 insns)
// 0x1000483c  nSceneGraph2::AttachRenderPri  (5 insns)
// 0x10004856  nSceneGraph2::AttachAmbientFogNode  (5 insns)
// 0x10004871  nSceneGraph2::AttachAmbientListenerNode  (5 insns)
// 0x1000488c  nSceneGraph2::SetTransform  (12 insns)
// 0x100048ad  nSceneGraph2::GetTransform  (4 insns)
// 0x100048bf  nSceneGraph2::GetParentTransform  (6 insns)
// 0x100048dc  nSceneGraph2::GetRenderContext  (4 insns)
// 0x100048ee  nSceneGraph2::AttachMeshNode  (5 insns)
// 0x10004906  nSceneGraph2::GetVertexBuffer  (4 insns)
// 0x10004918  nSceneGraph2::SetIndexBuffer  (5 insns)
// 0x10004930  nSceneGraph2::GetIndexBuffer  (4 insns)
// 0x10004942  nSceneGraph2::GetTextureArray  (4 insns)
// 0x10004954  nSceneGraph2::AttachShaderNode  (5 insns)
// 0x1000496c  nSceneGraph2::GetPixelShader  (4 insns)
// 0x1000497e  nSceneGraph2::GetLight  (4 insns)
// 0x10004990  nSceneGraph2::SetShadowCaster  (5 insns)
// 0x100049a8  nSceneGraph2::GetShadowCaster  (4 insns)
// 0x100049ba  nSceneGraph2::SetChannelContext  (5 insns)
// 0x100049d2  nSceneGraph2::GetChannelContext  (4 insns)

} // namespace re_nparticle
