#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nbuoyancy.asm
// Class: nbuoyancy : public nservice  (sizeof = 0x80 = 128 bytes)

#include <cstdint>

namespace re_nnomads {

struct nbuoyancy_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0058
    float field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x006c
    float field_0x006c;
    // +0x0070
    float field_0x0070;
    // +0x0074
    float field_0x0074;
    // +0x0078
    float field_0x0078;
    // +0x007c
    float field_0x007c;
    // +0x0d98
    uint32_t field_0x0d98;
};

// Script AddCmds (20):
//   v_setrely_f
//   f_getrely_v
//   v_setminradius_f
//   f_getminradius_v
//   v_setmaxradius_f
//   f_getmaxradius_v
//   v_setheight_f
//   f_getheight_v
//   v_setbuoyancy_f
//   f_getbuoyancy_v
//   v_setattraction_f
//   f_getattraction_v
//   v_setwavelen_f
//   f_getwavelen_v
//   v_setperiodduration_f
//   f_getperiodduration_v
//   v_setamplitude_f
//   f_getamplitude_v
//   v_settorque_f
//   f_gettorque_v

// Methods (14):
// 0x1003828e  nbuoyancy::cmd_gettorque (f_gettorque_v)  (11 insns)
// 0x1004ae1a  nbuoyancy::cmd_setattraction (v_setattraction_f)  (10 insns)
// 0x1004b0db  nbuoyancy::n_init_nbuoyancy  (15 insns)
//   strings: 'nservice'
// 0x1004b106  nbuoyancy::n_fini_nbuoyancy  (5 insns)
// 0x1004b118  nbuoyancy::n_new_nbuoyancy  (10 insns)
// 0x1004b132  nbuoyancy::n_version_nbuoyancy  (29 insns)
// 0x1004b17c  nbuoyancy::vfunc_00  (12 insns)
// 0x1004b19e  nbuoyancy::vfunc_16  (69 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x1004b242  nbuoyancy::vfunc_17  (22 insns)
//   calls:   -> nStateNode::NetImport
// 0x1004b27b  nbuoyancy::vfunc_19  (28 insns)
//   calls:   -> nContainer::GetPosition
// 0x1004b2b8  nbuoyancy::vfunc_18  (143 insns)
//   calls:   -> nconsumption::vfunc_37
//   strings: 'v_setrely_f', 'f_getrely_v', 'v_setminradius_f', 'f_getminradius_v', 'v_setmaxradius_f', 'f_getmaxradius_v', 'v_setheight_f', 'f_getheight_v'
// 0x1004b51a  nbuoyancy::cmd_getattraction (f_getattraction_v)  (11 insns)
// 0x1004b541  nbuoyancy::vfunc_11  (220 insns)
//   calls:   -> ncollidedata::vfunc_11
// 0x100791fd  nbuoyancy::cmd_settorque (v_settorque_f)  (10 insns)

} // namespace re_nnomads
