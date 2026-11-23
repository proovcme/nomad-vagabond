#pragma once
// Auto-lifted C++ layout & method spec from nopcode.dll
// Source ASM: re/disasm/nopcode/nBmpFile.asm
// Class: nBmpFile

#include <cstdint>

namespace re_nopcode {

struct nBmpFile_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
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
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
};

// Methods (53):
// 0x10003305  nBmpFile::nBmpFile()  (17 insns)
//   calls:   -> nImageFile::nImageFile()
// 0x10003332  nBmpFile::operator=  (16 insns)
//   calls:   -> nImageFile::operator=
// 0x10003359  nBmpFile::vfunc_00  (40 insns)
// 0x10003509  nBmpFile::vfunc_13  (41 insns)
// 0x10003dbd  nBmpFile::vfunc_29  (195 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10003f9e  nBmpFile::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Dispatch
// 0x10003fa4  nBmpFile::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Import
// 0x10003faa  nBmpFile::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveCmds
// 0x10003fb0  nBmpFile::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Parse
// 0x10003fb6  nBmpFile::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Clone
// 0x10003fbc  nBmpFile::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveAs
// 0x10003fc2  nBmpFile::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Save
// 0x10003fc8  nBmpFile::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsInstanceOf
// 0x10003fce  nBmpFile::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsA
// 0x10003fd4  nBmpFile::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::GetClass
// 0x10003fda  nBmpFile::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SetClass
// 0x10003fe0  nBmpFile::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Release
// 0x10003fe6  nBmpFile::vfunc_14  (3 insns)
//   calls:   IAT: nkernel.dll!nRoot::Initialize, IAT: nkernel.dll!nRoot::~nRoot(), IAT: nkernel.dll!nClass::~nClass()
// 0x1000408e  nBmpFile::vfunc_11  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x10004094  nBmpFile::vfunc_10  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x1000409a  nBmpFile::vfunc_09  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetHeight
// 0x100040a0  nBmpFile::vfunc_08  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetWidth
// 0x100040ac  nBmpFile::vfunc_06  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetPixelFormat
// 0x100040b2  nBmpFile::vfunc_05  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetHeight
// 0x100040b8  nBmpFile::vfunc_04  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetWidth
// 0x100040be  nBmpFile::vfunc_03  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::IsOpen
// 0x100040d6  nBmpFile::vfunc_12  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::WriteLine
// 0x100040dc  nBmpFile::vfunc_07  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::ReadLine
// 0x100040e2  nBmpFile::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Close
// 0x100040e8  nBmpFile::vfunc_01  (2 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Open, IAT: nnebula.dll!nBmpFile::~nBmpFile()
// 0x100040f4  nBmpFile::vfunc_28  (1 insns)
//   calls:   IAT: nnebula.dll!nTexture::Unload
// 0x100040fa  nBmpFile::vfunc_27  (4 insns)
//   calls:   IAT: nnebula.dll!nTexture::Load, IAT: nnebula.dll!nTexture::~nTexture(), IAT: nnebula.dll!nGfxServer::SetStats, IAT: nnebula.dll!nTexture::GetByteSize
// 0x100041ae  nBmpFile::vfunc_63  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetState
// 0x100041b4  nBmpFile::vfunc_62  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::PopMatrix
// 0x100041ba  nBmpFile::vfunc_61  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::PushMatrix
// 0x100041c0  nBmpFile::vfunc_60  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetMatrix
// 0x100041c6  nBmpFile::vfunc_59  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetMatrix
// 0x100041cc  nBmpFile::vfunc_58  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::EndScene
// 0x100041d2  nBmpFile::vfunc_57  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::BeginScene
// 0x100041d8  nBmpFile::vfunc_56  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetColorFormat
// 0x100041de  nBmpFile::vfunc_55  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::ScaledScreenshot
// 0x100041e4  nBmpFile::vfunc_54  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Screenshot
// 0x100041ea  nBmpFile::vfunc_53  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetClearColor
// 0x100041f0  nBmpFile::vfunc_52  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetClearColor
// 0x100041f6  nBmpFile::vfunc_51  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetViewVolume
// 0x100041fc  nBmpFile::vfunc_50  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetViewVolume
// 0x10004202  nBmpFile::vfunc_49  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetFontDesc
// 0x10004208  nBmpFile::vfunc_48  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetDisplayDesc
// 0x1000420e  nBmpFile::vfunc_47  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::IsDisplayOpen
// 0x10004214  nBmpFile::vfunc_46  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::CloseDisplay
// 0x1000421a  nBmpFile::vfunc_45  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::OpenDisplay
// 0x10004220  nBmpFile::vfunc_44  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetDisplayMode
// 0x10004226  nBmpFile::vfunc_43  (2 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetDisplayMode, IAT: nnebula.dll!nGfxServer::~nGfxServer()

} // namespace re_nopcode
