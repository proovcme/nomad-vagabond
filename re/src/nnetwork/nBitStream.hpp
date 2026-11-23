#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nBitStream.asm
// Class: nBitStream

#include <cstdint>

namespace re_nnetwork {

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

// Methods (6):
// 0x10006bab  nBitStream::nBitStream()  (29 insns)
// 0x10006c13  nBitStream::vfunc_00  (40 insns)
// 0x10006cb1  nBitStream::WriteBit  (20 insns)
// 0x10006d32  nBitStream::ReadBit  (25 insns)
// 0x10007048  nBitStream::vfunc_01  (40 insns)
//   calls:   -> nNetworkStatistic::~nNetworkStatistic()
// 0x10007138  nBitStream::vfunc_02  (41 insns)
//   calls:   -> nPDUStatistic::~nPDUStatistic()

} // namespace re_nnetwork
