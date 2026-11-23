#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nSceneGraph2.asm
// Class: nSceneGraph2

#include <cstdint>

namespace re_nnature {

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

// Methods (33):
// 0x10004432  nSceneGraph2::nSceneGraph2()  (95 insns)
//   calls:   -> nRoot::nRoot()
// 0x100045b8  nSceneGraph2::operator=  (109 insns)
//   calls:   -> nRoot::operator=
// 0x10004747  nSceneGraph2::vfunc_00  (87 insns)
// 0x10004828  nSceneGraph2::ResetNodePool  (2 insns)
// 0x10004831  nSceneGraph2::NewNodeFromPool  (25 insns)
// 0x1000487e  nSceneGraph2::PushNode  (11 insns)
// 0x100048ab  nSceneGraph2::PopNode  (5 insns)
// 0x100048c4  nSceneGraph2::NodeStackEmpty  (4 insns)
// 0x100048d1  nSceneGraph2::AttachTransformNode  (6 insns)
// 0x100048e0  nSceneGraph2::AttachSoundNode  (5 insns)
// 0x100048f8  nSceneGraph2::AttachVisualNode  (5 insns)
// 0x10004910  nSceneGraph2::AttachOpaqueness  (11 insns)
// 0x10004947  nSceneGraph2::AttachRenderPri  (5 insns)
// 0x10004961  nSceneGraph2::AttachAmbientFogNode  (5 insns)
// 0x1000497c  nSceneGraph2::AttachAmbientListenerNode  (5 insns)
// 0x10004997  nSceneGraph2::SetTransform  (12 insns)
// 0x100049b8  nSceneGraph2::GetTransform  (4 insns)
// 0x100049ca  nSceneGraph2::GetParentTransform  (6 insns)
// 0x100049e7  nSceneGraph2::GetRenderContext  (4 insns)
// 0x100049f9  nSceneGraph2::AttachMeshNode  (5 insns)
// 0x10004a11  nSceneGraph2::GetVertexBuffer  (4 insns)
// 0x10004a23  nSceneGraph2::SetIndexBuffer  (5 insns)
// 0x10004a3b  nSceneGraph2::GetIndexBuffer  (4 insns)
// 0x10004a4d  nSceneGraph2::AttachTexArrayNode  (5 insns)
// 0x10004a65  nSceneGraph2::GetTextureArray  (4 insns)
// 0x10004a77  nSceneGraph2::AttachShaderNode  (5 insns)
// 0x10004a8f  nSceneGraph2::GetPixelShader  (4 insns)
// 0x10004aa1  nSceneGraph2::AttachLightNode  (5 insns)
// 0x10004ab9  nSceneGraph2::GetLight  (4 insns)
// 0x10004acb  nSceneGraph2::SetShadowCaster  (5 insns)
// 0x10004ae3  nSceneGraph2::GetShadowCaster  (4 insns)
// 0x10004af5  nSceneGraph2::SetChannelContext  (5 insns)
// 0x10004b0d  nSceneGraph2::GetChannelContext  (4 insns)

} // namespace re_nnature
