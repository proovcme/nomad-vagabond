#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nBitStream.asm
// Class: nBitStream

#include <cstdint>

namespace re_nnomads {

struct nBitStream_Layout {
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
    // +0x0021
    uint8_t field_0x0021;
};

// Methods (38):
// 0x10006dd5  nBitStream::nBitStream()  (29 insns)
// 0x10006e1d  nBitStream::vfunc_00  (40 insns)
// 0x10006e77  nBitStream::WriteBit  (20 insns)
// 0x10006eaa  nBitStream::ReadBit  (25 insns)
// 0x10006fad  nBitStream::vfunc_01  (41 insns)
// 0x100070bc  nBitStream::vfunc_17  (41 insns)
// 0x10007519  nBitStream::vfunc_28  (41 insns)
// 0x10079504  nBitStream::vfunc_27  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::UnlockUserData
// 0x1007950a  nBitStream::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::LockUserData
// 0x10079510  nBitStream::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::PutMsg
// 0x10079516  nBitStream::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::ReplyMsg
// 0x1007951c  nBitStream::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::GetMsg
// 0x10079522  nBitStream::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::WaitMsg
// 0x10079528  nBitStream::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::ThreadHarakiri
// 0x1007952e  nBitStream::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::ThreadSleep
// 0x10079534  nBitStream::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::ThreadStopRequested
// 0x1007953a  nBitStream::vfunc_18  (2 insns)
//   calls:   IAT: nkernel.dll!nThread::ThreadStarted, IAT: nkernel.dll!nThread::~nThread()
// 0x10079c06  nBitStream::vfunc_12  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::Unpack
// 0x10079c0c  nBitStream::vfunc_11  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::Pack
// 0x10079c12  nBitStream::vfunc_10  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::Restore
// 0x10079c18  nBitStream::vfunc_09  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::Save
// 0x10079c3c  nBitStream::vfunc_03  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::SetTimestamp
// 0x10079c42  nBitStream::vfunc_02  (2 insns)
//   calls:   IAT: nnetwork.dll!nPDU::GetType, IAT: nnetwork.dll!nPDU::~nPDU()
// 0x10079cba  nBitStream::vfunc_63  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::GetNumMachines
// 0x10079cc0  nBitStream::vfunc_62  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::FindLocalMachineNode
// 0x10079cc6  nBitStream::vfunc_61  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::FindMachineNode
// 0x10079ccc  nBitStream::vfunc_60  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::GetMaxMachineID
// 0x10079cd2  nBitStream::vfunc_58  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::RemoveMachine
// 0x10079cd8  nBitStream::vfunc_57  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::AddMachine
// 0x10079cde  nBitStream::vfunc_55  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::LockSession
// 0x10079ce4  nBitStream::vfunc_51  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::CheckRemoteStart
// 0x10079cea  nBitStream::vfunc_48  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::IsLAN
// 0x10079cf0  nBitStream::vfunc_47  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::SetLAN
// 0x10079cf6  nBitStream::vfunc_44  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::GetGUID
// 0x10079cfc  nBitStream::vfunc_43  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::SetGUID
// 0x10079d02  nBitStream::vfunc_42  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::Trigger
// 0x10079d08  nBitStream::vfunc_41  (2 insns)
//   calls:   IAT: nnetwork.dll!nNetwork2::Dispatch, IAT: nnetwork.dll!nNetwork2::~nNetwork2()
// 0x10079f18  nBitStream::vfunc_13  (166 insns)
//   calls:   IAT: MSVCRT.dll!_purecall, IAT: MSVCRT.dll!_CIacos, IAT: MSVCRT.dll!_CIasin, IAT: MSVCRT.dll!_adjust_fdiv, IAT: MSVCRT.dll!malloc, IAT: MSVCRT.dll!free, IAT: MSVCRT.dll!_initterm, IAT: KERNEL32.dll!DisableThreadLibraryCalls

} // namespace re_nnomads
