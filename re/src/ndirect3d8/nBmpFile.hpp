#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nBmpFile.asm
// Class: nBmpFile

#include <cstdint>

namespace re_ndirect3d8 {

struct nBmpFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x0010
    uint32_t field_0x0010;
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
    // +0x004c
    uint32_t field_0x004c;
    // +0x0054
    uint32_t field_0x0054;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0b90
    uint8_t field_0x0b90;
    // +0x0c80
    uint32_t field_0x0c80;
    // +0x0c84
    uint32_t field_0x0c84;
    // +0x0c88
    uint32_t field_0x0c88;
    // +0x0c8c
    uint32_t field_0x0c8c;
    // +0x0c90
    uint32_t field_0x0c90;
    // +0x0c94
    uint32_t field_0x0c94;
    // +0x0c98
    uint32_t field_0x0c98;
    // +0x0c9c
    uint32_t field_0x0c9c;
    // +0x0ca0
    uint32_t field_0x0ca0;
    // +0x0ca4
    uint32_t field_0x0ca4;
    // +0x0ca8
    uint32_t field_0x0ca8;
    // +0x0cac
    uint32_t field_0x0cac;
    // +0x0cb0
    uint32_t field_0x0cb0;
    // +0x0cb4
    uint32_t field_0x0cb4;
    // +0x0cb8
    uint32_t field_0x0cb8;
    // +0x0cbc
    uint32_t field_0x0cbc;
    // +0x0cc0
    uint32_t field_0x0cc0;
    // +0x0cc4
    uint32_t field_0x0cc4;
    // +0x0cc8
    uint32_t field_0x0cc8;
    // +0x0ccc
    uint32_t field_0x0ccc;
    // +0x0cd0
    uint32_t field_0x0cd0;
    // +0x0cd4
    uint32_t field_0x0cd4;
    // +0x0cd8
    uint32_t field_0x0cd8;
    // +0x0cdc
    uint32_t field_0x0cdc;
    // +0x0de8
    uint32_t field_0x0de8;
    // +0x0dec
    uint32_t field_0x0dec;
    // +0x0df0
    uint8_t field_0x0df0;
    // +0x0df1
    uint8_t field_0x0df1;
    // +0x0df2
    uint8_t field_0x0df2;
    // +0x0df3
    uint8_t field_0x0df3;
    // +0x0df4
    uint8_t field_0x0df4;
    // +0x0df5
    uint8_t field_0x0df5;
    // +0x0df6
    uint8_t field_0x0df6;
    // +0x0df7
    uint8_t field_0x0df7;
    // +0x0df8
    uint8_t field_0x0df8;
    // +0x0dfc
    uint32_t field_0x0dfc;
    // +0x0e00
    float field_0x0e00;
    // +0x0e04
    float field_0x0e04;
    // +0x0e10
    uint8_t field_0x0e10;
    // +0x0e14
    uint32_t field_0x0e14;
    // +0x0e18
    uint32_t field_0x0e18;
    // +0x0f1c
    uint32_t field_0x0f1c;
    // +0x10a0
    uint32_t field_0x10a0;
    // +0x10b0
    float field_0x10b0;
    // +0x10b4
    float field_0x10b4;
    // +0x10b8
    uint8_t field_0x10b8;
    // +0x10b9
    uint8_t field_0x10b9;
};

