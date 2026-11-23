#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nNetwork2.asm
// Class: nNetwork2

#include <cstdint>

namespace re_nnomads {

struct nNetwork2_Layout {
    // +0x0044
    uint32_t field_0x0044;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0076
    uint32_t field_0x0076;
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
};

// Methods (38):
// 0x10007117  nNetwork2::SetSendDelay  (3 insns)
// 0x10007124  nNetwork2::GetSendDelay  (2 insns)
// 0x1000712b  nNetwork2::SetSessionName  (7 insns)
//   calls:   IAT: MSVCRT.dll!strncpy
// 0x10007141  nNetwork2::GetSessionName  (2 insns)
// 0x10007145  nNetwork2::IsHost  (2 insns)
// 0x1000714c  nNetwork2::IsJoined  (2 insns)
// 0x10007153  nNetwork2::IsLocked  (2 insns)
// 0x1000715a  nNetwork2::SetHostID  (3 insns)
// 0x10007166  nNetwork2::GetHostID  (2 insns)
// 0x1000716b  nNetwork2::ObtainMachineData  (4 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject
// 0x10007177  nNetwork2::ReleaseMachineData  (3 insns)
//   calls:   IAT: KERNEL32.dll!ReleaseMutex
// 0x10007181  nNetwork2::GetMachineList  (2 insns)
// 0x10007185  nNetwork2::SetMaxNumMachines  (3 insns)
// 0x10007191  nNetwork2::GetMaxNumMachines  (2 insns)
// 0x10007196  nNetwork2::SetBufferUser  (3 insns)
// 0x100071a5  nNetwork2::GetBufferUser  (2 insns)
// 0x100071ad  nNetwork2::ObtainProtocolList  (8 insns)
//   calls:   IAT: KERNEL32.dll!WaitForSingleObject
// 0x100071c6  nNetwork2::ReleaseProtocolList  (3 insns)
//   calls:   IAT: KERNEL32.dll!ReleaseMutex
// 0x100071d3  nNetwork2::nNetwork2()  (95 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000736c  nNetwork2::operator=  (104 insns)
//   calls:   -> nRoot::operator=
// 0x10079c4e  nNetwork2::vfunc_56  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::GetMaxPathNumber
// 0x10079c54  nNetwork2::vfunc_55  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::InitSendReceiveStatistics
// 0x10079c5a  nNetwork2::vfunc_54  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::CalcSendReceiveStatistics
// 0x10079c60  nNetwork2::vfunc_53  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::GetSendReceiveStatistics
// 0x10079c66  nNetwork2::vfunc_52  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::AskLatency
// 0x10079c6c  nNetwork2::vfunc_51  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::GetLatencyInfo
// 0x10079c72  nNetwork2::vfunc_50  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::SimulateSendBug
// 0x10079c78  nNetwork2::vfunc_49  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::PrepareMessage
// 0x10079c7e  nNetwork2::vfunc_48  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::DebugReceive
// 0x10079c84  nNetwork2::vfunc_47  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::IsBufferEmpty
// 0x10079c8a  nNetwork2::vfunc_46  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::HandleProtocolMessage
// 0x10079c90  nNetwork2::vfunc_45  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::AddToBuffer
// 0x10079c96  nNetwork2::vfunc_44  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::FlushBuffer
// 0x10079c9c  nNetwork2::vfunc_42  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::InsertSystemMessage
// 0x10079ca2  nNetwork2::vfunc_41  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::Receive
// 0x10079ca8  nNetwork2::vfunc_40  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::Send
// 0x10079cae  nNetwork2::vfunc_38  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::IsConnected
// 0x10079cb4  nNetwork2::vfunc_36  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::SetHost

} // namespace re_nnomads
