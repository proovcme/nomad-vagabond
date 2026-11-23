#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ninterpolate.asm
// Class: ninterpolate : public nservice  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct ninterpolate_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    double field_0x0058;
    // +0x0060
    uint8_t field_0x0060;
    // +0x0061
    uint8_t field_0x0061;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0e88
    double field_0x0e88;
};

// Script AddCmds (6):
//   m_interpolate/nip_main.cc
//   v_setipolduration_f
//   v_setdoipolpos_b
//   b_getdoipolpos_v
//   v_setdoipoldir_b
//   b_getdoipoldir_v

// Methods (14):
// 0x100403ed  ninterpolate::n_init_ninterpolate  (15 insns)
//   strings: 'nservice'
// 0x10040418  ninterpolate::n_fini_ninterpolate  (5 insns)
// 0x1004042a  ninterpolate::n_new_ninterpolate  (10 insns)
// 0x10040441  ninterpolate::n_version_ninterpolate  (13 insns)
// 0x10040466  ninterpolate::vfunc_00  (14 insns)
// 0x10040493  ninterpolate::vfunc_16  (12 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x100404b8  ninterpolate::vfunc_19  (2 insns)
// 0x100404be  ninterpolate::vfunc_20  (37 insns)
// 0x10040505  ninterpolate::vfunc_21  (19 insns)
//   consts:  f64=1
// 0x10040535  ninterpolate::vfunc_22  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'virtual function called: nInterpolate::GetIpolPos', 'm_interpolate/nip_main.cc'
// 0x10040555  ninterpolate::vfunc_23  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'virtual function called: nInterpolate::GetIpolPos', 'm_interpolate/nip_main.cc'
// 0x10040575  ninterpolate::vfunc_18  (467 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::SetPosition, -> nContainer::GetDirection, -> nContainer::SetDirection, -> nconsumption::vfunc_37
//   consts:  f32=0, f32=1, f32=0.05, f32=-1, f32=0.5, f32=3.141593, f32=2
//   strings: 'v_setipolduration_f', 'v_setdoipolpos_b', 'b_getdoipolpos_v', 'v_setdoipoldir_b', 'b_getdoipoldir_v'
// 0x10040b1d  ninterpolate::cmd_setipolduration (v_setipolduration_f)  (10 insns)
// 0x10040b81  ninterpolate::vfunc_11  (79 insns)
//   calls:   -> ncollidedata::vfunc_11

} // namespace re_nnomads
