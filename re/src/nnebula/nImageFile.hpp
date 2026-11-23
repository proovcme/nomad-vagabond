#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nImageFile.asm
// Class: nImageFile

#include <cstdint>

namespace re_nnebula {

struct nImageFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint8_t field_0x0018;
};

// Methods (17):
// 0x10006ece  nImageFile::nImageFile()  (16 insns)
// 0x10006f01  nImageFile::operator=  (15 insns)
// 0x10006f2e  nImageFile::vfunc_00  (41 insns)
//   calls:   -> nImageFile::~nImageFile()
// 0x1000a9d0  nImageFile::nImageFile()  (9 insns)
// 0x1000a9ea  nImageFile::~nImageFile()  (2 insns)
// 0x1000a9f1  nImageFile::Open  (34 insns)
//   calls:   IAT: MSVCRT.dll!fopen, IAT: MSVCRT.dll!strchr, IAT: nkernel.dll!n_printf
// 0x1000aa50  nImageFile::Close  (23 insns)
//   calls:   -> nPixelFormat::~nPixelFormat(), IAT: MSVCRT.dll!fclose
// 0x1000aa87  nImageFile::IsOpen  (3 insns)
// 0x1000aa8f  nImageFile::SetWidth  (3 insns)
// 0x1000aa99  nImageFile::GetWidth  (2 insns)
// 0x1000aa9d  nImageFile::SetHeight  (3 insns)
// 0x1000aaa7  nImageFile::GetHeight  (2 insns)
// 0x1000aaab  nImageFile::SetPixelFormat  (16 insns)
//   calls:   -> nPixelFormat::nPixelFormat()
// 0x1000aad4  nImageFile::SetPixelFormat  (22 insns)
//   calls:   -> nPixelFormat::nPixelFormat()
// 0x1000ab08  nImageFile::GetPixelFormat  (2 insns)
// 0x1000ab0c  nImageFile::ReadLine  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'gfx/nimagefile.cc'
// 0x1000ab2f  nImageFile::WriteLine  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'gfx/nimagefile.cc'

} // namespace re_nnebula
