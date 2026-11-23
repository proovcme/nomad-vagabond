#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nRecentStateManager.asm
// Class: nRecentStateManager

#include <cstdint>

namespace re_nnetwork {

struct nRecentStateManager_Layout {
    // +0x0008
    uint32_t field_0x0008;
    // +0x0030
    uint32_t field_0x0030;
};

// Methods (11):
// 0x100087a4  nRecentStateManager::nRecentStateManager()  (8 insns)
//   calls:   -> nPDUManager::nPDUManager()
// 0x100087ba  nRecentStateManager::~nRecentStateManager()  (2 insns)
//   calls:   -> nPDUManager::~nPDUManager()
// 0x100087c5  nRecentStateManager::Trigger  (22 insns)
//   calls:   -> nPDUManager::Trigger, -> nPDUManager::GetLocals
// 0x100087f9  nRecentStateManager::BeginPackData  (106 insns)
//   calls:   -> nPDUManager::BeginPackData, -> nPDUManager::GetLocals, -> nPDUManager::GetTriggerTime, -> nPDU::SetNeedTransmission, -> nPDUManager::GetRemotes, -> nPDUStatistic::GetNumLocal, -> nPDU::SetState
//   consts:  f64=3
// 0x100088ee  nRecentStateManager::EndPackData  (111 insns)
//   calls:   -> nPDUManager::EndPackData, -> nPDUManager::GetRemotes, -> nPDUStatistic::GetNumLocal, -> nPDUManager::RemoveLocal, -> nPDU::SetNeedTransmission, -> nPDUManager::GetLocals, -> nPDU::NeedTransmission, -> nPDUManager::GetTriggerTime
// 0x100089ea  nRecentStateManager::MakePDU  (25 insns)
//   calls:   -> nEntityStatePDU::nEntityStatePDU(), -> nDataPDU::nDataPDU()
// 0x10008a30  nRecentStateManager::PackData  (43 insns)
//   calls:   -> nPDU::NeedTransmission
// 0x10008a90  nRecentStateManager::UnpackData  (148 insns)
//   calls:   -> nPDUManager::FindRemote, -> nPDUManager::GetTriggerTime, -> nPDU::SetNeedTransmission, -> nPDU::SetChanged, -> nPDUStatistic::GetNumLocal, -> nPDU::SetState, -> nPDU::SetEntityID, -> nPDU::SetStatistic, -> nPDU::GetMachineID, -> nPDUManager::AddRemote, IAT: nkernel.dll!n_printf
// 0x10008c17  nRecentStateManager::nRecentStateManager()  (13 insns)
//   calls:   -> nPDUManager::nPDUManager()
// 0x10008c38  nRecentStateManager::operator=  (12 insns)
//   calls:   -> nPDUManager::operator=
// 0x10008c53  nRecentStateManager::vfunc_00  (43 insns)
//   calls:   -> nPDUManager::~nPDUManager()

} // namespace re_nnetwork
