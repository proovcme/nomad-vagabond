#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nImageFile.asm
// Class: nImageFile

#include <cstdint>

namespace re_ncollide {

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
// 0x1000427a  nImageFile::nImageFile()  (16 insns)
// 0x100042ad  nImageFile::operator=  (15 insns)
// 0x100042da  nImageFile::vfunc_00  (41 insns)
// 0x1000748c  nImageFile::vfunc_12  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::WriteLine
// 0x100074aa  nImageFile::vfunc_07  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::ReadLine
// 0x100074c8  nImageFile::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::Close
// 0x100074ce  nImageFile::vfunc_01  (2 insns)
//   calls:   IAT: nnebula.dll!nImageFile::Open, IAT: nnebula.dll!nImageFile::~nImageFile()

} // namespace re_ncollide
