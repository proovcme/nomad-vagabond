#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nstationengine3.asm
// Class: nstationengine3 : public nservice  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct nstationengine3_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    float field_0x0058;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0114
    uint32_t field_0x0114;
    // +0x015c
    uint32_t field_0x015c;
    // +0x0b44
    uint32_t field_0x0b44;
    // +0x0b48
    float field_0x0b48;
    // +0x0b5c
    float field_0x0b5c;
    // +0x0b60
    float field_0x0b60;
    // +0x0b64
    float field_0x0b64;
    // +0x0b6c
    float field_0x0b6c;
    // +0x0b78
    float field_0x0b78;
    // +0x0b88
    float field_0x0b88;
    // +0x0c90
    float field_0x0c90;
    // +0x1270
    uint8_t field_0x1270;
};

// Script AddCmds (2):
//   v_setdrivestoptime_f
//   f_getdrivestoptime_v

// Methods (24):
// 0x1004f381  nstationengine3::n_init_nstationengine3  (15 insns)
//   strings: 'nservice'
// 0x1004f3ac  nstationengine3::n_fini_nstationengine3  (5 insns)
// 0x1004f3be  nstationengine3::n_new_nstationengine3  (10 insns)
// 0x1004f3d5  nstationengine3::n_version_nstationengine3  (10 insns)
// 0x1004f3f4  nstationengine3::vfunc_00  (12 insns)
// 0x1004f416  nstationengine3::vfunc_16  (27 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord, -> nRealWorld::GetGlobalTime
// 0x1004f465  nstationengine3::vfunc_30  (209 insns)
//   calls:   -> nContainer::GetDirection
//   consts:  f64=1e-07, f32=1, f32=-1, f64=0, f32=0, f32=0.001, f32=0.01, f32=0.1, f32=1.1
// 0x1004f66c  nstationengine3::vfunc_31  (156 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::SetPosition
//   consts:  f64=1e-07, f32=1, f32=-1, f32=0.15, f32=3, f32=1.1
// 0x1004f80f  nstationengine3::vfunc_32  (130 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::SetPosition
//   consts:  f32=3, f32=0, f32=1.1, f64=0
// 0x1004f953  nstationengine3::vfunc_33  (208 insns)
//   calls:   -> nContainer::GetDirection, -> nContainer::GetPosition, -> nStateNode::ThrowEvent
//   consts:  f32=1, f32=-1, f32=0, f32=0.01, f32=0.1
// 0x1004fbaf  nstationengine3::vfunc_34  (70 insns)
//   calls:   -> nStateNode::GetClan, -> nRealWorld::GetGlobalTime
// 0x1004fc71  nstationengine3::vfunc_18  (235 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::GetDirection, -> nStateNode::ThrowEvent, -> nconsumption::vfunc_37
//   consts:  f32=4
// 0x1004fec9  nstationengine3::vfunc_21  (89 insns)
//   consts:  f32=0, f32=-1, f32=0.03
// 0x1004ffbd  nstationengine3::vfunc_22  (89 insns)
//   consts:  f32=0, f32=-1, f32=0.03
// 0x100500b0  nstationengine3::vfunc_23  (52 insns)
//   consts:  f32=0, f32=-1, f32=0.03
// 0x10050147  nstationengine3::vfunc_24  (25 insns)
//   consts:  f32=-1
// 0x100501a6  nstationengine3::vfunc_25  (82 insns)
//   consts:  f64=1e-07
// 0x10050292  nstationengine3::vfunc_26  (51 insns)
//   consts:  f32=-1
// 0x1005031f  nstationengine3::vfunc_27  (9 insns)
//   consts:  f32=0.5
// 0x10050340  nstationengine3::vfunc_28  (23 insns)
//   consts:  f32=0.5
// 0x1005038f  nstationengine3::vfunc_29  (40 insns)
//   consts:  f32=0.5
//   strings: 'v_setdrivestoptime_f', 'f_getdrivestoptime_v'
// 0x10050418  nstationengine3::cmd_getdrivestoptime (f_getdrivestoptime_v)  (14 insns)
// 0x10050443  nstationengine3::vfunc_11  (43 insns)
//   calls:   -> ncollidedata::vfunc_11
// 0x100564ac  nstationengine3::cmd_setdrivestoptime (v_setdrivestoptime_f)  (13 insns)

} // namespace re_nnomads
