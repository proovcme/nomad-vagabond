#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/npointemitter.asm
// Class: npointemitter : public npservemitter  (sizeof = 0x154 = 340 bytes)

#include <cstdint>

namespace re_nparticle {

struct npointemitter_Layout {
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
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x00cc
    float field_0x00cc;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00f0
    float field_0x00f0;
    // +0x00f4
    float field_0x00f4;
    // +0x012c
    uint32_t field_0x012c;
    // +0x0150
    uint32_t field_0x0150;
};

// Methods (5):
// 0x10002dca  npointemitter::n_init_npointemitter  (10 insns)
//   strings: 'npservemitter'
// 0x10002deb  npointemitter::n_fini_npointemitter  (5 insns)
// 0x10002dfd  npointemitter::n_new_npointemitter  (47 insns)
//   strings: '/sys/servers/gfx', '/sys/servers/math'
// 0x10002e8b  npointemitter::vfunc_00  (30 insns)
// 0x10002ee2  npointemitter::vfunc_15  (561 insns)
//   calls:   -> nAnimNode::vfunc_15, IAT: MSVCRT.dll!floor
//   consts:  f32=0, f32=6.283185

} // namespace re_nparticle
