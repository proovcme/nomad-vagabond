#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nGfxServer.asm
// Class: nGfxServer

#include <cstdint>

namespace re_ncollide {

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
// 0x1000461c  nGfxServer::SetCurrentPixelShader  (13 insns)
// 0x10004640  nGfxServer::GetCurrentPixelShader  (2 insns)
// 0x10004647  nGfxServer::SetCurrentVertexBubble  (13 insns)
// 0x1000466b  nGfxServer::GetCurrentVertexBubble  (2 insns)
// 0x10004672  nGfxServer::SetCurrentTexture  (34 insns)
// 0x100046cd  nGfxServer::GetCurrentTexture  (3 insns)
// 0x100046db  nGfxServer::nGfxServer()  (223 insns)
//   calls:   -> nRoot::nRoot()
// 0x10004a39  nGfxServer::operator=  (251 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x10007516  nGfxServer::vfunc_60  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetMaxTextureSize
// 0x1000751c  nGfxServer::vfunc_59  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetMaxTextureSize
// 0x10007522  nGfxServer::vfunc_58  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::HideCursor
// 0x10007528  nGfxServer::vfunc_57  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::ShowCursor
// 0x1000752e  nGfxServer::vfunc_56  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Trigger
// 0x10007534  nGfxServer::vfunc_55  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::EndText
// 0x1000753a  nGfxServer::vfunc_54  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Text
// 0x10007540  nGfxServer::vfunc_53  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::TextPos
// 0x10007546  nGfxServer::vfunc_52  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::BeginText
// 0x1000754c  nGfxServer::vfunc_51  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::FindIndexBuffer
// 0x10007552  nGfxServer::vfunc_50  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::FindVertexBuffer
// 0x10007558  nGfxServer::vfunc_49  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::FindPixelShader
// 0x1000755e  nGfxServer::vfunc_48  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::FindTexture
// 0x10007564  nGfxServer::vfunc_47  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::NewIndexBuffer
// 0x1000756a  nGfxServer::vfunc_46  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::NewVertexBuffer
// 0x10007570  nGfxServer::vfunc_45  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::NewVertexPool
// 0x10007576  nGfxServer::vfunc_44  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::NewPixelShader
// 0x1000757c  nGfxServer::vfunc_43  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::NewTexture
// 0x10007582  nGfxServer::vfunc_42  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::End
// 0x10007588  nGfxServer::vfunc_41  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Uv
// 0x1000758e  nGfxServer::vfunc_40  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Rgba
// 0x10007594  nGfxServer::vfunc_39  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Norm
// 0x1000759a  nGfxServer::vfunc_38  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Coord
// 0x100075a0  nGfxServer::vfunc_37  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Begin
// 0x100075a6  nGfxServer::vfunc_36  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetLight
// 0x100075ac  nGfxServer::vfunc_35  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetClipPlane

} // namespace re_ncollide
