#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nSceneGraph2.asm
// Class: nSceneGraph2

#include <cstdint>

namespace re_nnomads {

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
// 0x10008554  nSceneGraph2::nSceneGraph2()  (95 insns)
//   calls:   -> nRoot::nRoot()
// 0x100086da  nSceneGraph2::operator=  (109 insns)
//   calls:   -> nRoot::operator=
// 0x10008869  nSceneGraph2::vfunc_00  (87 insns)
// 0x1000894a  nSceneGraph2::ResetNodePool  (2 insns)
// 0x10008953  nSceneGraph2::NewNodeFromPool  (25 insns)
// 0x100089a0  nSceneGraph2::PushNode  (11 insns)
// 0x100089cd  nSceneGraph2::PopNode  (5 insns)
// 0x100089e6  nSceneGraph2::NodeStackEmpty  (4 insns)
// 0x100089f3  nSceneGraph2::AttachTransformNode  (6 insns)
// 0x10008a02  nSceneGraph2::AttachMeshNode  (5 insns)
// 0x10008a1a  nSceneGraph2::AttachLightNode  (5 insns)
// 0x10008a32  nSceneGraph2::AttachSoundNode  (5 insns)
// 0x10008a4a  nSceneGraph2::AttachVisualNode  (5 insns)
// 0x10008a62  nSceneGraph2::AttachOpaqueness  (11 insns)
// 0x10008a99  nSceneGraph2::AttachRenderPri  (5 insns)
// 0x10008ab3  nSceneGraph2::AttachAmbientFogNode  (5 insns)
// 0x10008ace  nSceneGraph2::AttachAmbientListenerNode  (5 insns)
// 0x10008ae9  nSceneGraph2::SetTransform  (12 insns)
// 0x10008b0a  nSceneGraph2::GetTransform  (4 insns)
// 0x10008b1c  nSceneGraph2::GetParentTransform  (6 insns)
// 0x10008b39  nSceneGraph2::GetRenderContext  (4 insns)
// 0x10008b4b  nSceneGraph2::GetVertexBuffer  (4 insns)
// 0x10008b5d  nSceneGraph2::SetIndexBuffer  (5 insns)
// 0x10008b75  nSceneGraph2::GetIndexBuffer  (4 insns)
// 0x10008b87  nSceneGraph2::AttachTexArrayNode  (5 insns)
// 0x10008b9f  nSceneGraph2::GetTextureArray  (4 insns)
// 0x10008bb1  nSceneGraph2::AttachShaderNode  (5 insns)
// 0x10008bc9  nSceneGraph2::GetPixelShader  (4 insns)
// 0x10008bdb  nSceneGraph2::GetLight  (4 insns)
// 0x10008bed  nSceneGraph2::SetShadowCaster  (5 insns)
// 0x10008c05  nSceneGraph2::GetShadowCaster  (4 insns)
// 0x10008c17  nSceneGraph2::SetChannelContext  (5 insns)
// 0x10008c2f  nSceneGraph2::GetChannelContext  (4 insns)

} // namespace re_nnomads
