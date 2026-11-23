#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nFile.asm
// Class: nFile

#include <cstdint>

namespace re_nnebula {

struct nFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
};

// Methods (18):
// 0x10002dd5  nFile::nFile()  (8 insns)
// 0x10002df0  nFile::operator=  (7 insns)
// 0x10002e05  nFile::vfunc_00  (40 insns)
// 0x10002e5f  nFile::PutFloat  (6 insns)
// 0x10002e6e  nFile::PutShort  (6 insns)
// 0x10002e7d  nFile::PutChar  (6 insns)
// 0x10002e8c  nFile::GetFloat  (5 insns)
// 0x10002e9a  nFile::GetShort  (5 insns)
// 0x10002ea8  nFile::GetChar  (5 insns)
// 0x10037b3a  nFile::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::IsOpen
// 0x10037b40  nFile::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::GetS
// 0x10037b46  nFile::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::PutS
// 0x10037b4c  nFile::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Seek
// 0x10037b52  nFile::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Tell
// 0x10037b58  nFile::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Read
// 0x10037b5e  nFile::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Write
// 0x10037b64  nFile::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Close
// 0x10037b6a  nFile::vfunc_01  (2 insns)
//   calls:   IAT: nkernel.dll!nFile::Open, IAT: nkernel.dll!nFile::~nFile()

} // namespace re_nnebula
