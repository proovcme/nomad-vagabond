#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/noctree.asm
// Class: noctree : public nroot

#include <cstdint>

namespace re_nnebula {

struct noctree_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x003c
    float field_0x003c;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0048
    uint32_t field_0x0048;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint8_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00a8
    uint32_t field_0x00a8;
};

// Script AddCmds (4):
//   v_setsubdivnum_i
//   i_getsubdivnum_v
//   v_setvisualize_b
//   b_getvisualize_v

// Methods (16):
// 0x1001832b  noctree::n_init_noctree  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'misc/noctree_init.cc'
// 0x10018386  noctree::n_fini_noctree  (14 insns)
// 0x100183a9  noctree::n_new_noctree  (10 insns)
// 0x100183c3  noctree::n_version_noctree  (60 insns)
//   consts:  f32=-100000, f32=100000
// 0x1001848f  noctree::vfunc_00  (13 insns)
// 0x100184b6  noctree::vfunc_14  (5 insns)
// 0x100184c8  noctree::vfunc_16  (3 insns)
// 0x100187d7  noctree::vfunc_18  (28 insns)
//   consts:  f32=199999
// 0x10018824  noctree::vfunc_19  (5 insns)
// 0x10018834  noctree::vfunc_20  (22 insns)
//   consts:  f32=0
// 0x10018870  noctree::vfunc_21  (515 insns)
//   consts:  f32=0.5, f32=0.7
// 0x10018d9e  noctree::vfunc_25  (586 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10019318  noctree::vfunc_22  (36 insns)
// 0x1001937c  noctree::vfunc_24  (41 insns)
// 0x100193ee  noctree::vfunc_23  (476 insns)
//   strings: 'v_setsubdivnum_i', 'i_getsubdivnum_v', 'v_setvisualize_b', 'b_getvisualize_v'
// 0x10019870  noctree::cmd_getsubdivnum (i_getsubdivnum_v)  (14 insns)

} // namespace re_nnebula
