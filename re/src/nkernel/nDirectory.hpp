#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nDirectory.asm
// Class: nDirectory

#include <cstdint>

namespace re_nkernel {

struct nDirectory_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint8_t field_0x0008;
    // +0x0208
    uint8_t field_0x0208;
    // +0x020c
    uint32_t field_0x020c;
    // +0x0410
    uint32_t field_0x0410;
    // +0x0414
    uint8_t field_0x0414;
};

// Methods (15):
// 0x10002ce4  nDirectory::nDirectory()  (29 insns)
// 0x10002d52  nDirectory::operator=  (48 insns)
// 0x10002de3  nDirectory::vfunc_00  (41 insns)
//   calls:   -> nDirectory::~nDirectory()
// 0x10002e44  nDirectory::IsOpen  (3 insns)
// 0x10002e4c  nDirectory::GetPathName  (2 insns)
// 0x10002f26  nDirectory::vfunc_09  (41 insns)
//   calls:   -> nFileServer2::~nFileServer2()
// 0x100093a3  nDirectory::nDirectory()  (7 insns)
// 0x100093c0  nDirectory::~nDirectory()  (12 insns)
//   calls:   -> n_printf, -> nDirectory::Close
// 0x100093e3  nDirectory::Open  (61 insns)
//   calls:   IAT: KERNEL32.dll!GetFileAttributesA
// 0x1000947e  nDirectory::Close  (14 insns)
//   calls:   IAT: KERNEL32.dll!FindClose
// 0x100094a3  nDirectory::IsEmpty  (2 insns)
// 0x100094aa  nDirectory::SetToFirstEntry  (118 insns)
//   calls:   IAT: KERNEL32.dll!FindClose, IAT: KERNEL32.dll!FindFirstFileA, IAT: KERNEL32.dll!FindNextFileA
//   strings: '/*.*', '..'
// 0x100095e1  nDirectory::SetToNextEntry  (13 insns)
//   calls:   IAT: KERNEL32.dll!FindNextFileA
// 0x10009608  nDirectory::GetEntryName  (61 insns)
// 0x1000968e  nDirectory::GetEntryType  (164 insns)
//   calls:   IAT: MSVCRT.dll!??2@YAPAXI@Z, IAT: MSVCRT.dll!??3@YAXPAX@Z, IAT: MSVCRT.dll!_ftol, IAT: MSVCRT.dll!_adjust_fdiv, IAT: MSVCRT.dll!malloc, IAT: MSVCRT.dll!free, IAT: MSVCRT.dll!_initterm, IAT: KERNEL32.dll!DisableThreadLibraryCalls

} // namespace re_nkernel
