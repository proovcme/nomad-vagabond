#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/ntrailrender.asm
// Class: ntrailrender : public nprender  (sizeof = 0x1ac = 428 bytes)

#include <cstdint>

namespace re_nparticle {

struct ntrailrender_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint8_t field_0x0038;
    // +0x0039
    uint8_t field_0x0039;
    // +0x003c
    uint32_t field_0x003c;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0058
    uint32_t field_0x0058;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00f0
    uint32_t field_0x00f0;
    // +0x0108
    uint32_t field_0x0108;
    // +0x0130
    uint32_t field_0x0130;
    // +0x0150
    uint32_t field_0x0150;
    // +0x0154
    uint32_t field_0x0154;
    // +0x0158
    uint32_t field_0x0158;
    // +0x015c
    uint32_t field_0x015c;
    // +0x0160
    uint32_t field_0x0160;
    // +0x0164
    uint32_t field_0x0164;
    // +0x0168
    uint32_t field_0x0168;
};

// Methods (6):
// 0x100089b0  ntrailrender::n_init_ntrailrender  (10 insns)
//   strings: 'nprender'
// 0x100089d1  ntrailrender::n_fini_ntrailrender  (5 insns)
// 0x100089e3  ntrailrender::n_new_ntrailrender  (55 insns)
//   strings: '/sys/servers/gfx'
// 0x10008a9e  ntrailrender::vfunc_00  (660 insns)
//   consts:  f32=0.5
//   strings: 'ntrailrender_ibuf'
// 0x10009241  ntrailrender::vfunc_14  (21 insns)
//   calls:   -> nAnimNode::vfunc_14
// 0x1000927f  ntrailrender::vfunc_15  (319 insns)
//   calls:   -> nAnimNode::vfunc_15
//   consts:  f32=1, f64=1.030792151e+11, f32=256

} // namespace re_nparticle
