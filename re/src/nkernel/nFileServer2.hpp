#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nFileServer2.asm
// Class: nFileServer2

#include <cstdint>

namespace re_nkernel {

struct nFileServer2_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
};

// Script AddCmds (2):
//   v_setassign_ss
//   s_getassign_s

// Methods (20):
// 0x10002e53  nFileServer2::nFileServer2()  (57 insns)
//   calls:   -> nRoot::nRoot(), -> n_free, -> n_strdup
// 0x10002ed2  nFileServer2::operator=  (38 insns)
//   calls:   -> nRoot::operator=, -> n_free
// 0x10008c04  nFileServer2::nFileServer2()  (41 insns)
//   calls:   -> nRoot::nRoot()
//   strings: '/sys/share/assigns', 'nroot'
// 0x10008c70  nFileServer2::~nFileServer2()  (20 insns)
//   calls:   -> n_free, -> nRoot::RemObjectRef, -> nRoot::~nRoot()
// 0x10008ca4  nFileServer2::ResetStatistics  (5 insns)
// 0x10008cb0  nFileServer2::AddBytesRead  (3 insns)
// 0x10008cba  nFileServer2::AddBytesWritten  (3 insns)
// 0x10008cc4  nFileServer2::AddSeek  (2 insns)
// 0x10008cc8  nFileServer2::GetBytesRead  (2 insns)
// 0x10008ccc  nFileServer2::GetBytesWritten  (2 insns)
// 0x10008cd0  nFileServer2::GetNumSeeks  (2 insns)
// 0x10008cd4  nFileServer2::SetAssign  (59 insns)
//   calls:   -> n_printf, -> nRoot::Find, IAT: MSVCRT.dll!abort
//   strings: 'nenv', 'Could not create assign object!', 'kernel/nfileserver2_main.cc'
// 0x10008d88  nFileServer2::GetAssign  (18 insns)
//   calls:   -> nRoot::Find, -> n_printf
// 0x10008dbd  nFileServer2::CleanupPathName  (29 insns)
//   calls:   IAT: MSVCRT.dll!tolower
// 0x10008dfa  nFileServer2::MakeAbsolute  (71 insns)
//   calls:   -> n_strncpy2, -> nFileServer2::CleanupPathName
// 0x10008ea1  nFileServer2::ManglePath  (97 insns)
//   calls:   IAT: MSVCRT.dll!strchr, -> n_strncpy2, -> nFileServer2::CleanupPathName
// 0x10008f8c  nFileServer2::NewDirectoryObject  (15 insns)
//   calls:   -> nDirectory::nDirectory()
// 0x10008fac  nFileServer2::NewFileObject  (15 insns)
//   calls:   -> nFile::nFile()
// 0x10008fc9  nFileServer2::ChangeDir  (7 insns)
//   calls:   IAT: MSVCRT.dll!_chdir
// 0x10008fdc  nFileServer2::GetCwd  (99 insns)
//   calls:   IAT: MSVCRT.dll!_getcwd, -> nFileServer2::CleanupPathName, -> n_free, -> n_strdup, -> nClass::BeginCmds, -> nClass::AddCmd, -> nClass::EndCmds
//   strings: 'v_setassign_ss', 's_getassign_s'

} // namespace re_nkernel
