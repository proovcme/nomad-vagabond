#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nImageFile.asm
// Class: nImageFile

#include <cstdint>

namespace re_nnomads {

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

// Methods (7):
// 0x100029e6  nImageFile::nImageFile()  (16 insns)
// 0x10002a19  nImageFile::operator=  (15 insns)
// 0x10002a46  nImageFile::vfunc_00  (41 insns)
// 0x100796ea  nImageFile::vfunc_12  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::WriteLine
// 0x10079708  nImageFile::vfunc_07  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::ReadLine
// 0x10079726  nImageFile::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::Close
// 0x1007972c  nImageFile::vfunc_01  (2 insns)
//   calls:   IAT: nnebula.dll!nImageFile::Open, IAT: nnebula.dll!nImageFile::~nImageFile()

} // namespace re_nnomads
