#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nplacespellaction.asm
// Class: nplacespellaction : public nuseartefact  (sizeof = 0x70 = 112 bytes)

#include <cstdint>

namespace re_nnomads {

struct nplacespellaction_Layout {
    // +0x0004
    float field_0x0004;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0014
    float field_0x0014;
    // +0x0018
    uint8_t field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0b44
    uint32_t field_0x0b44;
    // +0x0b5c
    float field_0x0b5c;
    // +0x0e72
    uint8_t field_0x0e72;
    // +0x0e78
    float field_0x0e78;
    // +0x1139
    uint8_t field_0x1139;
    // +0x1140
    double field_0x1140;
};

// Script AddCmds (10):
//   v_setspellaction_s
//   s_getspellaction_v
//   v_setalternatedistance_f
//   f_getalternatedistance_v
//   v_setownercommand_s
//   s_getownercommand_v
//   v_setplacement_s
//   s_getplacement_v
//   v_setstartdistance_f
//   f_getstartdistance_v

// Methods (19):
// 0x10032136  nplacespellaction::cmd_setstartdistance (v_setstartdistance_f)  (12 insns)
//   calls:   -> nattack::vfunc_26
// 0x10040ea2  nplacespellaction::vfunc_16  (38 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord, -> nStateNode::GetClan
// 0x10040f10  nplacespellaction::vfunc_17  (14 insns)
//   calls:   -> nStateNode::NetImport
// 0x10041117  nplacespellaction::vfunc_18  (37 insns)
//   calls:   -> nContainer::IsHandControl, IAT: nkernel.dll!n_printf, -> nconsumption::vfunc_37
// 0x1004c117  nplacespellaction::n_init_nplacespellaction  (15 insns)
//   strings: 'nuseartefact'
// 0x1004c142  nplacespellaction::n_fini_nplacespellaction  (5 insns)
// 0x1004c154  nplacespellaction::n_new_nplacespellaction  (10 insns)
// 0x1004c16b  nplacespellaction::n_version_nplacespellaction  (15 insns)
// 0x1004c19c  nplacespellaction::vfunc_00  (33 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1004c1e8  nplacespellaction::vfunc_21  (11 insns)
//   strings: 'firespell'
// 0x1004c20c  nplacespellaction::vfunc_23  (104 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::GetArtefactOwner, -> nContainer::GetDirection
//   strings: 'nhouse'
// 0x1004c322  nplacespellaction::vfunc_24  (59 insns)
//   calls:   -> nContainer::GetArtefactOwner, -> nContainer::GetPosition
//   consts:  f32=1
// 0x1004c3c8  nplacespellaction::vfunc_19  (371 insns)
//   calls:   -> nContainer::GetArtefactOwner, -> nStateNode::GetClan, -> nContainer::GetArtefactUsageDelay, -> nRealWorld::GetGlobalTime, -> nContainer::SetPosition, -> nContainer::SetDirection, -> nStateNode::ThrowEvent, -> nuseartefact::vfunc_19
//   consts:  f64=0, f32=1.3, f32=1, f32=10000
//   strings: 'nmissile', 'normal', 'v_setspellaction_s', 's_getspellaction_v', 'v_setalternatedistance_f', 'f_getalternatedistance_v', 'v_setownercommand_s', 's_getownercommand_v'
// 0x1004c8e4  nplacespellaction::cmd_setownercommand (v_setownercommand_s)  (23 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1004c920  nplacespellaction::cmd_getownercommand (s_getownercommand_v)  (13 insns)
// 0x1004c946  nplacespellaction::cmd_setplacement (v_setplacement_s)  (13 insns)
//   calls:   -> nfreesteer::vfunc_27
// 0x1004c970  nplacespellaction::cmd_getplacement (s_getplacement_v)  (24 insns)
//   strings: 'move_to_action', 'place_at_action', 'place_at_start'
// 0x1004c9b6  nplacespellaction::cmd_getstartdistance (f_getstartdistance_v)  (13 insns)
//   calls:   -> nattack::vfunc_27
// 0x1004c9e1  nplacespellaction::vfunc_11  (215 insns)
//   calls:   -> nbehaviour::vfunc_11, -> nattack::vfunc_27
//   strings: 'move_to_action', 'place_at_action', 'place_at_start'

} // namespace re_nnomads
