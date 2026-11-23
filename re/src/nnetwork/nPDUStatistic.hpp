#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nPDUStatistic.asm
// Class: nPDUStatistic

#include <cstdint>

namespace re_nnetwork {

struct nPDUStatistic_Layout {
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
};

// Methods (19):
// 0x100070a2  nPDUStatistic::nPDUStatistic()  (31 insns)
// 0x100070f0  nPDUStatistic::operator=  (30 insns)
// 0x1000823e  nPDUStatistic::nPDUStatistic()  (15 insns)
// 0x1000826d  nPDUStatistic::~nPDUStatistic()  (2 insns)
// 0x10008274  nPDUStatistic::GetPDUType  (2 insns)
// 0x10008278  nPDUStatistic::GetNumLocal  (2 insns)
// 0x10008280  nPDUStatistic::IncreaseLocalPDUCount  (2 insns)
// 0x10008284  nPDUStatistic::DecreaseLocalPDUCount  (2 insns)
// 0x10008288  nPDUStatistic::IncreaseRemotePDUCount  (2 insns)
// 0x1000828c  nPDUStatistic::DecreaseRemotePDUCount  (2 insns)
// 0x10008290  nPDUStatistic::IncreaseNumSend  (2 insns)
// 0x10008294  nPDUStatistic::IncreaseNumReceived  (2 insns)
// 0x10008298  nPDUStatistic::GetNumSend  (2 insns)
// 0x1000829c  nPDUStatistic::GetNumReceived  (2 insns)
// 0x100082a0  nPDUStatistic::IncreaseNumBitsSend  (3 insns)
// 0x100082aa  nPDUStatistic::IncreaseNumBitsReceived  (3 insns)
// 0x100082b4  nPDUStatistic::GetNumBitsSend  (2 insns)
// 0x100082b8  nPDUStatistic::GetNumBitsReceived  (2 insns)
// 0x100082bc  nPDUStatistic::Reset  (6 insns)

} // namespace re_nnetwork
