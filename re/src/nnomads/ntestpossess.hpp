#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ntestpossess.asm
// Class: ntestpossess : public nservice  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct ntestpossess_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0e64
    uint8_t field_0x0e64;
};

// Script AddCmds (2):
//   v_setpossesschangedcommand_s
//   s_getpossesschangedcommand_v

// Methods (13):
// 0x1005733a  ntestpossess::n_init_ntestpossess  (15 insns)
//   strings: 'nservice'
// 0x10057365  ntestpossess::n_fini_ntestpossess  (5 insns)
// 0x10057377  ntestpossess::n_new_ntestpossess  (10 insns)
// 0x1005738e  ntestpossess::n_version_ntestpossess  (14 insns)
// 0x100573b5  ntestpossess::vfunc_00  (25 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x100573f6  ntestpossess::vfunc_16  (27 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
//   strings: 'nstation', 'nhouse'
// 0x10057448  ntestpossess::vfunc_17  (49 insns)
//   calls:   -> nStateNode::NetImport
// 0x100574ca  ntestpossess::vfunc_19  (14 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x100574ee  ntestpossess::vfunc_20  (2 insns)
// 0x100574f2  ntestpossess::vfunc_18  (281 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nContainer::GetPosition, -> nContainer::GetDirection, -> nStateNode::GetClan, -> nRealWorld::IsEnemy, -> nHouse::HasMenu, -> nStateNode::GetState, -> nContainer::IsVehicleClass, -> nconsumption::vfunc_37
//   consts:  f32=50
//   strings: 'nfactory', 'generic', 'bauphase', 'concret.technical.static.building.artefactstorage', 'concret.technical.static.building.artefacttransformer'
// 0x10057827  ntestpossess::vfunc_21  (142 insns)
//   calls:   -> nContainer::GetMatrix44, -> nContainer::GetPosition
//   consts:  f32=9.424778, f32=1, f32=-1
//   strings: 'v_setpossesschangedcommand_s', 's_getpossesschangedcommand_v'
// 0x100579b0  ntestpossess::cmd_getpossesschangedcommand (s_getpossesschangedcommand_v)  (15 insns)
// 0x100579da  ntestpossess::vfunc_11  (49 insns)
//   calls:   -> ncollidedata::vfunc_11

} // namespace re_nnomads
