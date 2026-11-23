#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nGfxServer.asm
// Class: nGfxServer

#include <cstdint>

namespace re_nnomads {

struct nGfxServer_Layout {
    // +0x007c
    uint32_t field_0x007c;
    // +0x01a4
    uint32_t field_0x01a4;
    // +0x01a8
    uint32_t field_0x01a8;
    // +0x01ac
    uint32_t field_0x01ac;
    // +0x01b0
    uint32_t field_0x01b0;
    // +0x01b4
    uint32_t field_0x01b4;
    // +0x01b8
    uint32_t field_0x01b8;
    // +0x01bc
    uint32_t field_0x01bc;
    // +0x01c0
    uint32_t field_0x01c0;
    // +0x01c4
    uint32_t field_0x01c4;
    // +0x01c8
    uint32_t field_0x01c8;
    // +0x01cc
    uint32_t field_0x01cc;
    // +0x01d0
    uint32_t field_0x01d0;
    // +0x01d4
    uint32_t field_0x01d4;
    // +0x01d8
    uint32_t field_0x01d8;
    // +0x01e0
    double field_0x01e0;
    // +0x01e8
    uint32_t field_0x01e8;
    // +0x0a9c
    uint32_t field_0x0a9c;
    // +0x0aa0
    uint32_t field_0x0aa0;
    // +0x0b90
    uint8_t field_0x0b90;
    // +0x0b94
    uint32_t field_0x0b94;
    // +0x0b98
    uint32_t field_0x0b98;
    // +0x0c7c
    uint32_t field_0x0c7c;
};

// Methods (34):
// 0x10002d7c  nGfxServer::SetCurrentPixelShader  (13 insns)
// 0x10002da0  nGfxServer::GetCurrentPixelShader  (2 insns)
// 0x10002da7  nGfxServer::SetCurrentVertexBubble  (13 insns)
// 0x10002dcb  nGfxServer::GetCurrentVertexBubble  (2 insns)
// 0x10002dd2  nGfxServer::SetCurrentTexture  (34 insns)
// 0x10002e2d  nGfxServer::GetCurrentTexture  (3 insns)
// 0x10002e3b  nGfxServer::nGfxServer()  (248 insns)
//   calls:   -> nRoot::nRoot(), IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x100031d0  nGfxServer::operator=  (251 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x10079774  nGfxServer::vfunc_60  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetMaxTextureSize
// 0x1007977a  nGfxServer::vfunc_59  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetMaxTextureSize
// 0x10079780  nGfxServer::vfunc_58  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::HideCursor
// 0x10079786  nGfxServer::vfunc_57  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::ShowCursor
// 0x1007978c  nGfxServer::vfunc_56  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Trigger
// 0x10079792  nGfxServer::vfunc_55  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::EndText
// 0x10079798  nGfxServer::vfunc_54  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Text
// 0x1007979e  nGfxServer::vfunc_53  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::TextPos
// 0x100797a4  nGfxServer::vfunc_52  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::BeginText
// 0x100797aa  nGfxServer::vfunc_51  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::FindIndexBuffer
// 0x100797b0  nGfxServer::vfunc_50  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::FindVertexBuffer
// 0x100797b6  nGfxServer::vfunc_49  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::FindPixelShader
// 0x100797bc  nGfxServer::vfunc_48  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::FindTexture
// 0x100797c2  nGfxServer::vfunc_47  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::NewIndexBuffer
// 0x100797c8  nGfxServer::vfunc_46  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::NewVertexBuffer
// 0x100797ce  nGfxServer::vfunc_45  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::NewVertexPool
// 0x100797d4  nGfxServer::vfunc_44  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::NewPixelShader
// 0x100797da  nGfxServer::vfunc_43  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::NewTexture
// 0x100797e0  nGfxServer::vfunc_42  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::End
// 0x100797e6  nGfxServer::vfunc_41  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Uv
// 0x100797ec  nGfxServer::vfunc_40  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Rgba
// 0x100797f2  nGfxServer::vfunc_39  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Norm
// 0x100797f8  nGfxServer::vfunc_38  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Coord
// 0x100797fe  nGfxServer::vfunc_37  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Begin
// 0x10079804  nGfxServer::vfunc_36  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetLight
// 0x1007980a  nGfxServer::vfunc_35  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetClipPlane

} // namespace re_nnomads
