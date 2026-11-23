#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nDir.asm
// Class: nDir

#include <cstdint>

namespace re_nkernel {

struct nDir_Layout {
    // +0x0203
    uint8_t field_0x0203;
    // +0x0204
    uint32_t field_0x0204;
    // +0x0208
    uint32_t field_0x0208;
    // +0x02a0
    uint32_t field_0x02a0;
};

// Methods (9):
// 0x10002f81  nDir::nDir()  (19 insns)
// 0x10002fbe  nDir::operator=  (28 insns)
// 0x10003007  nDir::vfunc_00  (366 insns)
//   calls:   -> nDir::~nDir(), -> n_printf, -> n_strdup, -> nRoot::Find, IAT: MSVCRT.dll!abort, -> n_free, IAT: MSVCRT.dll!strchr, IAT: KERNEL32.dll!GetModuleHandleA, IAT: KERNEL32.dll!GetModuleFileNameA, IAT: MSVCRT.dll!strrchr, -> n_strncpy2, IAT: MSVCRT.dll!tolower
//   strings: 'nenv', 'Could not create assign object!', 'kernel/nfile_assigns.cc', 'nkernel.dll', 'home', 'bin/win32/', 'bin'
// 0x10008985  nDir::nDir()  (15 insns)
// 0x100089af  nDir::~nDir()  (7 insns)
//   calls:   IAT: KERNEL32.dll!FindClose
// 0x100089c7  nDir::Open  (102 insns)
//   calls:   IAT: MSVCRT.dll!_getcwd, IAT: MSVCRT.dll!strncpy, IAT: KERNEL32.dll!GetFileAttributesA
// 0x10008ad7  nDir::Read  (65 insns)
//   calls:   IAT: KERNEL32.dll!FindFirstFileA, IAT: KERNEL32.dll!FindNextFileA
//   strings: '/*.*'
// 0x10008b81  nDir::Rewind  (10 insns)
//   calls:   IAT: KERNEL32.dll!FindClose
// 0x10008b9e  nDir::IsSubDir  (4 insns)

} // namespace re_nkernel
