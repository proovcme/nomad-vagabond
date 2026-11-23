#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nNetwork2.asm
// Class: nNetwork2 : public nroot  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnetwork {

struct nNetwork2_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0006
    uint8_t field_0x0006;
    // +0x0008
    double field_0x0008;
    // +0x000a
    uint32_t field_0x000a;
    // +0x000c
    float field_0x000c;
    // +0x000e
    uint32_t field_0x000e;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001a
    uint8_t field_0x001a;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    double field_0x0020;
    // +0x0028
    double field_0x0028;
    // +0x0030
    double field_0x0030;
    // +0x0038
    double field_0x0038;
    // +0x0040
    double field_0x0040;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0076
    uint32_t field_0x0076;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0084
    uint32_t field_0x0084;
    // +0x0088
    uint32_t field_0x0088;
    // +0x008c
    uint32_t field_0x008c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x0094
    uint32_t field_0x0094;
    // +0x0098
    uint32_t field_0x0098;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b0
    double field_0x00b0;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00c0
    double field_0x00c0;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00cc
    uint32_t field_0x00cc;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
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
    // +0x0100
    double field_0x0100;
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
    // +0x0124
    uint8_t field_0x0124;
    // +0x0128
    uint8_t field_0x0128;
    // +0x012a
    uint32_t field_0x012a;
    // +0x0142
    uint8_t field_0x0142;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    uint32_t field_0x0148;
    // +0x014c
    uint32_t field_0x014c;
};

// Script AddCmds (24):
//   b_setguid_iiiiiiiiiiiiiiii
//   v_setsenddelay_f
//   f_getsenddelay_v
//   v_trigger_v
//   b_setprovider_i
//   i_askprovider_v
//   b_lock_b
//   i_asksessions_bsi
//   b_closesession_v
//   b_kickoffmachine_i
//   i_getnummachines_v
//   i_gethostid_v
//   b_ishost_v
//   b_isjoined_v
//   b_sendstring_s
//   b_sendvalue_i
//   b_sendexit_v
//   b_sendstringto_si
//   b_sendvalueto_ii
//   b_sendexitto_i
//   v_setdropmsg_i
//   i_getdropmsg_v
//   v_setlan_b
//   b_islan_v

