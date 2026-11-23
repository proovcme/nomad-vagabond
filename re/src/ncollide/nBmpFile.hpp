#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nBmpFile.asm
// Class: nBmpFile

#include <cstdint>

namespace re_ncollide {

struct nBmpFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x000c
    float field_0x000c;
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

// Methods (53):
// 0x10004335  nBmpFile::nBmpFile()  (17 insns)
//   calls:   -> nImageFile::nImageFile()
// 0x10004362  nBmpFile::operator=  (16 insns)
//   calls:   -> nImageFile::operator=
// 0x10004389  nBmpFile::vfunc_00  (40 insns)
// 0x10004539  nBmpFile::vfunc_13  (41 insns)
// 0x10004db6  nBmpFile::vfunc_29  (221 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x100072be  nBmpFile::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Dispatch
// 0x100072c4  nBmpFile::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Import
// 0x100072ca  nBmpFile::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveCmds
// 0x100072d0  nBmpFile::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Parse
// 0x100072d6  nBmpFile::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Clone
// 0x100072dc  nBmpFile::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveAs
// 0x100072e2  nBmpFile::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Save
// 0x100072e8  nBmpFile::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsInstanceOf
// 0x100072ee  nBmpFile::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsA
// 0x100072f4  nBmpFile::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::GetClass
// 0x100072fa  nBmpFile::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SetClass
// 0x10007300  nBmpFile::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Release
// 0x10007306  nBmpFile::vfunc_14  (2 insns)
//   calls:   IAT: nkernel.dll!nRoot::Initialize, IAT: nkernel.dll!nRoot::~nRoot()
// 0x10007492  nBmpFile::vfunc_11  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x10007498  nBmpFile::vfunc_10  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x1000749e  nBmpFile::vfunc_09  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetHeight
// 0x100074a4  nBmpFile::vfunc_08  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetWidth
// 0x100074b0  nBmpFile::vfunc_06  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetPixelFormat
// 0x100074b6  nBmpFile::vfunc_05  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetHeight
// 0x100074bc  nBmpFile::vfunc_04  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetWidth
// 0x100074c2  nBmpFile::vfunc_03  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::IsOpen
// 0x100074da  nBmpFile::vfunc_12  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::WriteLine
// 0x100074e0  nBmpFile::vfunc_07  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::ReadLine
// 0x100074e6  nBmpFile::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Close
// 0x100074ec  nBmpFile::vfunc_01  (2 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Open, IAT: nnebula.dll!nBmpFile::~nBmpFile()
// 0x100074f8  nBmpFile::vfunc_28  (1 insns)
//   calls:   IAT: nnebula.dll!nTexture::Unload
// 0x100074fe  nBmpFile::vfunc_27  (4 insns)
//   calls:   IAT: nnebula.dll!nTexture::Load, IAT: nnebula.dll!nTexture::~nTexture(), IAT: nnebula.dll!nGfxServer::SetStats, IAT: nnebula.dll!nTexture::GetByteSize
// 0x100075b2  nBmpFile::vfunc_63  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetState
// 0x100075b8  nBmpFile::vfunc_62  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::PopMatrix
// 0x100075be  nBmpFile::vfunc_61  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::PushMatrix
// 0x100075c4  nBmpFile::vfunc_60  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetMatrix
// 0x100075ca  nBmpFile::vfunc_59  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetMatrix
// 0x100075d0  nBmpFile::vfunc_58  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::EndScene
// 0x100075d6  nBmpFile::vfunc_57  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::BeginScene
// 0x100075dc  nBmpFile::vfunc_56  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetColorFormat
// 0x100075e2  nBmpFile::vfunc_55  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::ScaledScreenshot
// 0x100075e8  nBmpFile::vfunc_54  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Screenshot
// 0x100075ee  nBmpFile::vfunc_53  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetClearColor
// 0x100075f4  nBmpFile::vfunc_52  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetClearColor
// 0x100075fa  nBmpFile::vfunc_51  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetViewVolume
// 0x10007600  nBmpFile::vfunc_50  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetViewVolume
// 0x10007606  nBmpFile::vfunc_49  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetFontDesc
// 0x1000760c  nBmpFile::vfunc_48  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetDisplayDesc
// 0x10007612  nBmpFile::vfunc_47  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::IsDisplayOpen
// 0x10007618  nBmpFile::vfunc_46  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::CloseDisplay
// 0x1000761e  nBmpFile::vfunc_45  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::OpenDisplay
// 0x10007624  nBmpFile::vfunc_44  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetDisplayMode
// 0x1000762a  nBmpFile::vfunc_43  (2 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetDisplayMode, IAT: nnebula.dll!nGfxServer::~nGfxServer()

} // namespace re_ncollide
