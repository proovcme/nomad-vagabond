#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nNpkFileWrapper.asm
// Class: nNpkFileWrapper

#include <cstdint>

namespace re_nnebula {

struct nNpkFileWrapper_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint8_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint8_t field_0x0014;
    // +0x0015
    uint8_t field_0x0015;
    // +0x0018
    uint32_t field_0x0018;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint8_t field_0x003c;
    // +0x0120
    uint32_t field_0x0120;
    // +0x0124
    uint8_t field_0x0124;
    // +0x0128
    uint32_t field_0x0128;
    // +0x012c
    uint32_t field_0x012c;
    // +0x0554
    uint32_t field_0x0554;
    // +0x0558
    uint8_t field_0x0558;
    // +0x0559
    uint8_t field_0x0559;
    // +0x055c
    uint32_t field_0x055c;
    // +0x0560
    uint32_t field_0x0560;
    // +0x0564
    uint8_t field_0x0564;
};

// Script AddCmds (1):
//   i_parsefile_s

// Methods (12):
// 0x10005ffd  nNpkFileWrapper::nNpkFileWrapper()  (34 insns)
// 0x10006062  nNpkFileWrapper::operator=  (117 insns)
//   calls:   IAT: nkernel.dll!n_free
//   strings: 'i_parsefile_s'
// 0x100061d8  nNpkFileWrapper::nNpkFileWrapper()  (18 insns)
// 0x1000620e  nNpkFileWrapper::~nNpkFileWrapper()  (16 insns)
//   calls:   -> nNpkFileWrapper::Close, IAT: nkernel.dll!n_free
// 0x1000623c  nNpkFileWrapper::Open  (116 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, -> nDirectory::vfunc_30, IAT: nkernel.dll!n_printf, -> nNpkFileWrapper::ParseToc
//   strings: 'rb'
// 0x10006381  nNpkFileWrapper::Close  (17 insns)
// 0x100063b4  nNpkFileWrapper::GetBinaryFile  (2 insns)
// 0x100063bb  nNpkFileWrapper::GetAsciiFile  (2 insns)
// 0x100063c2  nNpkFileWrapper::GetTocObject  (2 insns)
// 0x100063c6  nNpkFileWrapper::ReadHeader  (38 insns)
// 0x1000641a  nNpkFileWrapper::ReadTocEntries  (117 insns)
// 0x1000656e  nNpkFileWrapper::ParseToc  (723 insns)
//   calls:   -> nNpkFileWrapper::ReadHeader, -> nNpkFileWrapper::ReadTocEntries, IAT: nkernel.dll!n_printf, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, -> nFile::vfunc_09, -> nFile::vfunc_01, IAT: MSVCRT.dll!strchr, -> nFile::vfunc_02, -> nFile::vfunc_04, -> nNpkFileWrapper::GetAsciiFile, -> nNpkFileWrapper::GetBinaryFile
//   strings: 'Vh', 'nNpkFile: Writing to npk files not supported!', 'file/nnpkfile.cc', 'npk'

} // namespace re_nnebula
