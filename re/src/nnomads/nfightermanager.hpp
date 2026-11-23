#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nfightermanager.asm
// Class: nfightermanager : public ntaskmanager  (sizeof = 0xc5c = 3164 bytes)

#include <cstdint>

namespace re_nnomads {

struct nfightermanager_Layout {
    // +0x000c
    uint32_t field_0x000c;
    // +0x000e
    uint8_t field_0x000e;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint8_t field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint32_t field_0x0058;
    // +0x0208
    uint32_t field_0x0208;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x0f14
    uint32_t field_0x0f14;
};

// Methods (16):
// 0x10065145  nfightermanager::vfunc_16  (23 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
//   strings: 'ngarage'
// 0x100651d1  nfightermanager::vfunc_18  (37 insns)
//   calls:   -> nconsumption::vfunc_37
// 0x10065223  nfightermanager::vfunc_21  (111 insns)
//   calls:   -> nContainer::GetMatrix44
// 0x10065348  nfightermanager::vfunc_22  (66 insns)
// 0x10065406  nfightermanager::n_init_nfightermanager  (10 insns)
//   strings: 'ntaskmanager'
// 0x10065427  nfightermanager::n_fini_nfightermanager  (5 insns)
// 0x10065439  nfightermanager::n_new_nfightermanager  (66 insns)
//   strings: '/commandlists/airplane/attackstatic', '/commandlists/airplane/attack', '/commandlists/vehicle/goto'
// 0x100654e1  nfightermanager::vfunc_00  (12 insns)
// 0x10065503  nfightermanager::vfunc_20  (52 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10065570  nfightermanager::vfunc_19  (129 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nRealWorld::IsEnemy, -> nContainer::IsVehicleClass, -> nviewer2::vfunc_18
//   strings: 'concret.technical.static'
// 0x100656f1  nfightermanager::vfunc_23  (334 insns)
//   calls:   -> nRealWorld::FindObjectBySymbolicName, -> nRealWorld::IsEnemy, -> nStateNode::GetState, -> nRealWorld::FindNextObjectBySymbolicName
//   strings: 'explode', 'bauphase'
// 0x10065aaa  nfightermanager::vfunc_24  (157 insns)
//   calls:   -> nRealWorld::IsEnemy, -> nContainer::IsVehicleClass, -> nContainer::GetPosition
//   consts:  f32=1.5
//   strings: 'abstract', 'abstract.trigger.waypoint'
// 0x10065c7f  nfightermanager::vfunc_25  (248 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, -> nRealWorld::FindObjectBySymbolicName, -> nContainer::GetPosition
//   consts:  f64=0
//   strings: '%s%d'
// 0x10065f1a  nfightermanager::vfunc_26  (275 insns)
//   calls:   -> nRealWorld::FindObjectBySymbolicName, -> nContainer::GetCorrectRadius, -> nContainer::GetPosition, -> nRealWorld::IsEnemy
//   consts:  f32=3, f32=200, f32=1.047198, f32=0.9
// 0x10066243  nfightermanager::vfunc_27  (221 insns)
//   calls:   -> nRealWorld::FindObjectBySymbolicName, -> nRealWorld::IsEnemy, -> nContainer::GetPosition, -> nRealWorld::GetGlobalTime
//   consts:  f32=1.5, f32=1, f32=0.2857143, f32=0.3333333, f32=0.25, f32=30
// 0x10066762  nfightermanager::vfunc_11  (3 insns)
//   calls:   -> ndistancechecker::vfunc_11

} // namespace re_nnomads
