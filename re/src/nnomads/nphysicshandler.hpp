#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nphysicshandler.asm
// Class: nphysicshandler : public nroot  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct nphysicshandler_Layout {
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
    // +0x0044
    float field_0x0044;
    // +0x0048
    float field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint8_t field_0x0058;
};

// Script AddCmds (4):
//   v_resetblist_v
//   v_addblayer_ffffffffffff
//   v_setvisualizeblayer_b
//   b_getvisualizeblayer_v

// Methods (15):
// 0x1000102f  nphysicshandler::vfunc_00  (14 insns)
//   calls:   -> nphysicshandler::vfunc_16
// 0x10001058  nphysicshandler::vfunc_14  (5 insns)
// 0x10001069  nphysicshandler::vfunc_15  (18 insns)
//   consts:  f64=0, f32=-0.69
// 0x1000109d  nphysicshandler::vfunc_16  (12 insns)
// 0x100010b7  nphysicshandler::vfunc_17  (47 insns)
// 0x1000112a  nphysicshandler::vfunc_18  (28 insns)
// 0x1000116c  nphysicshandler::vfunc_19  (102 insns)
// 0x10001267  nphysicshandler::vfunc_20  (14 insns)
//   consts:  f32=9.81
// 0x10001c83  nphysicshandler::n_init_nphysicshandler  (15 insns)
//   strings: 'nroot'
// 0x10001cae  nphysicshandler::n_fini_nphysicshandler  (5 insns)
// 0x10001cc0  nphysicshandler::n_new_nphysicshandler  (10 insns)
// 0x10001cd7  nphysicshandler::n_version_nphysicshandler  (30 insns)
//   strings: 'v_resetblist_v', 'v_addblayer_ffffffffffff', 'v_setvisualizeblayer_b', 'b_getvisualizeblayer_v'
// 0x10001d4a  nphysicshandler::cmd_addblayer (v_addblayer_ffffffffffff)  (78 insns)
// 0x10001e2f  nphysicshandler::vfunc_22  (108 insns)
//   consts:  f32=0.5
// 0x10001f3b  nphysicshandler::vfunc_23  (871 insns)
//   consts:  f32=0.2094395, f32=6.283185, f64=0, f32=0.1

} // namespace re_nnomads
