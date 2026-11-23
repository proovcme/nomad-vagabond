#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nsocket2.asm
// Class: nsocket2 : public nnetwork2  (sizeof = 0x150 = 336 bytes)

#include <cstdint>

namespace re_nnetwork {

struct nsocket2_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0005
    uint8_t field_0x0005;
    // +0x0006
    uint8_t field_0x0006;
    // +0x0007
    uint8_t field_0x0007;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint8_t field_0x000c;
    // +0x000e
    uint8_t field_0x000e;
    // +0x000f
    uint8_t field_0x000f;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x0020
    uint32_t field_0x0020;
    // +0x002c
    uint32_t field_0x002c;
    // +0x002e
    uint8_t field_0x002e;
    // +0x002f
    uint8_t field_0x002f;
    // +0x0030
    uint8_t field_0x0030;
    // +0x0031
    uint8_t field_0x0031;
    // +0x0032
    uint8_t field_0x0032;
    // +0x0033
    uint8_t field_0x0033;
    // +0x0034
    uint8_t field_0x0034;
    // +0x0035
    uint8_t field_0x0035;
    // +0x0036
    uint8_t field_0x0036;
    // +0x0037
    uint8_t field_0x0037;
    // +0x0038
    uint8_t field_0x0038;
    // +0x0039
    uint8_t field_0x0039;
    // +0x003a
    uint8_t field_0x003a;
    // +0x003b
    uint8_t field_0x003b;
    // +0x003c
    uint8_t field_0x003c;
    // +0x003d
    uint8_t field_0x003d;
    // +0x0040
    uint8_t field_0x0040;
    // +0x0041
    uint8_t field_0x0041;
    // +0x0042
    uint8_t field_0x0042;
    // +0x0043
    uint8_t field_0x0043;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0046
    uint32_t field_0x0046;
    // +0x0048
    uint32_t field_0x0048;
    // +0x0055
    uint8_t field_0x0055;
    // +0x0056
    uint8_t field_0x0056;
    // +0x0068
    uint32_t field_0x0068;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0076
    uint32_t field_0x0076;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e8
    uint8_t field_0x00e8;
    // +0x00e9
    uint8_t field_0x00e9;
    // +0x00ea
    uint32_t field_0x00ea;
    // +0x00ec
    uint8_t field_0x00ec;
    // +0x00ed
    uint8_t field_0x00ed;
    // +0x00fe
    uint32_t field_0x00fe;
    // +0x0108
    uint32_t field_0x0108;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0118
    uint32_t field_0x0118;
    // +0x011c
    uint32_t field_0x011c;
    // +0x0120
    uint32_t field_0x0120;
    // +0x0128
    uint8_t field_0x0128;
    // +0x012a
    uint32_t field_0x012a;
    // +0x0138
    uint32_t field_0x0138;
    // +0x013c
    uint8_t field_0x013c;
    // +0x013e
    uint32_t field_0x013e;
    // +0x0140
    uint32_t field_0x0140;
    // +0x0142
    uint8_t field_0x0142;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    uint32_t field_0x0148;
    // +0x014c
    uint32_t field_0x014c;
};

// Script AddCmds (4):
//   b_setport_i
//   i_getport_v
//   v_setlogsystem_b
//   b_getlogsystem_v

