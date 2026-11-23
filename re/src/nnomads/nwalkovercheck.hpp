#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nwalkovercheck.asm
// Class: nwalkovercheck : public ncollcheck2  (sizeof = 0x9c = 156 bytes)

#include <cstdint>

namespace re_nnomads {

struct nwalkovercheck_Layout {
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0064
    uint8_t field_0x0064;
    // +0x0065
    uint8_t field_0x0065;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x0178
    uint8_t field_0x0178;
    // +0x0eb4
    uint32_t field_0x0eb4;
    // +0x0ebc
    uint32_t field_0x0ebc;
    // +0x0ec0
    uint32_t field_0x0ec0;
};

// Methods (8):
// 0x1004761f  nwalkovercheck::n_init_nwalkovercheck  (10 insns)
//   strings: 'ncollcheck2'
// 0x10047640  nwalkovercheck::n_fini_nwalkovercheck  (5 insns)
// 0x10047652  nwalkovercheck::n_new_nwalkovercheck  (16 insns)
// 0x10047679  nwalkovercheck::vfunc_00  (12 insns)
// 0x1004769b  nwalkovercheck::vfunc_16  (33 insns)
//   calls:   -> ncollcheck2::vfunc_16, -> nStateNode::GetServiceData
// 0x100476fb  nwalkovercheck::vfunc_18  (51 insns)
//   calls:   -> ncollcheck2::vfunc_18, -> nStateNode::GetServiceData, -> nStateNode::GetThrowEvents
// 0x100477d2  nwalkovercheck::vfunc_19  (12 insns)
// 0x100477f4  nwalkovercheck::vfunc_37  (190 insns)
//   calls:   -> nStateNode::GetServiceData, -> nRealWorld::GetUserClan, -> nRealWorld::IsEnemy, -> nRealWorld::IsFriend, -> nStateNode::GetClan, -> nContainer::IsVehicleClass, IAT: nkernel.dll!n_printf, -> nStateNode::GetThrowEvents, -> nStateNode::ThrowEvent, -> nconsumption::vfunc_37
//   strings: 'concret.technical.dynamic.vehicle', 'concret.weapon'

} // namespace re_nnomads
