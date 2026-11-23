#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmissileengine3.asm
// Class: nmissileengine3 : public nservice  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmissileengine3_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x0020
    uint8_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    float field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x0140
    double field_0x0140;
    // +0x0b43
    uint8_t field_0x0b43;
    // +0x0b44
    float field_0x0b44;
    // +0x0b48
    uint32_t field_0x0b48;
    // +0x0b5c
    float field_0x0b5c;
    // +0x0b60
    float field_0x0b60;
    // +0x0b64
    float field_0x0b64;
    // +0x0b6c
    float field_0x0b6c;
    // +0x0c70
    uint8_t field_0x0c70;
    // +0x0c72
    uint32_t field_0x0c72;
    // +0x0c80
    float field_0x0c80;
    // +0x0c84
    float field_0x0c84;
    // +0x0c90
    float field_0x0c90;
    // +0x0c9c
    uint8_t field_0x0c9c;
    // +0x0cc8
    uint8_t field_0x0cc8;
    // +0x0cf4
    uint8_t field_0x0cf4;
    // +0x0d20
    uint8_t field_0x0d20;
    // +0x0d5c
    float field_0x0d5c;
    // +0x0d60
    float field_0x0d60;
    // +0x0d88
    float field_0x0d88;
};

// Script AddCmds (8):
//   v_setignitiondelay_f
//   f_getignitiondelay_v
//   v_setagility_f
//   f_getagility_v
//   v_setmaxspeed_f
//   f_getmaxspeed_v
//   v_setgravityfactor_f
//   f_getgravityfactor_v

// Methods (7):
// 0x1006b912  nmissileengine3::n_init_nmissileengine3  (15 insns)
//   strings: 'nservice'
// 0x1006b93d  nmissileengine3::n_fini_nmissileengine3  (5 insns)
// 0x1006b94f  nmissileengine3::n_new_nmissileengine3  (24 insns)
// 0x1006b98e  nmissileengine3::vfunc_00  (12 insns)
// 0x1006b9b0  nmissileengine3::vfunc_16  (166 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord, -> nContainer::GetActualCommand, -> nContainer::GetDirection, -> nContainer::GetPosition
//   consts:  f32=0.5, f64=1e-07, f32=-1, f64=0.996, f64=0.94
// 0x1006bbbb  nmissileengine3::vfunc_18  (155 insns)
//   calls:   -> nContainer::GetDirection, -> nContainer::IsHandControl, -> nconsumption::vfunc_37
//   consts:  f32=-1, f32=0
//   strings: 'v_setignitiondelay_f', 'f_getignitiondelay_v', 'v_setagility_f', 'f_getagility_v', 'v_setmaxspeed_f', 'f_getmaxspeed_v', 'v_setgravityfactor_f', 'f_getgravityfactor_v'
// 0x1006bdac  nmissileengine3::vfunc_11  (92 insns)
//   calls:   -> ncollidedata::vfunc_11

} // namespace re_nnomads
