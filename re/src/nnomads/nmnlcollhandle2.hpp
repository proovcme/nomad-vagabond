#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmnlcollhandle2.asm
// Class: nmnlcollhandle2 : public ncollhandle2  (sizeof = 0xc8 = 200 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmnlcollhandle2_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0013
    uint32_t field_0x0013;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0060
    uint32_t field_0x0060;
    // +0x00c4
    uint8_t field_0x00c4;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0b44
    uint32_t field_0x0b44;
    // +0x126c
    float field_0x126c;
    // +0x1271
    uint8_t field_0x1271;
};

// Script AddCmds (5):
//   v_addcollclass_s
//   i_getnumcollclasses_v
//   s_getcollclass_i
//   v_setallowlanding_b
//   b_getallowlanding_v

// Methods (13):
// 0x10047a42  nmnlcollhandle2::n_init_nmnlcollhandle2  (15 insns)
//   strings: 'ncollhandle2'
// 0x10047a6d  nmnlcollhandle2::n_fini_nmnlcollhandle2  (5 insns)
// 0x10047a7f  nmnlcollhandle2::n_new_nmnlcollhandle2  (12 insns)
// 0x10047aa4  nmnlcollhandle2::vfunc_14  (41 insns)
//   calls:   -> nSoundNode::vfunc_35
// 0x10047b0b  nmnlcollhandle2::vfunc_16  (7 insns)
//   calls:   -> navoidcollision::vfunc_16
// 0x10047b22  nmnlcollhandle2::vfunc_18  (237 insns)
//   calls:   -> nStateNode::GetServiceData, IAT: nkernel.dll!n_printf, -> nContainer::GetPosition, -> nContainer::SetPosition, -> nContainer::GetDirection, -> nCollideObject::Transform, -> nconsumption::vfunc_37, -> ncollhandle2::vfunc_18
//   consts:  f32=0.5, f32=0, f32=1e-09
// 0x10047dab  nmnlcollhandle2::vfunc_00  (45 insns)
//   strings: 'v_addcollclass_s', 'i_getnumcollclasses_v', 's_getcollclass_i', 'v_setallowlanding_b', 'b_getallowlanding_v'
// 0x10047e50  nmnlcollhandle2::cmd_addcollclass (v_addcollclass_s)  (10 insns)
// 0x10047e73  nmnlcollhandle2::cmd_getnumcollclasses (i_getnumcollclasses_v)  (13 insns)
// 0x10047e9c  nmnlcollhandle2::cmd_getcollclass (s_getcollclass_i)  (28 insns)
// 0x10047ef0  nmnlcollhandle2::cmd_setallowlanding (v_setallowlanding_b)  (10 insns)
// 0x10047f14  nmnlcollhandle2::cmd_getallowlanding (b_getallowlanding_v)  (13 insns)
// 0x10047f40  nmnlcollhandle2::vfunc_11  (86 insns)
//   calls:   -> ncollhandle2::vfunc_11, IAT: nkernel.dll!n_strncpy2

} // namespace re_nnomads
