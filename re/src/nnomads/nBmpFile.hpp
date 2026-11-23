#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nBmpFile.asm
// Class: nBmpFile

#include <cstdint>

namespace re_nnomads {

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

// Methods (40):
// 0x10002aa1  nBmpFile::nBmpFile()  (17 insns)
//   calls:   -> nImageFile::nImageFile()
// 0x10002ace  nBmpFile::operator=  (16 insns)
//   calls:   -> nImageFile::operator=
// 0x10002af5  nBmpFile::vfunc_00  (40 insns)
// 0x10002ca5  nBmpFile::vfunc_13  (41 insns)
// 0x1000354d  nBmpFile::vfunc_29  (157 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x100796f0  nBmpFile::vfunc_11  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x100796f6  nBmpFile::vfunc_10  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x100796fc  nBmpFile::vfunc_09  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetHeight
// 0x10079702  nBmpFile::vfunc_08  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetWidth
// 0x1007970e  nBmpFile::vfunc_06  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetPixelFormat
// 0x10079714  nBmpFile::vfunc_05  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetHeight
// 0x1007971a  nBmpFile::vfunc_04  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetWidth
// 0x10079720  nBmpFile::vfunc_03  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::IsOpen
// 0x10079738  nBmpFile::vfunc_12  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::WriteLine
// 0x1007973e  nBmpFile::vfunc_07  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::ReadLine
// 0x10079744  nBmpFile::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Close
// 0x1007974a  nBmpFile::vfunc_01  (2 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Open, IAT: nnebula.dll!nBmpFile::~nBmpFile()
// 0x10079756  nBmpFile::vfunc_28  (1 insns)
//   calls:   IAT: nnebula.dll!nTexture::Unload
// 0x1007975c  nBmpFile::vfunc_27  (4 insns)
//   calls:   IAT: nnebula.dll!nTexture::Load, IAT: nnebula.dll!nTexture::~nTexture(), IAT: nnebula.dll!nGfxServer::SetStats, IAT: nnebula.dll!nTexture::GetByteSize
// 0x10079810  nBmpFile::vfunc_63  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetState
// 0x10079816  nBmpFile::vfunc_62  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::PopMatrix
// 0x1007981c  nBmpFile::vfunc_61  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::PushMatrix
// 0x10079822  nBmpFile::vfunc_60  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetMatrix
// 0x10079828  nBmpFile::vfunc_59  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetMatrix
// 0x1007982e  nBmpFile::vfunc_58  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::EndScene
// 0x10079834  nBmpFile::vfunc_57  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::BeginScene
// 0x1007983a  nBmpFile::vfunc_56  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetColorFormat
// 0x10079840  nBmpFile::vfunc_55  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::ScaledScreenshot
// 0x10079846  nBmpFile::vfunc_54  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Screenshot
// 0x1007984c  nBmpFile::vfunc_53  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetClearColor
// 0x10079852  nBmpFile::vfunc_52  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetClearColor
// 0x10079858  nBmpFile::vfunc_51  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetViewVolume
// 0x1007985e  nBmpFile::vfunc_50  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetViewVolume
// 0x10079864  nBmpFile::vfunc_49  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetFontDesc
// 0x1007986a  nBmpFile::vfunc_48  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetDisplayDesc
// 0x10079870  nBmpFile::vfunc_47  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::IsDisplayOpen
// 0x10079876  nBmpFile::vfunc_46  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::CloseDisplay
// 0x1007987c  nBmpFile::vfunc_45  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::OpenDisplay
// 0x10079882  nBmpFile::vfunc_44  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetDisplayMode
// 0x10079888  nBmpFile::vfunc_43  (3 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetDisplayMode, IAT: nnebula.dll!nGfxServer::~nGfxServer(), IAT: nnebula.dll!nChannelServer::~nChannelServer()

} // namespace re_nnomads
