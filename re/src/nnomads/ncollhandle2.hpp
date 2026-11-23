#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncollhandle2.asm
// Class: ncollhandle2 : public nservice  (sizeof = 0x60 = 96 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncollhandle2_Layout {
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
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint8_t field_0x0058;
    // +0x0059
    uint8_t field_0x0059;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0064
    uint8_t field_0x0064;
    // +0x0065
    uint8_t field_0x0065;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0b44
    uint32_t field_0x0b44;
    // +0x0b5c
    uint32_t field_0x0b5c;
    // +0x0d5c
    uint32_t field_0x0d5c;
};

// Script AddCmds (6):
//   v_sethandlebounce_b
//   b_gethandlebounce_v
//   v_sethandledamage_b
//   b_gethandledamage_v
//   v_setclassfilter_s
//   s_getclassfilter_v

// Methods (12):
// 0x10036eb5  ncollhandle2::cmd_sethandledamage (v_sethandledamage_b)  (10 insns)
// 0x10036ed6  ncollhandle2::cmd_gethandledamage (b_gethandledamage_v)  (13 insns)
// 0x10036eff  ncollhandle2::cmd_gethandlebounce (b_gethandlebounce_v)  (13 insns)
// 0x100460a4  ncollhandle2::n_init_ncollhandle2  (15 insns)
//   strings: 'nservice'
// 0x100460cf  ncollhandle2::n_fini_ncollhandle2  (5 insns)
// 0x100460e1  ncollhandle2::n_new_ncollhandle2  (65 insns)
//   calls:   IAT: nkernel.dll!n_free
//   consts:  f32=0
// 0x10046188  ncollhandle2::vfunc_18  (368 insns)
//   calls:   -> nStateNode::GetServiceData, -> nContainer::IsVehicleClass, -> nContainer::GetPreMovePosition, -> nContainer::SetPosition, -> nCollideObject::Transform, -> nconsumption::vfunc_37
//   consts:  f32=0, f32=0.7, f32=1, f32=0.25, f32=0.1
//   strings: 'concret.technical.dynamic.vehicle'
// 0x100465ea  ncollhandle2::vfunc_00  (49 insns)
//   strings: 'v_sethandlebounce_b', 'b_gethandlebounce_v', 'v_sethandledamage_b', 'b_gethandledamage_v', 'v_setclassfilter_s', 's_getclassfilter_v'
// 0x1004669f  ncollhandle2::cmd_setclassfilter (v_setclassfilter_s)  (12 insns)
//   calls:   IAT: nkernel.dll!n_strdup
// 0x100466c7  ncollhandle2::cmd_getclassfilter (s_getclassfilter_v)  (13 insns)
// 0x100466ed  ncollhandle2::vfunc_11  (79 insns)
//   calls:   -> ncollidedata::vfunc_11
// 0x1004d341  ncollhandle2::cmd_sethandlebounce (v_sethandlebounce_b)  (10 insns)

} // namespace re_nnomads
