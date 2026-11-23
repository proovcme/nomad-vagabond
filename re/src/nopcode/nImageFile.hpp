#pragma once
// Auto-lifted C++ layout & method spec from nopcode.dll
// Source ASM: re/disasm/nopcode/nImageFile.asm
// Class: nImageFile

#include <cstdint>

namespace re_nopcode {

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
// 0x1000324a  nImageFile::nImageFile()  (16 insns)
// 0x1000327d  nImageFile::operator=  (15 insns)
// 0x100032aa  nImageFile::vfunc_00  (41 insns)
// 0x10004088  nImageFile::vfunc_12  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::WriteLine
// 0x100040a6  nImageFile::vfunc_07  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::ReadLine
// 0x100040c4  nImageFile::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::Close
// 0x100040ca  nImageFile::vfunc_01  (2 insns)
//   calls:   IAT: nnebula.dll!nImageFile::Open, IAT: nnebula.dll!nImageFile::~nImageFile()

} // namespace re_nopcode
