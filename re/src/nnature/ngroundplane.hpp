#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/ngroundplane.asm
// Class: ngroundplane : public nvisnode  (sizeof = 0xcc = 204 bytes)

#include <cstdint>

namespace re_nnature {

struct ngroundplane_Layout {
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
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b8
    uint32_t field_0x00b8;
};

// Methods (14):
// 0x10009af4  ngroundplane::n_init_ngroundplane  (10 insns)
//   strings: 'nvisnode'
// 0x10009b15  ngroundplane::n_fini_ngroundplane  (5 insns)
// 0x10009b27  ngroundplane::n_new_ngroundplane  (44 insns)
//   strings: '/sys/servers/gfx', '/sys/servers/specialfx'
// 0x10009bba  ngroundplane::vfunc_00  (30 insns)
// 0x10009c11  ngroundplane::vfunc_14  (17 insns)
//   calls:   -> nAnimNode::vfunc_14
// 0x10009c3f  ngroundplane::vfunc_15  (194 insns)
//   calls:   -> nAnimNode::vfunc_15
//   consts:  f32=30, f32=44
// 0x10009e86  ngroundplane::vfunc_21  (63 insns)
// 0x10009f0d  ngroundplane::vfunc_22  (57 insns)
//   calls:   IAT: MSVCRT.dll!printf
//   consts:  f32=1, f32=0.2941177
// 0x10009f9f  ngroundplane::vfunc_23  (2 insns)
// 0x10009fa2  ngroundplane::vfunc_24  (22 insns)
//   consts:  f32=30
// 0x10009fda  ngroundplane::vfunc_25  (7 insns)
//   consts:  f32=7
// 0x10009ff5  ngroundplane::vfunc_26  (32 insns)
// 0x1000a046  ngroundplane::vfunc_27  (492 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f64=0
//   strings: 'NOT INITIALIZED', 'Aborting.', 'c:/nomads/code/inc\\kernel/nautoref.h'
// 0x1000a5e7  ngroundplane::vfunc_11  (10 insns)
//   calls:   -> nClass::vfunc_36

} // namespace re_nnature