// Methods (53):
// 0x100018b6  nBmpFile::nBmpFile()  (17 insns)
//   calls:   -> nImageFile::nImageFile()
// 0x100018e3  nBmpFile::operator=  (16 insns)
//   calls:   -> nImageFile::operator=
// 0x1000190a  nBmpFile::vfunc_00  (40 insns)
// 0x10001aba  nBmpFile::vfunc_13  (41 insns)
// 0x10002362  nBmpFile::vfunc_29  (989 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: KERNEL32.dll!GetModuleHandleA, IAT: USER32.dll!CreateAcceleratorTableA, IAT: DevIL.dll!ilInit, IAT: ILU.dll!iluInit, IAT: USER32.dll!DestroyAcceleratorTable, IAT: nkernel.dll!n_printf, -> nBmpFile::vfunc_08, -> nBmpFile::vfunc_09, -> nBmpFile::vfunc_01, -> nBmpFile::vfunc_06, -> nBmpFile::vfunc_02
//   strings: "#'", '/sys/servers/input', 'dev(0)-w(320)-h(200)-zbuf(16)', '/sys/env/hwnd', 'nenv', 'wb', 'gfx/nd3d8_main.cc', 'nd3d8texture'
// 0x1000a2b0  nBmpFile::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Dispatch
// 0x1000a2b6  nBmpFile::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Import
// 0x1000a2bc  nBmpFile::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveCmds
// 0x1000a2c2  nBmpFile::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Parse
// 0x1000a2c8  nBmpFile::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Clone
// 0x1000a2ce  nBmpFile::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveAs
// 0x1000a2d4  nBmpFile::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Save
// 0x1000a2da  nBmpFile::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsInstanceOf
// 0x1000a2e0  nBmpFile::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsA
// 0x1000a2e6  nBmpFile::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::GetClass
// 0x1000a2ec  nBmpFile::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SetClass
// 0x1000a2f2  nBmpFile::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Release
// 0x1000a2f8  nBmpFile::vfunc_14  (2 insns)
//   calls:   IAT: nkernel.dll!nRoot::Initialize, IAT: nkernel.dll!nRoot::~nRoot()
// 0x1000a3b8  nBmpFile::vfunc_11  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x1000a3be  nBmpFile::vfunc_10  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x1000a3c4  nBmpFile::vfunc_09  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetHeight
// 0x1000a3ca  nBmpFile::vfunc_08  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetWidth
// 0x1000a3d6  nBmpFile::vfunc_06  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetPixelFormat
// 0x1000a3dc  nBmpFile::vfunc_05  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetHeight
// 0x1000a3e2  nBmpFile::vfunc_04  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetWidth
// 0x1000a3e8  nBmpFile::vfunc_03  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::IsOpen
// 0x1000a400  nBmpFile::vfunc_12  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::WriteLine
// 0x1000a406  nBmpFile::vfunc_07  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::ReadLine
// 0x1000a40c  nBmpFile::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Close
// 0x1000a412  nBmpFile::vfunc_01  (2 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Open, IAT: nnebula.dll!nBmpFile::~nBmpFile()
// 0x1000a41e  nBmpFile::vfunc_28  (1 insns)
//   calls:   IAT: nnebula.dll!nTexture::Unload
// 0x1000a424  nBmpFile::vfunc_27  (4 insns)
//   calls:   IAT: nnebula.dll!nTexture::Load, IAT: nnebula.dll!nTexture::~nTexture(), IAT: nnebula.dll!nGfxServer::SetStats, IAT: nnebula.dll!nTexture::GetByteSize
// 0x1000a4d8  nBmpFile::vfunc_63  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetState
// 0x1000a4de  nBmpFile::vfunc_62  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::PopMatrix
// 0x1000a4e4  nBmpFile::vfunc_61  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::PushMatrix
// 0x1000a4ea  nBmpFile::vfunc_60  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetMatrix
// 0x1000a4f0  nBmpFile::vfunc_59  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetMatrix
// 0x1000a4f6  nBmpFile::vfunc_58  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::EndScene
// 0x1000a4fc  nBmpFile::vfunc_57  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::BeginScene
// 0x1000a502  nBmpFile::vfunc_56  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetColorFormat
// 0x1000a508  nBmpFile::vfunc_55  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::ScaledScreenshot
// 0x1000a50e  nBmpFile::vfunc_54  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::Screenshot
// 0x1000a514  nBmpFile::vfunc_53  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetClearColor
// 0x1000a51a  nBmpFile::vfunc_52  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetClearColor
// 0x1000a520  nBmpFile::vfunc_51  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetViewVolume
// 0x1000a526  nBmpFile::vfunc_50  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetViewVolume
// 0x1000a52c  nBmpFile::vfunc_49  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetFontDesc
// 0x1000a532  nBmpFile::vfunc_48  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetDisplayDesc
// 0x1000a538  nBmpFile::vfunc_47  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::IsDisplayOpen
// 0x1000a53e  nBmpFile::vfunc_46  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::CloseDisplay
// 0x1000a544  nBmpFile::vfunc_45  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::OpenDisplay
// 0x1000a54a  nBmpFile::vfunc_44  (1 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::GetDisplayMode
// 0x1000a550  nBmpFile::vfunc_43  (12 insns)
//   calls:   IAT: nnebula.dll!nGfxServer::SetDisplayMode, IAT: nnebula.dll!nGfxServer::~nGfxServer(), IAT: nnebula.dll!nGfxServer::nGfxServer(), IAT: nnebula.dll!nPixelFormat::EndConv, IAT: nnebula.dll!nPixelFormat::Conv, IAT: nnebula.dll!nPixelFormat::~nPixelFormat(), IAT: nnebula.dll!nPixelFormat::BeginConv, IAT: nnebula.dll!nPixelFormat::nPixelFormat(), IAT: nnebula.dll!nBmpFile::nBmpFile(), IAT: nnebula.dll!nGfxServer::getResourceID, IAT: nnebula.dll!nVertexPoolManager::NewVertexBubble, IAT: nnebula.dll!nGfxServer::LoadCursors

} // namespace re_ndirect3d8
