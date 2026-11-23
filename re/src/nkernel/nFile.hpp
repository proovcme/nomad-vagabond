#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nFile.asm
// Class: nFile

#include <cstdint>

namespace re_nkernel {

struct nFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
};

// Methods (20):
// 0x10002c03  nFile::nFile()  (8 insns)
// 0x10002c1e  nFile::operator=  (7 insns)
// 0x10002c33  nFile::vfunc_00  (40 insns)
//   calls:   -> nFile::~nFile()
// 0x10002c8d  nFile::PutShort  (6 insns)
// 0x10002c9c  nFile::PutChar  (6 insns)
// 0x10002cab  nFile::PutFloat  (6 insns)
// 0x10002cba  nFile::GetShort  (5 insns)
// 0x10002cc8  nFile::GetChar  (5 insns)
// 0x10002cd6  nFile::GetFloat  (5 insns)
// 0x100090fd  nFile::nFile()  (6 insns)
// 0x10009113  nFile::~nFile()  (16 insns)
//   calls:   -> n_printf, IAT: KERNEL32.dll!CloseHandle
// 0x10009141  nFile::IsOpen  (4 insns)
// 0x1000914a  nFile::Open  (71 insns)
//   calls:   IAT: KERNEL32.dll!CreateFileA
// 0x100091f5  nFile::Close  (10 insns)
//   calls:   IAT: KERNEL32.dll!CloseHandle
// 0x1000920c  nFile::Write  (19 insns)
//   calls:   -> nFileServer2::AddBytesWritten, IAT: KERNEL32.dll!WriteFile
// 0x1000923b  nFile::Read  (19 insns)
//   calls:   -> nFileServer2::AddBytesRead, IAT: KERNEL32.dll!ReadFile
// 0x1000926a  nFile::Tell  (6 insns)
//   calls:   IAT: KERNEL32.dll!SetFilePointer
// 0x1000927a  nFile::Seek  (33 insns)
//   calls:   -> nFileServer2::AddSeek, IAT: KERNEL32.dll!SetFilePointer
// 0x100092c4  nFile::PutS  (20 insns)
// 0x100092ee  nFile::GetS  (73 insns)

} // namespace re_nkernel
