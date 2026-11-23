#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nstationcollhandle2.asm
// Class: nstationcollhandle2 : public ncollhandle2  (sizeof = 0x64 = 100 bytes)

#include <cstdint>

namespace re_nnomads {

struct nstationcollhandle2_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint8_t field_0x0064;
    // +0x0065
    uint8_t field_0x0065;
    // +0x00c8
    float field_0x00c8;
    // +0x00cc
    float field_0x00cc;
    // +0x00d0
    float field_0x00d0;
    // +0x00d4
    float field_0x00d4;
    // +0x00d8
    float field_0x00d8;
    // +0x0b44
    uint32_t field_0x0b44;
    // +0x0b48
    uint32_t field_0x0b48;
    // +0x0b4c
    uint32_t field_0x0b4c;
    // +0x126c
    float field_0x126c;
    // +0x1271
    uint8_t field_0x1271;
    // +0x1273
    uint8_t field_0x1273;
};

// Script AddCmds (8):
//   v_setmaxstepheight_f
//   f_getmaxstepheight_v
//   v_setmaxwalkableangle_f
//   f_getmaxwalkableangle_v
//   v_setjumpcheckheight_f
//   f_getjumpcheckheight_v
//   v_setjumpchecklen_f
//   f_getjumpchecklen_v

// Methods (8):
// 0x10048025  nstationcollhandle2::n_init_nstationcollhandle2  (10 insns)
//   strings: 'ncollhandle2'
// 0x10048046  nstationcollhandle2::n_fini_nstationcollhandle2  (5 insns)
// 0x10048058  nstationcollhandle2::n_new_nstationcollhandle2  (17 insns)
// 0x10048080  nstationcollhandle2::vfunc_18  (126 insns)
//   calls:   -> nStateNode::GetServiceData, -> nContainer::GetPosition, -> nconsumption::vfunc_37
//   consts:  f64=0
//   strings: 'nstation'
// 0x100481da  nstationcollhandle2::vfunc_00  (12 insns)
// 0x10048299  nstationcollhandle2::vfunc_19  (984 insns)
//   consts:  f32=3, f32=0.3, f32=1, f32=0.3490659, f32=-0.3490659, f32=1.5, f32=0
// 0x10048d00  nstationcollhandle2::vfunc_37  (436 insns)
//   calls:   -> nStateNode::GetServiceData, -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::GetPreMovePosition, -> nContainer::SetPosition, -> nCollideObject::Transform, -> nContainer::IsVehicleClass, -> nconsumption::vfunc_37
//   consts:  f32=0.9, f32=-0.1, f32=0.001, f32=0
//   strings: 'concret.nature.island', 'v_setmaxstepheight_f', 'f_getmaxstepheight_v', 'v_setmaxwalkableangle_f', 'f_getmaxwalkableangle_v', 'v_setjumpcheckheight_f', 'f_getjumpcheckheight_v', 'v_setjumpchecklen_f'
// 0x1004930a  nstationcollhandle2::vfunc_30  (100 insns)
//   calls:   -> nmnlcollhandle2::vfunc_11
//   consts:  f32=3.141593, f32=0.005555556

} // namespace re_nnomads
