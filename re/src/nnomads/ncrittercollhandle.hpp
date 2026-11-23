#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncrittercollhandle.asm
// Class: ncrittercollhandle : public ncollhandle2  (sizeof = 0x74 = 116 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncrittercollhandle_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x003c
    uint32_t field_0x003c;
    // +0x0044
    uint8_t field_0x0044;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint8_t field_0x0064;
    // +0x0065
    uint8_t field_0x0065;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x1298
    uint32_t field_0x1298;
};

// Script AddCmds (3):
//   v_addvictimclass_s
//   v_setcollaction_s
//   s_getcollaction_v

// Methods (11):
// 0x10046957  ncrittercollhandle::n_init_ncrittercollhandle  (15 insns)
//   strings: 'ncollhandle2'
// 0x10046982  ncrittercollhandle::n_fini_ncrittercollhandle  (5 insns)
// 0x10046994  ncrittercollhandle::n_new_ncrittercollhandle  (95 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10046a72  ncrittercollhandle::vfunc_16  (180 insns)
//   calls:   -> navoidcollision::vfunc_16, -> nContainer::GetMatrix44, -> nContainer::IsVehicleClass, -> nContainer::SetMatrix44
//   consts:  f32=0.5
//   strings: 'concret.nature.island'
// 0x10046c5d  ncrittercollhandle::vfunc_18  (651 insns)
//   calls:   -> nStateNode::GetServiceData, -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::SetPosition, -> nContainer::IsVehicleClass, -> ncollhandle2::vfunc_18, -> nconsumption::vfunc_37
//   consts:  f32=1.8, f32=-0.1, f32=0, f32=1
//   strings: 'concret.nature.island'
// 0x10047343  ncrittercollhandle::vfunc_20  (2 insns)
// 0x10047347  ncrittercollhandle::vfunc_00  (34 insns)
//   strings: 'v_addvictimclass_s', 'v_setcollaction_s', 's_getcollaction_v'
// 0x100473ba  ncrittercollhandle::cmd_addvictimclass (v_addvictimclass_s)  (10 insns)
// 0x100473dd  ncrittercollhandle::cmd_setcollaction (v_setcollaction_s)  (20 insns)
// 0x1004740e  ncrittercollhandle::cmd_getcollaction (s_getcollaction_v)  (27 insns)
//   strings: 'land', 'damage', 'attack', 'explode'
// 0x10047459  ncrittercollhandle::vfunc_11  (191 insns)
//   calls:   -> ncollhandle2::vfunc_11
//   strings: 'land', 'damage', 'attack', 'explode'

} // namespace re_nnomads
