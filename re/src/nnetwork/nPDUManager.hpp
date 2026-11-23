#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nPDUManager.asm
// Class: nPDUManager

#include <cstdint>

namespace re_nnetwork {

struct nPDUManager_Layout {
    // +0x0008
    double field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint8_t field_0x0028;
    // +0x002a
    uint32_t field_0x002a;
    // +0x002c
    uint32_t field_0x002c;
};

// Methods (21):
// 0x100084a3  nPDUManager::nPDUManager()  (30 insns)
//   calls:   -> nNetworkStatistic::nNetworkStatistic()
// 0x100084f6  nPDUManager::~nPDUManager()  (12 insns)
//   calls:   -> nPDUManager::Reset
// 0x10008513  nPDUManager::Reset  (43 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nNetworkStatistic::Reset
// 0x10008578  nPDUManager::Trigger  (3 insns)
// 0x10008582  nPDUManager::BeginPackData  (2 insns)
// 0x10008587  nPDUManager::EndPackData  (2 insns)
// 0x1000858c  nPDUManager::GetTriggerTime  (2 insns)
// 0x10008590  nPDUManager::AddLocal  (22 insns)
//   calls:   -> nPDU::SetStatistic
// 0x100085c3  nPDUManager::FindLocal  (33 insns)
//   calls:   -> nPDU::GetEntityID
// 0x1000860d  nPDUManager::GetLocals  (2 insns)
// 0x10008611  nPDUManager::AddRemote  (22 insns)
//   calls:   -> nPDU::SetStatistic
// 0x10008644  nPDUManager::FindRemote  (33 insns)
//   calls:   -> nPDU::GetEntityID
// 0x1000868e  nPDUManager::RemoveLocal  (13 insns)
//   calls:   -> nPDU::SetStatistic
// 0x100086b3  nPDUManager::GetRemotes  (2 insns)
// 0x100086b7  nPDUManager::IsInBeginPackData  (2 insns)
// 0x100086bb  nPDUManager::SetMachineID  (3 insns)
// 0x100086c7  nPDUManager::GetMachineID  (2 insns)
// 0x100086cc  nPDUManager::GetStatistic  (2 insns)
// 0x100086d0  nPDUManager::nPDUManager()  (26 insns)
// 0x1000870f  nPDUManager::operator=  (25 insns)
// 0x10008748  nPDUManager::vfunc_00  (41 insns)
//   calls:   -> nPDUManager::~nPDUManager()

} // namespace re_nnetwork