// Methods (24):
// 0x100041d8  nsocket2::vfunc_00  (59 insns)
//   calls:   -> nsocket2::vfunc_62, IAT: nkernel.dll!n_free, -> nsocket2::vfunc_63, IAT: KERNEL32.dll!CloseHandle, -> nNetwork2::~nNetwork2()
// 0x10004287  nsocket2::vfunc_57  (16 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x100042c2  nsocket2::vfunc_58  (2 insns)
// 0x100042ca  nsocket2::vfunc_21  (101 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, IAT: MSVCRT.dll!strncpy
//   strings: '/sys/share/provider', '%s/%d/name', 'nenv', 'BSD Sockets using UPD', '%s/%d/class', 'nSocket2', '%s/%d/guid', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0'
// 0x100043f1  nsocket2::vfunc_22  (77 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'network/nsock2_main.cc'
// 0x100044e0  nsocket2::vfunc_14  (33 insns)
//   calls:   IAT: nkernel.dll!n_free, -> nNetwork2::Trigger
// 0x10004530  nsocket2::vfunc_59  (32 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1000458f  nsocket2::n_init_nsocket2  (43 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nnetwork2', 'b_setport_i', 'i_getport_v', 'v_setlogsystem_b', 'b_getlogsystem_v', 'no nnetwork2 class', 'network/nsock2_head.cc'
// 0x10004635  nsocket2::n_fini_nsocket2  (14 insns)
// 0x10004658  nsocket2::n_new_nsocket2  (10 insns)
// 0x10004672  nsocket2::n_version_nsocket2  (1022 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: KERNEL32.dll!SetEvent, IAT: nkernel.dll!nn_malloc, IAT: nkernel.dll!n_free, IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex, IAT: MSVCRT.dll!sprintf
//   strings: '127.0.0.1', 'network/nsock2_threads.cc', 'network/nsock2_machines.cc', '%d.%d.%d.%d', '255.0.0.0', '255.255.0.0', '255.255.255.0', '0.0.0.0'
// 0x100051a3  nsocket2::vfunc_31  (172 insns)
//   strings: 'NEWMACHINE received from'
// 0x10005351  nsocket2::vfunc_62  (8 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject
// 0x1000536a  nsocket2::vfunc_63  (3 insns)
//   calls:   IAT: KERNEL32.dll!ReleaseMutex
// 0x10005377  nsocket2::vfunc_43  (8 insns)
// 0x1000539a  nsocket2::vfunc_39  (267 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex, IAT: nkernel.dll!n_printf
//   strings: 'network/nsock2_messages.cc'
// 0x10005694  nsocket2::vfunc_61  (13 insns)
// 0x100056b4  nsocket2::vfunc_24  (123 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!_errno, IAT: nkernel.dll!n_sleep
//   consts:  f64=5, f64=0.01
//   strings: '/sys/share/sessions', 'network/nsock2_sessions.cc', 'ASKSESSION to'
// 0x10005830  nsocket2::vfunc_60  (57 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!strncpy
//   strings: 'network/nsock2_sessions.cc'
// 0x100058e0  nsocket2::vfunc_26  (75 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: KERNEL32.dll!WaitForSingleObject, IAT: MSVCRT.dll!strncpy, IAT: KERNEL32.dll!ReleaseMutex
//   strings: 'network/nsock2_sessions.cc', 'NEBULA SESSION'
// 0x100059d1  nsocket2::vfunc_28  (102 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex, IAT: KERNEL32.dll!CloseHandle
// 0x10005b09  nsocket2::vfunc_25  (1175 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!sprintf, IAT: MSVCRT.dll!strtok, IAT: MSVCRT.dll!atoi, IAT: KERNEL32.dll!ReleaseMutex, IAT: nkernel.dll!n_sleep, IAT: KERNEL32.dll!WaitForSingleObject, IAT: MSVCRT.dll!strncpy, -> nRoot::GetHead
//   consts:  f64=5, f64=0.01, f64=15
//   strings: 'network/nsock2_sessions.cc', '/sys/share/sessions', '%s/%d/address', 'nSocket2::JoinSession: no address-entry found in /sys/share/session/number', '%s/%d/port', 'nSocket2::JoinSession: no port-entry found in /sys/share/session/number', 'JOINSESSION to', '%s/%d/name'
// 0x1000690f  nsocket2::vfunc_37  (45 insns)
//   calls:   IAT: KERNEL32.dll!CreateEventA, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nEvent::nEvent(): CreateEvent() failed!', 'c:/nomads/code/inc\\kernel/nevent.h'
// 0x10006983  nsocket2::vfunc_13  (53 insns)
//   calls:   -> nNetwork2::Dispatch

} // namespace re_nnetwork
