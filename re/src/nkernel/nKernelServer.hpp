#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nKernelServer.asm
// Class: nKernelServer

#include <cstdint>

namespace re_nkernel {

struct nKernelServer_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x001c
    uint32_t field_0x001c;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0c04
    uint32_t field_0x0c04;
    // +0x0c08
    uint32_t field_0x0c08;
    // +0x0c48
    uint32_t field_0x0c48;
    // +0x0c4c
    uint32_t field_0x0c4c;
    // +0x0c50
    uint32_t field_0x0c50;
    // +0x0c54
    uint32_t field_0x0c54;
    // +0x0c58
    uint32_t field_0x0c58;
    // +0x0c5c
    uint32_t field_0x0c5c;
    // +0x0c60
    uint32_t field_0x0c60;
    // +0x0c64
    uint32_t field_0x0c64;
    // +0x0c68
    uint32_t field_0x0c68;
    // +0x0c6c
    uint32_t field_0x0c6c;
};

// Methods (33):
// 0x1000158a  nKernelServer::_isAbsPath  (5 insns)
// 0x10001599  nKernelServer::nKernelServer()  (51 insns)
// 0x10001656  nKernelServer::operator=  (50 insns)
// 0x10005b19  nKernelServer::_openClass  (70 insns)
//   calls:   -> nKernelServer::loadPackage, -> nClass::nClass(), -> nClass::Open
// 0x10005bb8  nKernelServer::_newUnnamedObject  (9 insns)
//   calls:   -> nKernelServer::_openClass, -> nClass::NewObject
// 0x10005bd3  nKernelServer::_lookupPath  (54 insns)
//   calls:   IAT: MSVCRT.dll!strncpy, IAT: MSVCRT.dll!strtok, -> nRoot::Find
// 0x10005c63  nKernelServer::_checkCreatePath  (136 insns)
//   calls:   IAT: MSVCRT.dll!strncpy, IAT: MSVCRT.dll!strtok, -> nRoot::Find, -> nKernelServer::_openClass, -> nClass::NewObject, -> nRoot::SetName, -> nRoot::AddTail, -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'kernel/nkernelserver.cc', 'Path component is empty!'
// 0x10005e05  nKernelServer::nKernelServer()  (131 insns)
//   calls:   -> nKernelServer::Log, -> nn_malloc, -> n_printf, IAT: MSVCRT.dll!abort, -> nHardRefServer::nHardRefServer(), -> nKernelServer::_openClass, -> nClass::NewObject, -> nRoot::SetName, -> nKernelServer::_checkCreatePath, -> nKernelServer::ReadTocFiles
//   strings: 'stdout', 'kernel/nkernelserver.cc', 'Out Of Mem!', 'nroot', '/sys/servers/time', 'ntimeserver', '/sys/servers/file', 'nfileserver'
// 0x10005fb5  nKernelServer::~nKernelServer()  (193 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort, -> nHardRefServer::~nHardRefServer(), -> nKernelServer::Log, -> n_free
//   strings: 'Aborting!', 'kernel/nkernelserver.cc', 'off'
// 0x100061d9  nKernelServer::Log  (118 insns)
//   calls:   IAT: MSVCRT.dll!_iob, IAT: MSVCRT.dll!fclose, IAT: MSVCRT.dll!fopen
//   strings: 'off', 'stdout', 'stderr'
// 0x100062f5  nKernelServer::FlushLog  (21 insns)
//   calls:   IAT: MSVCRT.dll!fflush, IAT: MSVCRT.dll!_iob
// 0x10006329  nKernelServer::AddClass  (21 insns)
//   calls:   -> nClass::AddSubClass, -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'kernel/nkernelserver.cc'
// 0x10006376  nKernelServer::RemClass  (15 insns)
//   calls:   -> nClass::RemSubClass
// 0x10006396  nKernelServer::FindClass  (8 insns)
// 0x100063ae  nKernelServer::OpenClass  (6 insns)
//   calls:   -> nKernelServer::_openClass
// 0x100063c1  nKernelServer::CloseClass  (3 insns)
// 0x100063cb  nKernelServer::GetClassList  (2 insns)
// 0x100063cf  nKernelServer::New  (5 insns)
//   calls:   -> nKernelServer::_checkCreatePath
// 0x100063e1  nKernelServer::NewNoFail  (5 insns)
//   calls:   -> nKernelServer::_checkCreatePath
// 0x100063f3  nKernelServer::Load  (5 insns)
// 0x10006405  nKernelServer::Lookup  (3 insns)
//   calls:   -> nKernelServer::_lookupPath
// 0x10006411  nKernelServer::SetCwdObject  (6 insns)
// 0x10006422  nKernelServer::SetCwd  (9 insns)
//   calls:   -> nKernelServer::_lookupPath
// 0x10006439  nKernelServer::PushCwd  (9 insns)
// 0x10006452  nKernelServer::PopCwd  (11 insns)
// 0x10006469  nKernelServer::PrintF  (32 insns)
//   calls:   IAT: MSVCRT.dll!vfprintf, IAT: MSVCRT.dll!fflush, IAT: MSVCRT.dll!vsprintf
// 0x100064c0  nKernelServer::VPrintF  (24 insns)
//   calls:   IAT: MSVCRT.dll!vfprintf, IAT: MSVCRT.dll!vsprintf
// 0x10006508  nKernelServer::GetLineBuffer  (29 insns)
// 0x10006553  nKernelServer::Trigger  (158 insns)
//   calls:   -> nn_calloc, -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nebula mem manager not active!', 'c:/nomads/code/inc\\kernel/nlinebuffer.h', 'Out Of Mem!'
// 0x100084ac  nKernelServer::loadPackage  (30 insns)
//   calls:   -> n_printf, -> n_dllopen
//   strings: 'n_addmodules'
// 0x100084fa  nKernelServer::readTocFile  (100 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!fgets, IAT: MSVCRT.dll!strpbrk, -> n_strncpy2
// 0x10008614  nKernelServer::ReadTocFiles  (77 insns)
//   calls:   -> nDir::nDir(), -> nDir::Open, -> nDir::Read, IAT: MSVCRT.dll!strstr, -> nKernelServer::readTocFile, -> nDir::~nDir()
//   strings: 'bin:', '.toc'
// 0x100086f9  nKernelServer::AddModule  (53 insns)
//   calls:   -> nClass::nClass(), -> nClass::Open

} // namespace re_nkernel
