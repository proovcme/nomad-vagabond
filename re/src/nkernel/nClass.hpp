#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nClass.asm
// Class: nClass

#include <cstdint>

namespace re_nkernel {

struct nClass_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint8_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint8_t field_0x0028;
    // +0x0029
    uint8_t field_0x0029;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0045
    uint8_t field_0x0045;
    // +0x0048
    double field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    double field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    double field_0x0058;
    // +0x0060
    double field_0x0060;
    // +0x0068
    uint32_t field_0x0068;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0084
    uint32_t field_0x0084;
    // +0x008c
    uint32_t field_0x008c;
    // +0x0090
    uint8_t field_0x0090;
    // +0x0290
    uint32_t field_0x0290;
    // +0x0294
    uint32_t field_0x0294;
    // +0x0298
    uint32_t field_0x0298;
    // +0x029c
    uint32_t field_0x029c;
    // +0x02a0
    uint32_t field_0x02a0;
    // +0x02a4
    uint32_t field_0x02a4;
};

// Script AddCmds (12):
//   v_resettime_v
//   v_stoptime_v
//   v_starttime_v
//   f_gettime_v
//   v_settime_f
//   v_lockdeltat_f
//   v_waitdeltat_f
//   f_getlockdeltat_v
//   f_getwaitdeltat_v
//   v_enableframetime_v
//   v_disableframetime_v
//   f_getframetime_v

// Methods (27):
// 0x100012cd  nClass::AddRef  (3 insns)
// 0x100012d4  nClass::RemRef  (3 insns)
// 0x100012db  nClass::GetRef  (2 insns)
// 0x100012df  nClass::GetCmdList  (2 insns)
// 0x100012e3  nClass::GetSuperClass  (2 insns)
// 0x100012e7  nClass::nClass()  (42 insns)
// 0x10001354  nClass::operator=  (41 insns)
// 0x100013bb  nClass::vfunc_00  (41 insns)
//   calls:   -> nClass::~nClass()
// 0x100014be  nClass::vfunc_01  (41 insns)
//   calls:   -> nRoot::~nRoot()
// 0x1000170d  nClass::vfunc_15  (1241 insns)
//   calls:   -> nKernelServer::~nKernelServer(), -> nRoot::nRoot(), IAT: KERNEL32.dll!QueryPerformanceCounter, -> n_printf, -> nRoot::~nRoot(), IAT: KERNEL32.dll!QueryPerformanceFrequency, -> n_sleep, -> n_strdup, IAT: MSVCRT.dll!sprintf, -> nRoot::AddObjectRef, -> nRoot::RemObjectRef, -> n_free
//   consts:  f64=0
//   strings: 'QueryPerformanceCounter() NOT SUPPORTED!!!', 'kernel/ntime_main.cc', '/sys/var/prof_%s', 'nenv', 'UNKNOWN', 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h', 'v_resettime_v'
// 0x100066e9  nClass::load_class  (212 insns)
//   calls:   -> n_dllopen, -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'nfileserver', 'nfileserver2', 'nscriptserver', 'ntimeserver', 'nenv', 'n_init', 'n_fini'
// 0x10006951  nClass::unload_class  (18 insns)
// 0x1000697d  nClass::nClass()  (31 insns)
// 0x100069d5  nClass::nClass()  (37 insns)
// 0x10006a38  nClass::~nClass()  (44 insns)
//   calls:   -> nClass::unload_class, -> nCmdProto::~nCmdProto()
// 0x10006aa6  nClass::Open  (36 insns)
//   calls:   -> nClass::load_class, -> n_printf
// 0x10006af4  nClass::Close  (1 insns)
//   calls:   -> nClass::unload_class
// 0x10006af9  nClass::NewObject  (16 insns)
// 0x10006b16  nClass::DelObject  (2 insns)
// 0x10006b1c  nClass::BeginCmds  (2 insns)
// 0x10006b21  nClass::AddCmd  (21 insns)
//   calls:   -> nCmdProto::nCmdProto()
// 0x10006b59  nClass::AddCmd  (21 insns)
//   calls:   -> nCmdProto::nCmdProto()
// 0x10006b93  nClass::EndCmds  (90 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Aborting.', 'kernel/nclass.cc'
// 0x10006c72  nClass::FindCmdByName  (14 insns)
//   calls:   -> nClass::FindCmdByName
// 0x10006c99  nClass::FindCmdById  (22 insns)
// 0x10006ccc  nClass::AddSubClass  (4 insns)
// 0x10006cd9  nClass::RemSubClass  (198 insns)
//   calls:   IAT: MSVCRT.dll!memmove

} // namespace re_nkernel
