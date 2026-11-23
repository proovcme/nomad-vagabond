#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nPDU.asm
// Class: nPDU

#include <cstdint>

namespace re_nnetwork {

struct nPDU_Layout {
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x001e
    uint32_t field_0x001e;
    // +0x0020
    uint8_t field_0x0020;
    // +0x0021
    uint8_t field_0x0021;
    // +0x0028
    double field_0x0028;
    // +0x0030
    uint8_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint32_t field_0x003c;
};

// Methods (33):
// 0x10006a3f  nPDU::nPDU()  (20 insns)
// 0x10006a84  nPDU::~nPDU()  (2 insns)
// 0x10006a8b  nPDU::SetState  (6 insns)
// 0x10006a9e  nPDU::CheckStateOrder  (48 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10006b13  nPDU::CheckTypeAndID  (37 insns)
// 0x10006b6a  nPDU::GetType  (3 insns)
// 0x10006b6e  nPDU::SetEntityID  (3 insns)
// 0x10006b78  nPDU::GetMachineID  (3 insns)
// 0x10006b7f  nPDU::SetGroupID  (3 insns)
// 0x10006b8b  nPDU::GetGroupID  (2 insns)
// 0x10006b90  nPDU::SetEntityType  (3 insns)
// 0x10006b9c  nPDU::GetEntityType  (2 insns)
// 0x10006ba1  nPDU::SetChanged  (3 insns)
// 0x10006bf3  nPDU::HasChanged  (2 insns)
// 0x10006bf7  nPDU::SetNeedTransmission  (3 insns)
// 0x10006c01  nPDU::NeedTransmission  (2 insns)
// 0x10006c05  nPDU::SetTimestamp  (3 insns)
// 0x10006c0f  nPDU::GetTimestamp  (2 insns)
// 0x10006c6d  nPDU::IsGhost  (2 insns)
// 0x10006c71  nPDU::PackData  (25 insns)
//   calls:   -> nNetworkStatistic::IncreaseNumSend, -> nNetworkStatistic::IncreaseNumBitsSend
// 0x10006ce4  nPDU::UnpackData  (31 insns)
//   calls:   -> nNetworkStatistic::IncreaseNumReceived, -> nNetworkStatistic::IncreaseNumBitsReceived
// 0x10006d67  nPDU::Restore  (1 insns)
// 0x10006d68  nPDU::nPDU()  (39 insns)
// 0x10006dd2  nPDU::Pack  (63 insns)
// 0x10006e6c  nPDU::operator=  (38 insns)
// 0x10006ed0  nPDU::Unpack  (41 insns)
// 0x10006f2d  nPDU::vfunc_00  (35 insns)
// 0x10006f80  nPDU::GetStatistic  (2 insns)
// 0x10006f84  nPDU::GetHeartBeatTime  (2 insns)
//   consts:  f64=15
// 0x10006f8b  nPDU::SetStatistic  (37 insns)
//   calls:   -> nNetworkStatistic::SetCurrent, -> nNetworkStatistic::IncreaseNumRemote, -> nNetworkStatistic::IncreaseNumLocal, -> nNetworkStatistic::DecreaseNumRemote, -> nNetworkStatistic::DecreaseNumLocal
// 0x10006ff6  nPDU::IncreaseNumBitsWritten  (3 insns)
// 0x10007000  nPDU::IncreaseNumBitsRead  (3 insns)
// 0x1000827c  nPDU::GetEntityID  (2 insns)

} // namespace re_nnetwork
