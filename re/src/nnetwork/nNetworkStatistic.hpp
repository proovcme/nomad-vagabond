#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nNetworkStatistic.asm
// Class: nNetworkStatistic

#include <cstdint>

namespace re_nnetwork {

struct nNetworkStatistic_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0010
    uint32_t field_0x0010;
};

// Methods (23):
// 0x1000700a  nNetworkStatistic::nNetworkStatistic()  (15 insns)
// 0x1000702c  nNetworkStatistic::operator=  (14 insns)
// 0x100082cb  nNetworkStatistic::nNetworkStatistic()  (9 insns)
// 0x100082e7  nNetworkStatistic::~nNetworkStatistic()  (19 insns)
// 0x10008313  nNetworkStatistic::SetCurrent  (12 insns)
//   calls:   -> nNetworkStatistic::FindStatistic, -> nNetworkStatistic::MakeStatistic
// 0x10008335  nNetworkStatistic::GetNumLocal  (2 insns)
//   calls:   -> nPDUStatistic::GetNumLocal
// 0x1000833d  nNetworkStatistic::GetNumRemote  (2 insns)
//   calls:   -> nPDU::GetEntityID
// 0x10008345  nNetworkStatistic::GetNumSend  (2 insns)
//   calls:   -> nPDUStatistic::GetNumSend
// 0x1000834d  nNetworkStatistic::GetNumReceived  (2 insns)
//   calls:   -> nPDUStatistic::GetNumReceived
// 0x10008355  nNetworkStatistic::GetNumBitsSend  (2 insns)
//   calls:   -> nPDUStatistic::GetNumBitsSend
// 0x1000835d  nNetworkStatistic::GetNumBitsReceived  (2 insns)
//   calls:   -> nPDUStatistic::GetNumBitsReceived
// 0x10008365  nNetworkStatistic::IncreaseNumLocal  (2 insns)
//   calls:   -> nPDUStatistic::IncreaseLocalPDUCount
// 0x1000836d  nNetworkStatistic::IncreaseNumRemote  (2 insns)
//   calls:   -> nPDUStatistic::IncreaseRemotePDUCount
// 0x10008375  nNetworkStatistic::DecreaseNumLocal  (2 insns)
//   calls:   -> nPDUStatistic::DecreaseLocalPDUCount
// 0x1000837d  nNetworkStatistic::DecreaseNumRemote  (2 insns)
//   calls:   -> nPDUStatistic::DecreaseRemotePDUCount
// 0x10008385  nNetworkStatistic::IncreaseNumSend  (2 insns)
//   calls:   -> nPDUStatistic::IncreaseNumSend
// 0x1000838d  nNetworkStatistic::IncreaseNumReceived  (2 insns)
//   calls:   -> nPDUStatistic::IncreaseNumReceived
// 0x10008395  nNetworkStatistic::IncreaseNumBitsSend  (4 insns)
//   calls:   -> nPDUStatistic::IncreaseNumBitsSend
// 0x100083a4  nNetworkStatistic::IncreaseNumBitsReceived  (4 insns)
//   calls:   -> nPDUStatistic::IncreaseNumBitsReceived
// 0x100083b3  nNetworkStatistic::GetStatistic  (11 insns)
//   calls:   -> nNetworkStatistic::FindStatistic, -> nNetworkStatistic::MakeStatistic
// 0x100083d2  nNetworkStatistic::FindStatistic  (33 insns)
//   calls:   -> nPDUStatistic::GetPDUType
// 0x1000841c  nNetworkStatistic::MakeStatistic  (25 insns)
//   calls:   -> nPDUStatistic::nPDUStatistic()
// 0x10008459  nNetworkStatistic::Reset  (32 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nPDUStatistic::Reset

} // namespace re_nnetwork
