#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nThread.asm
// Class: nThread

#include <cstdint>

namespace re_nkernel {

struct nThread_Layout {
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
    // +0x0019
    uint8_t field_0x0019;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint8_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
};

// Methods (15):
// 0x10004274  nThread::nThread()  (30 insns)
// 0x100042d1  nThread::operator=  (29 insns)
// 0x10004328  nThread::vfunc_00  (60 insns)
//   calls:   -> nThread::~nThread(), -> nRoot::nRoot()
// 0x10007664  nThread::nThread()  (76 insns)
//   calls:   IAT: MSVCRT.dll!_beginthreadex, -> n_printf, IAT: MSVCRT.dll!abort, IAT: KERNEL32.dll!WaitForSingleObject
//   strings: 'kernel/nthread.cc'
// 0x1000773d  nThread::~nThread()  (82 insns)
//   calls:   IAT: KERNEL32.dll!SetEvent, IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!CloseHandle, IAT: KERNEL32.dll!ReleaseMutex
// 0x10007814  nThread::ThreadHarakiri  (11 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: MSVCRT.dll!_endthreadex
// 0x10007831  nThread::ThreadStarted  (3 insns)
//   calls:   IAT: KERNEL32.dll!SetEvent
// 0x1000783b  nThread::ThreadStopRequested  (2 insns)
// 0x1000783f  nThread::ThreadSleep  (8 insns)
//   calls:   -> n_sleep
// 0x10007852  nThread::GetMsg  (17 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex
// 0x1000787f  nThread::ReplyMsg  (15 insns)
// 0x100078a1  nThread::WaitMsg  (5 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject
// 0x100078b0  nThread::PutMsg  (35 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex, IAT: KERNEL32.dll!SetEvent
// 0x10007913  nThread::LockUserData  (10 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject
// 0x1000792c  nThread::UnlockUserData  (3 insns)
//   calls:   IAT: KERNEL32.dll!ReleaseMutex

} // namespace re_nkernel
