#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nAOIManager.asm
// Class: nAOIManager

#include <cstdint>

namespace re_nnetwork {

struct nAOIManager_Layout {
    // +0x0008
    uint32_t field_0x0008;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint32_t field_0x003c;
    // +0x0040
    uint8_t field_0x0040;
};

// Methods (14):
// 0x10008cba  nAOIManager::nAOIManager()  (13 insns)
//   calls:   -> nPDUManager::nPDUManager()
// 0x10008cde  nAOIManager::~nAOIManager()  (2 insns)
//   calls:   -> nPDUManager::~nPDUManager()
// 0x10008ce9  nAOIManager::Trigger  (6 insns)
//   calls:   -> nPDUManager::Trigger
// 0x10008cfa  nAOIManager::BeginPackData  (1 insns)
//   calls:   -> nPDUManager::BeginPackData
// 0x10008cff  nAOIManager::EndPackData  (71 insns)
//   calls:   -> nPDUManager::EndPackData, -> nPDUManager::GetLocals, -> nPDUStatistic::GetNumLocal, -> nPDU::SetState, -> nPDUManager::GetRemotes
// 0x10008da7  nAOIManager::MakePDU  (2 insns)
// 0x10008dac  nAOIManager::PackData  (109 insns)
//   calls:   -> nPDU::NeedTransmission, -> nPDU::GetMachineID, -> nPDUStatistic::GetNumLocal, -> nPDU::GetEntityType, -> nDataPDU::BeginReadCustom, -> nDataPDU::ReadLong, -> nDataPDU::ReadFloat, -> nDataPDU::ReadBool, -> nDataPDU::EndReadCustom
// 0x10008ed1  nAOIManager::UnpackData  (2 insns)
// 0x10008ed6  nAOIManager::AddPDUManager  (3 insns)
// 0x10008ee0  nAOIManager::SetTargetMachine  (34 insns)
//   calls:   -> nPDUManager::GetLocals, -> nPDUManager::GetRemotes
// 0x10008f37  nAOIManager::IsInInterest  (13 insns)
//   calls:   -> nPDU::GetMachineID, -> nPDUStatistic::GetNumLocal
// 0x10008f5c  nAOIManager::nAOIManager()  (21 insns)
//   calls:   -> nPDUManager::nPDUManager()
// 0x10008f97  nAOIManager::operator=  (20 insns)
//   calls:   -> nPDUManager::operator=
// 0x10008fcc  nAOIManager::vfunc_00  (42 insns)
//   calls:   -> nPDUManager::~nPDUManager()

} // namespace re_nnetwork
