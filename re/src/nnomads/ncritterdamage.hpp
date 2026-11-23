#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncritterdamage.asm
// Class: ncritterdamage : public nservice  (sizeof = 0x70 = 112 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncritterdamage_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    float field_0x006c;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (2):
//   v_setdamagerange_f
//   f_getdamagerange_v

// Methods (9):
// 0x1005d0c9  ncritterdamage::cmd_getdamagerange (f_getdamagerange_v)  (13 insns)
//   calls:   -> nfreesteer::vfunc_30
// 0x10078b5b  ncritterdamage::n_init_ncritterdamage  (15 insns)
//   strings: 'nservice'
// 0x10078b86  ncritterdamage::n_fini_ncritterdamage  (5 insns)
// 0x10078b98  ncritterdamage::n_new_ncritterdamage  (22 insns)
// 0x10078bd2  ncritterdamage::vfunc_00  (22 insns)
// 0x10078c0e  ncritterdamage::vfunc_16  (75 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10078cbc  ncritterdamage::vfunc_18  (117 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::IsVehicleClass, -> nconsumption::vfunc_37
//   strings: 'generic', 'v_setdamagerange_f', 'f_getdamagerange_v'
// 0x10078e13  ncritterdamage::cmd_setdamagerange (v_setdamagerange_f)  (12 insns)
//   calls:   -> nfreesteer::vfunc_29
// 0x10078e3a  ncritterdamage::vfunc_11  (39 insns)
//   calls:   -> ncollidedata::vfunc_11, -> nfreesteer::vfunc_30

} // namespace re_nnomads
