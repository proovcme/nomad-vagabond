#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nBmpFile.asm
// Class: nBmpFile

#include <cstdint>

namespace re_nparticle {

struct nBmpFile_Layout {
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
};

// Methods (42):
// 0x100036f3  nBmpFile::nBmpFile()  (17 insns)
//   calls:   -> nImageFile::nImageFile()
// 0x10003720  nBmpFile::operator=  (16 insns)
//   calls:   -> nImageFile::operator=
// 0x10003747  nBmpFile::vfunc_00  (40 insns)
// 0x100038f7  nBmpFile::vfunc_13  (41 insns)
// 0x100041a7  nBmpFile::vfunc_29  (157 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10009608  nBmpFile::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveCmds
// 0x10009644  nBmpFile::vfunc_14  (4 insns)
//   calls:   IAT: nkernel.dll!nRoot::Initialize, IAT: nkernel.dll!nRoot::nRoot(), IAT: nkernel.dll!nRoot::~nRoot(), IAT: nkernel.dll!nClass::~nClass()
// 0x10009842  nBmpFile::vfunc_11  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x10009848  nBmpFile::vfunc_10  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x1000984e  nBmpFile::vfunc_09  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetHeight
// 0x10009854  nBmpFile::vfunc_08  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetWidth
// 0x10009860  nBmpFile::vfunc_06  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetPixelFormat
// 0x10009866  nBmpFile::vfunc_05  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetHeight
// 0x1000986c  nBmpFile::vfunc_04  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetWidth
// 0x10009872  nBmpFile::vfunc_03  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::IsOpen
// 0x1000988a  nBmpFile::vfunc_12  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::WriteLine
// 0x10009890  nBmpFile::vfunc_07  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::ReadLine
// 0x10009896  nBmpFile::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Close
// 0x1000989c  nBmpFile::vfunc_01  (2 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Open, IAT: nnebula.dll!nBmpFile::~nBmpFile()
// 0x100098a8  nBmpFile::vfunc_28  (1 insns)
//   calls:   IAT: nnebula.dll!nTexture::Unload
// 0x100098ae  nBmpFile::vfunc_27  (4 insns)
//   calls:   IAT: nnebula.dll!nTexture::Load, IAT: nnebula.dll!nTexture::~nTexture(), IAT: nnebula.dll!nGfxServer::SetStats, IAT: nnebula.dll!nTexture::GetByteSize
// 0x10009962  nBmpFile::vfunc_63  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetState
// 0x10009968  nBmpFile::vfunc_62  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::PopMatrix
// 0x1000996e  nBmpFile::vfunc_61  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::PushMatrix
// 0x10009974  nBmpFile::vfunc_60  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetMatrix
// 0x1000997a  nBmpFile::vfunc_59  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetMatrix
// 0x10009980  nBmpFile::vfunc_58  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::EndScene
// 0x10009986  nBmpFile::vfunc_57  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::BeginScene
// 0x1000998c  nBmpFile::vfunc_56  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetColorFormat
// 0x10009992  nBmpFile::vfunc_55  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::ScaledScreenshot
// 0x10009998  nBmpFile::vfunc_54  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Screenshot
// 0x1000999e  nBmpFile::vfunc_53  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetClearColor
// 0x100099a4  nBmpFile::vfunc_52  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetClearColor
// 0x100099aa  nBmpFile::vfunc_51  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetViewVolume
// 0x100099b0  nBmpFile::vfunc_50  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetViewVolume
// 0x100099b6  nBmpFile::vfunc_49  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetFontDesc
// 0x100099bc  nBmpFile::vfunc_48  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetDisplayDesc
// 0x100099c2  nBmpFile::vfunc_47  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::IsDisplayOpen
// 0x100099c8  nBmpFile::vfunc_46  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::CloseDisplay
// 0x100099ce  nBmpFile::vfunc_45  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::OpenDisplay
// 0x100099d4  nBmpFile::vfunc_44  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetDisplayMode
// 0x100099da  nBmpFile::vfunc_43  (6 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetDisplayMode, IAT: nnebula.dll!nGfxServer::~nGfxServer(), IAT: nnebula.dll!nSceneGraph2::~nSceneGraph2(), IAT: nnebula.dll!nChannelServer::~nChannelServer(), IAT: nnebula.dll!nVertexBuffer::UnlockVertices, IAT: nnebula.dll!nVertexBuffer::LockVertices

} // namespace re_nparticle
