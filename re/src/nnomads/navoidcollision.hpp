#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/navoidcollision.asm
// Class: navoidcollision : public nservice  (sizeof = 0x6c = 108 bytes)

#include <cstdint>

namespace re_nnomads {

struct navoidcollision_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    uint8_t field_0x0064;
    // +0x0065
    uint8_t field_0x0065;
    // +0x0068
    uint32_t field_0x0068;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (8):
//   v_setsmallradius_f
//   f_getsmallradius_v
//   v_setignoresmallobjects_b
//   b_getignoresmallobjects_v
//   v_setkamikaze_b
//   b_getkamikaze_v
//   v_setavoidradius_f
//   f_getavoidradius_v

// Methods (12):
// 0x10037818  navoidcollision::cmd_getignoresmallobjects (b_getignoresmallobjects_v)  (13 insns)
// 0x10037841  navoidcollision::cmd_setkamikaze (v_setkamikaze_b)  (10 insns)
// 0x10037862  navoidcollision::cmd_getkamikaze (b_getkamikaze_v)  (13 insns)
// 0x1004b795  navoidcollision::n_init_navoidcollision  (15 insns)
//   strings: 'nservice'
// 0x1004b7c0  navoidcollision::n_fini_navoidcollision  (5 insns)
// 0x1004b7d2  navoidcollision::n_new_navoidcollision  (25 insns)
// 0x1004b816  navoidcollision::vfunc_00  (12 insns)
// 0x1004b838  navoidcollision::vfunc_14  (24 insns)
//   calls:   -> nSoundNode::vfunc_35
//   strings: 'nvehicle', 'avoid'
// 0x1004b882  navoidcollision::vfunc_16  (17 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x1004b8ab  navoidcollision::vfunc_18  (590 insns)
//   calls:   -> nStateNode::GetServiceData, -> nContainer::GetDirection, -> nContainer::GetPosition, -> nContainer::GetCorrectRadius, -> nconsumption::vfunc_37, -> nContainer::IsHandControl
//   consts:  f32=0.5, f32=0, f32=1, f32=-1, f64=0
//   strings: 'v_setsmallradius_f', 'f_getsmallradius_v', 'v_setignoresmallobjects_b', 'b_getignoresmallobjects_v', 'v_setkamikaze_b', 'b_getkamikaze_v', 'v_setavoidradius_f', 'f_getavoidradius_v'
// 0x1004bfec  navoidcollision::cmd_setignoresmallobjects (v_setignoresmallobjects_b)  (10 insns)
// 0x1004c00d  navoidcollision::vfunc_11  (94 insns)
//   calls:   -> ncollidedata::vfunc_11

} // namespace re_nnomads