// Methods (61):
// 0x10001b5d  nNetwork2::n_init_nnetwork2  (147 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'b_setguid_iiiiiiiiiiiiiiii', 'iiiiiiiiiiiiiiii_getguid_v', 'v_setsenddelay_f', 'f_getsenddelay_v', 'v_trigger_v', 'b_setprovider_i', 'i_askprovider_v'
// 0x10001dc1  nNetwork2::n_fini_nnetwork2  (14 insns)
// 0x10001de4  nNetwork2::n_new_nnetwork2  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual constructor called!', 'network/nnet2_head.cc'
// 0x10001e04  nNetwork2::n_version_nnetwork2  (2 insns)
// 0x10001f19  nNetwork2::SetSendDelay  (3 insns)
// 0x10001f26  nNetwork2::GetSendDelay  (2 insns)
// 0x10001f2d  nNetwork2::SetSessionName  (7 insns)
//   calls:   IAT: MSVCRT.dll!strncpy
// 0x10001f43  nNetwork2::GetSessionName  (2 insns)
// 0x10001f47  nNetwork2::IsHost  (2 insns)
// 0x10001f4e  nNetwork2::IsJoined  (2 insns)
// 0x10001f55  nNetwork2::IsLocked  (2 insns)
// 0x10001f5c  nNetwork2::SetHostID  (3 insns)
// 0x10001f68  nNetwork2::GetHostID  (2 insns)
// 0x10001f6d  nNetwork2::ObtainMachineData  (4 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject
// 0x10001f79  nNetwork2::ReleaseMachineData  (3 insns)
//   calls:   IAT: KERNEL32.dll!ReleaseMutex
// 0x10001f83  nNetwork2::GetMachineList  (2 insns)
// 0x10001f87  nNetwork2::SetMaxNumMachines  (3 insns)
// 0x10001f93  nNetwork2::GetMaxNumMachines  (2 insns)
// 0x10001f98  nNetwork2::SetBufferUser  (3 insns)
// 0x10001fa7  nNetwork2::GetBufferUser  (2 insns)
// 0x10001faf  nNetwork2::ObtainProtocolList  (8 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject
// 0x10001fc8  nNetwork2::ReleaseProtocolList  (3 insns)
//   calls:   IAT: KERNEL32.dll!ReleaseMutex
// 0x10001fd5  nNetwork2::nNetwork2()  (95 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000216e  nNetwork2::operator=  (104 insns)
//   calls:   -> nRoot::operator=
// 0x1000231b  nNetwork2::vfunc_00  (41 insns)
//   calls:   -> nNetwork2::~nNetwork2()
// 0x1000237c  nNetwork2::nNetwork2()  (86 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: nkernel.dll!nn_malloc, IAT: MSVCRT.dll!abort
//   consts:  f64=0.06
//   strings: 'patch2          ', 'network/nnet2_main.cc', 'nNetwork2::Network2: no memory'
// 0x100024b5  nNetwork2::~nNetwork2()  (56 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex, IAT: nkernel.dll!n_free, IAT: KERNEL32.dll!CloseHandle
// 0x10002556  nNetwork2::SetGUID  (21 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1000258f  nNetwork2::GetGUID  (11 insns)
// 0x100025a4  nNetwork2::CheckRemoteStart  (4 insns)
// 0x100025b0  nNetwork2::GetMaxPathNumber  (38 insns)
//   calls:   -> nRoot::GetHead, IAT: MSVCRT.dll!atoi
// 0x1000260c  nNetwork2::Trigger  (33 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: nkernel.dll!n_free, IAT: KERNEL32.dll!ReleaseMutex
// 0x10002666  nNetwork2::SetLAN  (3 insns)
// 0x10002673  nNetwork2::IsLAN  (33 insns)
//   calls:   IAT: KERNEL32.dll!CreateMutexA, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nMutex::nMutex(): CreateMutex() failed!', 'c:/nomads/code/inc\\kernel/nmutex.h'
// 0x100026ce  nNetwork2::LockSession  (4 insns)
// 0x100026dd  nNetwork2::SetHost  (53 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex
// 0x10002780  nNetwork2::AddMachine  (61 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex
// 0x10002824  nNetwork2::RemoveMachine  (31 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex
// 0x10002871  nNetwork2::GetMaxMachineID  (30 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex
// 0x100028b7  nNetwork2::FindMachineNode  (30 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex
// 0x10002900  nNetwork2::FindLocalMachineNode  (29 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex
// 0x10002942  nNetwork2::GetNumMachines  (26 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex
// 0x1000297c  nNetwork2::IsConnected  (74 insns)
//   consts:  f64=0, f64=30
// 0x10002a40  nNetwork2::DebugReceive  (208 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!sprintf
//   strings: 'unknown', 'nothing', 'exit', '---', 'value', '%d', 'string', 'system'
// 0x10002c66  nNetwork2::Send  (72 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: nkernel.dll!nn_malloc, IAT: nkernel.dll!n_free
//   strings: 'network/nnet2_messages.cc'
// 0x10002d36  nNetwork2::Receive  (74 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10002e12  nNetwork2::InsertSystemMessage  (78 insns)
//   calls:   IAT: nkernel.dll!nn_malloc, IAT: nkernel.dll!n_printf, IAT: nkernel.dll!n_free
//   strings: 'network/nnet2_messages.cc'
// 0x10002ee4  nNetwork2::HandleProtocolMessage  (87 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex
//   consts:  f64=0.5, f64=9, f64=0.1
// 0x10002fe9  nNetwork2::FlushBuffer  (53 insns)
// 0x10003082  nNetwork2::AddToBuffer  (111 insns)
// 0x100031ea  nNetwork2::AskLatency  (42 insns)
//   consts:  f64=5
// 0x10003271  nNetwork2::GetLatencyInfo  (115 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject, IAT: KERNEL32.dll!ReleaseMutex
// 0x1000339c  nNetwork2::CalcSendReceiveStatistics  (107 insns)
//   consts:  f64=10
// 0x10003523  nNetwork2::GetSendReceiveStatistics  (8 insns)
// 0x1000353c  nNetwork2::InitSendReceiveStatistics  (21 insns)
// 0x1000357f  nNetwork2::IsBufferEmpty  (4 insns)
// 0x1000358f  nNetwork2::PrepareMessage  (5 insns)
// 0x100035af  nNetwork2::GetDropMsg  (2 insns)
// 0x100035b6  nNetwork2::SimulateSendBug  (23 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x100035f1  nNetwork2::Dispatch  (873 insns)
//   calls:   -> nNetwork2::GetDropMsg, IAT: MSVCRT.dll!strncpy, IAT: MSVCRT.dll!strtok, IAT: MSVCRT.dll!atoi, -> nCommServer::SetDRThreshold, -> nClass::vfunc_38, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, -> nNetwork2::nNetwork2()
//   strings: 'all'
// 0x1000c260  nNetwork2::vfunc_21  (168 insns)
//   calls:   IAT: MSVCRT.dll!_purecall, IAT: MSVCRT.dll!_ftol, IAT: MSVCRT.dll!_CIacos, IAT: MSVCRT.dll!_adjust_fdiv, IAT: MSVCRT.dll!malloc, IAT: MSVCRT.dll!free, IAT: MSVCRT.dll!_initterm, IAT: KERNEL32.dll!DisableThreadLibraryCalls

} // namespace re_nnetwork
