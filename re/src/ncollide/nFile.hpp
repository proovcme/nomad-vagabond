#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nFile.asm
// Class: nFile

#include <cstdint>

namespace re_ncollide {

struct nFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
};

// Methods (18):
// 0x10002c36  nFile::nFile()  (8 insns)
// 0x10002c51  nFile::operator=  (7 insns)
// 0x10002c66  nFile::vfunc_00  (40 insns)
// 0x10002cc0  nFile::PutFloat  (6 insns)
// 0x10002ccf  nFile::PutShort  (6 insns)
// 0x10002cde  nFile::PutChar  (6 insns)
// 0x10002ced  nFile::GetFloat  (5 insns)
// 0x10002cfb  nFile::GetShort  (5 insns)
// 0x10002d09  nFile::GetChar  (5 insns)
// 0x100073ba  nFile::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::IsOpen
// 0x100073c0  nFile::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::GetS
// 0x100073c6  nFile::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::PutS
// 0x100073cc  nFile::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Seek
// 0x100073d2  nFile::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Tell
// 0x100073d8  nFile::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Read
// 0x100073de  nFile::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Write
// 0x100073e4  nFile::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Close
// 0x100073ea  nFile::vfunc_01  (2 insns)
//   calls:   IAT: nkernel.dll!nFile::Open, IAT: nkernel.dll!nFile::~nFile()

} // namespace re_ncollide
