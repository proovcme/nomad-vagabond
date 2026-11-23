#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nconsumption.asm
// Class: nconsumption : public nservice  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct nconsumption_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0014
    float field_0x0014;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    float field_0x0058;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (2):
//   v_setcapacity_f
//   f_getcapacity_v

// Methods (13):
// 0x10041933  nconsumption::cmd_setconsumption (v_setconsumption_f)  (12 insns)
//   calls:   -> nfreesteer::vfunc_19
// 0x1004195a  nconsumption::cmd_getconsumption (f_getconsumption_v)  (13 insns)
//   calls:   -> nfreesteer::vfunc_20
// 0x10041985  nconsumption::vfunc_11  (39 insns)
//   calls:   -> ncollidedata::vfunc_11, -> nfreesteer::vfunc_20
// 0x100419e5  nconsumption::n_init_nconsumption  (15 insns)
//   strings: 'nservice'
// 0x10041a10  nconsumption::n_fini_nconsumption  (5 insns)
// 0x10041a22  nconsumption::n_new_nconsumption  (18 insns)
// 0x10041a4b  nconsumption::vfunc_00  (12 insns)
// 0x10041a7b  nconsumption::vfunc_18  (24 insns)
//   calls:   -> nStateNode::GetClan, -> nconsumption::vfunc_37
// 0x10041b29  nconsumption::vfunc_19  (12 insns)
// 0x10041b4b  nconsumption::vfunc_35  (26 insns)
//   calls:   -> nStateNode::GetClan, IAT: nkernel.dll!n_printf, -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x10041b9c  nconsumption::vfunc_36  (40 insns)
//   calls:   -> nStateNode::GetClan, IAT: nkernel.dll!n_printf, -> nStateNode::NetImport
//   strings: 'v_setcapacity_f', 'f_getcapacity_v'
// 0x10041c1d  nconsumption::vfunc_30  (35 insns)
//   calls:   -> ncollidedata::vfunc_11
// 0x10068ced  nconsumption::vfunc_37  (2 insns)

} // namespace re_nnomads
