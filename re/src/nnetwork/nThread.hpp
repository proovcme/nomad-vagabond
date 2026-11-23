#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nThread.asm
// Class: nThread

#include <cstdint>

namespace re_nnetwork {

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

// Methods (13):
// 0x10001e0a  nThread::nThread()  (30 insns)
// 0x10001e67  nThread::operator=  (29 insns)
// 0x10001ebe  nThread::vfunc_00  (41 insns)
// 0x1000c0de  nThread::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::UnlockUserData
// 0x1000c0e4  nThread::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::LockUserData
// 0x1000c0ea  nThread::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::PutMsg
// 0x1000c0f0  nThread::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::ReplyMsg
// 0x1000c0f6  nThread::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::GetMsg
// 0x1000c0fc  nThread::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::WaitMsg
// 0x1000c102  nThread::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::ThreadHarakiri
// 0x1000c108  nThread::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::ThreadSleep
// 0x1000c10e  nThread::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nThread::ThreadStopRequested
// 0x1000c114  nThread::vfunc_01  (67 insns)
//   calls:   IAT: nkernel.dll!nThread::ThreadStarted, IAT: nkernel.dll!nThread::~nThread(), IAT: nkernel.dll!nThread::nThread(), IAT: nkernel.dll!nRoot::Find, IAT: nkernel.dll!nBitStream::ReadInt, IAT: nkernel.dll!nBitStream::SetPos, IAT: nkernel.dll!nBitStream::GetPos, IAT: nkernel.dll!nBitStream::~nBitStream(), IAT: nkernel.dll!nBitStream::WriteInt, IAT: nkernel.dll!nBitStream::BitsLeft, IAT: nkernel.dll!nBitStream::GetSize, IAT: nkernel.dll!nBitStream::nBitStream()

} // namespace re_nnetwork
