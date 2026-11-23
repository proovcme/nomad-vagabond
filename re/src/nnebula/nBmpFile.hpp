#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nBmpFile.asm
// Class: nBmpFile

#include <cstdint>

namespace re_nnebula {

struct nBmpFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
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

// Methods (15):
// 0x10006f89  nBmpFile::nBmpFile()  (17 insns)
//   calls:   -> nImageFile::nImageFile()
// 0x10006fb6  nBmpFile::operator=  (16 insns)
//   calls:   -> nImageFile::operator=
// 0x10006fdd  nBmpFile::vfunc_00  (40 insns)
//   calls:   -> nBmpFile::~nBmpFile()
// 0x1000718d  nBmpFile::vfunc_13  (41 insns)
//   calls:   -> nTexture::~nTexture()
// 0x100079f0  nBmpFile::vfunc_29  (157 insns)
//   calls:   -> nGfxServer::~nGfxServer(), IAT: nkernel.dll!n_free
// 0x1000ab52  nBmpFile::nBmpFile()  (11 insns)
//   calls:   -> nImageFile::nImageFile()
// 0x1000ab6f  nBmpFile::~nBmpFile()  (2 insns)
//   calls:   -> nImageFile::~nImageFile()
// 0x1000ab7a  nBmpFile::readBitmapFileHeader  (41 insns)
//   calls:   IAT: MSVCRT.dll!fread
// 0x1000abcb  nBmpFile::writeBitmapFileHeader  (41 insns)
//   calls:   IAT: MSVCRT.dll!fwrite
// 0x1000ac1c  nBmpFile::readBitmapInfoHeader  (82 insns)
//   calls:   IAT: MSVCRT.dll!fread
// 0x1000acac  nBmpFile::writeBitmapInfoHeader  (82 insns)
//   calls:   IAT: MSVCRT.dll!fwrite
// 0x1000ad3c  nBmpFile::Open  (207 insns)
//   calls:   -> nImageFile::Open, -> nBmpFile::readBitmapFileHeader, -> nBmpFile::readBitmapInfoHeader, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!fread, IAT: nkernel.dll!nn_malloc, -> nBmpFile::writeBitmapFileHeader, -> nBmpFile::writeBitmapInfoHeader
//   strings: 'gfx/nbmpfile.cc'
// 0x1000af91  nBmpFile::Close  (13 insns)
//   calls:   IAT: nkernel.dll!n_free, -> nImageFile::Close
// 0x1000afb0  nBmpFile::ReadLine  (22 insns)
//   calls:   IAT: MSVCRT.dll!fread
// 0x1000afed  nBmpFile::WriteLine  (35 insns)
//   calls:   IAT: MSVCRT.dll!fwrite

} // namespace re_nnebula
