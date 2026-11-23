#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nenergyeffect.asm
// Class: nenergyeffect : public nservice  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct nenergyeffect_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x0014
    float field_0x0014;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint8_t field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0114
    uint32_t field_0x0114;
    // +0x02b6
    uint8_t field_0x02b6;
    // +0x0e64
    uint8_t field_0x0e64;
};

// Script AddCmds (7):
//   m_energyeffect/nefx_main.cc
//   v_setsingleeffect_b
//   b_getsingleeffect_v
//   v_setradius_f
//   f_getradius_v
//   v_setenergy_f
//   f_getenergy_v

// Methods (14):
// 0x1004ce48  nenergyeffect::n_init_nenergyeffect  (15 insns)
//   strings: 'nservice'
// 0x1004ce73  nenergyeffect::n_fini_nenergyeffect  (5 insns)
// 0x1004ce85  nenergyeffect::n_new_nenergyeffect  (10 insns)
// 0x1004ce9c  nenergyeffect::n_version_nenergyeffect  (15 insns)
// 0x1004cec6  nenergyeffect::vfunc_00  (14 insns)
// 0x1004cef3  nenergyeffect::vfunc_16  (32 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord, -> nContainer::SetWeaponWorks
// 0x1004cf3e  nenergyeffect::vfunc_17  (10 insns)
//   calls:   -> nContainer::SetWeaponWorks, -> nStateNode::NetImport
// 0x1004cf5b  nenergyeffect::vfunc_20  (116 insns)
//   calls:   -> nContainer::GetCollVehicle, -> nContainer::GetPosition, -> nContainer::SetWeaponWorks
// 0x1004d070  nenergyeffect::vfunc_19  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'IsEffectAllowed not implemented', 'm_energyeffect/nefx_main.cc'
// 0x1004d093  nenergyeffect::vfunc_21  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'DoSpecialEffect not implemented', 'm_energyeffect/nefx_main.cc'
// 0x1004d0b6  nenergyeffect::vfunc_18  (92 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::SetWeaponWorks, -> nconsumption::vfunc_37
// 0x1004d194  nenergyeffect::vfunc_22  (93 insns)
//   strings: 'generic'
// 0x1004d28f  nenergyeffect::vfunc_23  (47 insns)
//   calls:   -> nenergyeffect::vfunc_23
//   strings: 'v_setsingleeffect_b', 'b_getsingleeffect_v', 'v_setradius_f', 'f_getradius_v', 'v_setenergy_f', 'f_getenergy_v'
// 0x1004d362  nenergyeffect::vfunc_11  (79 insns)
//   calls:   -> ncollidedata::vfunc_11

} // namespace re_nnomads
